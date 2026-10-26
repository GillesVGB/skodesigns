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
    const lang = saved && ["nl", "en", "fr"].includes(saved) ? saved : "en";
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}${path}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/portfolio/:path*",
    "/pricing/:path*",
    "/services/:path*",
    "/about/:path*",
    "/reviews/:path*",
    "/contact/:path*",
    "/planner/:path*",
    "/store/:path*",
    "/admin/:path*",
  ],
};
