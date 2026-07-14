import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/app/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
    
    "/dashboard/:path*",
    "/favorites/:path*",
    "/profile/:path*",
    "/reading-list/:path*",
    "/reviews/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/admin/:path*",

    */
  ],
};
