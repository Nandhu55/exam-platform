import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest
) {

  const path =
    request.nextUrl.pathname;

  const student =
    request.cookies.get(
      "student-session"
    );

  const admin =
    request.cookies.get(
      "admin-session"
    );

  const superAdmin =
    request.cookies.get(
      "super-admin-session"
    );

  if (
    path.startsWith(
      "/student-dashboard"
    ) &&
    !student
  ) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  if (
    path.includes("-admin") &&
    !admin
  ) {

    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url
      )
    );
  }

  if (
    path.startsWith(
      "/super-admin"
    ) &&
    !superAdmin
  ) {

    return NextResponse.redirect(
      new URL(
        "/super-admin/login",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {

  matcher: [

    "/student-dashboard/:path*",

    "/:collegeCode-admin/:path*",

    "/super-admin/:path*"
  ]
};