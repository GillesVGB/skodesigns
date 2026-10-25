import { env } from "cloudflare:workers";

export const staffConfig = () => ({
  clientId: env.DISCORD_CLIENT_ID || "",
  clientSecret: env.DISCORD_CLIENT_SECRET || "",
  guildId: env.DISCORD_GUILD_ID || "1562896437082071090",
  roleId: env.DISCORD_STAFF_ROLE_ID || "1563635614287663185",
});
export const configured = () => {
  const c = staffConfig();
  return (
    /^\d{17,22}$/.test(c.clientId) &&
    c.clientSecret.length > 10 &&
    /^\d{17,22}$/.test(c.guildId) &&
    /^\d{17,22}$/.test(c.roleId)
  );
};
export const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export function trustedProxy(r:Request){return !!env.SKO_PUBLIC_PROXY_SECRET && r.headers.get("X-Sko-Proxy-Secret") === env.SKO_PUBLIC_PROXY_SECRET;}
export function publicOrigin(r:Request){
  const forwarded=r.headers.get("X-Sko-Forwarded-Origin");
  if(trustedProxy(r)&&forwarded&&["https://skodesign.nl","https://www.skodesign.nl"].includes(forwarded))return forwarded;
  return new URL(r.url).origin;
}
export const sameOrigin = (r: Request) => r.headers.get("Origin") === publicOrigin(r);
export const cookie = (r: Request, name: string) => {
  const value = r.headers
    .get("Cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(name + "="))
    ?.slice(name.length + 1);
  try {
    return value ? decodeURIComponent(value) : "";
  } catch {
    return "";
  }
};
export function setCookie(
  r: Request,
  name: string,
  value: string,
  age: number,
) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${new URL(r.url).protocol === "https:" ? "; Secure" : ""}`;
}
export const randomToken = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
export const hashToken = async (token: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)),
    ),
    (b) => b.toString(16).padStart(2, "0"),
  ).join("");
async function cipherKey() {
  const material = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(staffConfig().clientSecret),
  );
  return crypto.subtle.importKey("raw", material, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}
export async function encryptToken(token: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const bytes = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      await cipherKey(),
      new TextEncoder().encode(token),
    ),
  );
  return btoa(String.fromCharCode(...iv, ...bytes));
}
async function decryptToken(cipher: string) {
  const bytes = Uint8Array.from(atob(cipher), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(
    await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: bytes.slice(0, 12) },
      await cipherKey(),
      bytes.slice(12),
    ),
  );
}
export function redirectUri(r: Request) {
  const origin=publicOrigin(r);
  // Keep production Discord OAuth on the public canonical domain, never the private Site origin.
  if(origin==="https://www.skodesign.nl"||origin==="https://skodesign.nl")return "https://www.skodesign.nl/api/auth/discord/callback/";
  if(origin==="http://127.0.0.1:5174")return origin+"/api/auth/discord/callback/";
  return (
    env.DISCORD_REDIRECT_URI ||
    new URL("/api/auth/discord/callback/", r.url).href
  );
}
export async function discordRequest(path: string, token: string) {
  return fetch("https://discord.com/api/v10" + path, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10000),
  });
}
export async function hasStaffRole(token: string) {
  const c = staffConfig();
  const response = await discordRequest(
    `/users/@me/guilds/${c.guildId}/member`,
    token,
  );
  if ([401, 403, 404].includes(response.status)) {
    console.warn("Discord membership access denied", response.status);
    return false;
  }
  if (!response.ok)
    throw new Error("Discord membership temporarily unavailable");
  const member = (await response.json()) as {
    roles?: string[];
    pending?: boolean;
  };
  const allowed =
    !member.pending &&
    Array.isArray(member.roles) &&
    member.roles.includes(c.roleId);
  if (!allowed)
    console.warn("Discord staff role missing or membership pending");
  return allowed;
}
type StaffSession = {
  id: string;
  user_id: string;
  name: string;
  avatar: string | null;
  token_cipher: string;
  expires_at: number;
  verified_at: number | null;
};
export async function requireStaff(
  request: Request,
): Promise<StaffSession | Response> {
  if (!configured() || !env.DB) return json({ error: "setup" }, 503);
  const token = cookie(request, "sko-admin");
  if (!/^[a-f0-9]{64}$/.test(token))
    return json({ error: "unauthorized" }, 401);
  const session = await env.DB.prepare(
    "SELECT * FROM staff_sessions WHERE id = ? AND expires_at > ?",
  )
    .bind(await hashToken(token), Date.now())
    .first<StaffSession>();
  if (!session) return json({ error: "unauthorized" }, 401);
  // Coalesce closely spaced dashboard/upload requests within Discord's rate limits.
  // Role removal takes effect within ten seconds; failures never grant a new session.
  if (session.verified_at && session.verified_at > Date.now() - 10_000)
    return session;
  try {
    if (!(await hasStaffRole(await decryptToken(session.token_cipher)))) {
      await env.DB.prepare("DELETE FROM staff_sessions WHERE id = ?")
        .bind(session.id)
        .run();
      return json({ error: "forbidden" }, 403);
    }
    await env.DB.prepare(
      "UPDATE staff_sessions SET verified_at = ? WHERE id = ?",
    )
      .bind(Date.now(), session.id)
      .run();
    return session;
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
