import { env } from "@/lib/platform";
import {
  configured,
  cookie,
  discordRequest,
  encryptToken,
  hasStaffRole,
  hashToken,
  randomToken,
  redirectUri,
  setCookie,
  staffConfig,
  publicOrigin,
} from "@/lib/staff-auth";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const [savedState, savedLang] = cookie(request, "sko-oauth").split(":");
  const lang = ["nl", "en", "fr"].includes(savedLang) ? savedLang : "en";
  const finish = (result: string, sessionCookie?: string) => {
    const headers = new Headers({
      Location: new URL(`/${lang}/admin/?login=${result}`, publicOrigin(request)).href,
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    });
    headers.append("Set-Cookie", setCookie(request, "sko-oauth", "", 0));
    if (sessionCookie) headers.append("Set-Cookie", sessionCookie);
    return new Response(null, { status: 303, headers });
  };
  if (!configured() || !env.DB) return finish("setup");
  if (
    !savedState ||
    !/^[a-f0-9]{64}$/.test(savedState) ||
    url.searchParams.get("state") !== savedState ||
    !url.searchParams.get("code")
  )
    return finish("error");
  try {
    const c = staffConfig();
    const exchange = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: c.clientId,
        client_secret: c.clientSecret,
        grant_type: "authorization_code",
        code: url.searchParams.get("code")!,
        redirect_uri: redirectUri(request),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!exchange.ok) return finish("error");
    const token = (await exchange.json()) as {
      access_token?: string;
      expires_in?: number;
    };
    if (!token.access_token || !(await hasStaffRole(token.access_token)))
      return finish("denied");
    const profile = await discordRequest("/users/@me", token.access_token);
    if (!profile.ok) return finish("error");
    const user = (await profile.json()) as {
      id: string;
      username: string;
      global_name?: string;
      avatar?: string;
    };
    if (!/^\d{17,22}$/.test(user.id)) return finish("error");
    const sessionToken = randomToken();
    const lifetime = Math.max(1, Math.min(3600, token.expires_in || 3600));
    const avatar =
      user.avatar && /^[a-zA-Z0-9_]+$/.test(user.avatar)
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=128`
        : null;
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO staff_sessions (id,user_id,name,avatar,token_cipher,expires_at,verified_at) VALUES (?,?,?,?,?,?,?)",
      ).bind(
        await hashToken(sessionToken),
        user.id,
        user.global_name || user.username,
        avatar,
        await encryptToken(token.access_token),
        Date.now() + lifetime * 1000,
        Date.now(),
      ),
      env.DB.prepare("DELETE FROM staff_sessions WHERE expires_at <= ?").bind(
        Date.now(),
      ),
    ]);
    return finish(
      "ok",
      setCookie(request, "sko-admin", sessionToken, lifetime),
    );
  } catch {
    return finish("error");
  }
}
