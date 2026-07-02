import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE, verifyToken } from "@/lib/token";

const LOGIN_PATH = "/admin/login";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const authed = verifyToken(token);

  if (pathname === LOGIN_PATH) {
    if (authed) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!authed) {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
