import { NextRequest, NextResponse } from "next/server";
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (
    [
      "/portfolio",
      "/pricing",
      "/services",
      "/about",
      "/reviews",
      "/contact",
      "/planner",
      "/store",
      "/admin",
    ].includes(path.replace(/\/$/, ""))
  ) {
    const saved = request.cookies.get("sko-language")?.value;
    const lang = saved && ["nl", "en", "fr"].includes(saved) ? saved : "nl";
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}${path}`;
    return NextResponse.redirect(url);
  }
  const headers = new Headers(request.headers);
  const language = request.nextUrl.pathname.split("/")[1];
  headers.set(
    "x-sko-language",
    ["nl", "en", "fr"].includes(language) ? language : "nl",
  );
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (path.includes("/admin") || path.startsWith("/api/auth"))
    response.headers.set("Cache-Control", "no-store");
  return response;
}
export const config = {
  matcher: ["/((?!_next|assets|favicon|robots|sitemap).*)"],
};
