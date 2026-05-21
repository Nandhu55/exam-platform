import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const token =
    request.cookies.get("admin_token");

  const isAdminPage =
    request.nextUrl.pathname.startsWith("/admin");

  const isLoginPage =
    request.nextUrl.pathname === "/admin/login";

  // ALLOW LOGIN PAGE
  if (isLoginPage) {
    return NextResponse.next();
  }

  // PROTECT ADMIN ROUTES
  if (isAdminPage && !token) {

    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};