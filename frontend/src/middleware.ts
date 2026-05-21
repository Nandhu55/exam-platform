import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest
) {

  const adminToken =
    request.cookies.get(
      "admin_token"
    );

  const pathname =
    request.nextUrl.pathname;

  // ALLOW LOGIN PAGE
  if (
    pathname === "/admin/login"
  ) {
    return NextResponse.next();
  }

  // PROTECT ALL ADMIN ROUTES
  if (
    pathname.startsWith("/admin")
  ) {

    if (!adminToken) {

      return NextResponse.redirect(
        new URL(
          "/admin/login",
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*"
  ],
};