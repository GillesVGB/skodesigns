import {
  configured,
  randomToken,
  redirectUri,
  setCookie,
  staffConfig,
  publicOrigin,
} from "@/lib/staff-auth";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") || "en";
  const locale = ["nl", "en", "fr"].includes(lang) ? lang : "en";
  if (!configured())
    return Response.redirect(
      new URL(`/${locale}/admin/?login=setup`, publicOrigin(request)),
      303,
    );
  const state = randomToken();
  const target = new URL("https://discord.com/oauth2/authorize");
  target.search = new URLSearchParams({
    client_id: staffConfig().clientId,
    redirect_uri: redirectUri(request),
    response_type: "code",
    scope: "identify guilds.members.read",
    state,
    prompt: "consent",
  }).toString();
  return new Response(null, {
    status: 303,
    headers: {
      Location: target.href,
      "Set-Cookie": setCookie(request, "sko-oauth", `${state}:${locale}`, 600),
      "Cache-Control": "no-store",
    },
  });
}
