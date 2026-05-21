import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest
) {

  const token =
    request.cookies.get(
      "admin_token"
    )?.value;

  const isAdminRoute =
    request.nextUrl.pathname.startsWith(
      "/admin"
    );

  const isLoginPage =
    request.nextUrl.pathname ===
    "/admin/login";

  // NOT LOGGED IN
  if (
    isAdminRoute &&
    !isLoginPage &&
    !token
  ) {

    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url
      )
    );
  }

  // ALREADY LOGGED IN
  if (
    isLoginPage &&
    token
  ) {

    return NextResponse.redirect(
      new URL(
        "/admin/dashboard",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {

  matcher: [
    "/admin/:path*",
  ],
};