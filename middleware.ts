import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  // www → non-www 301リダイレクト（Vercel CDNレイヤーを通過するためmiddlewareで処理）
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    return NextResponse.redirect(url, { status: 301 });
  }

  const { pathname } = request.nextUrl;

  // Add pathname header for layout detection
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // 管理APIの保護（ブログ統合分。未認証は401 JSON）
  // ※ /api/staff/upload はスタッフがログイン不要で投稿するため保護対象外
  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("admin_session")?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    const token = request.cookies.get("admin_session")?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
