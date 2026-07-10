import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const sessionCookieName = isProd
    ? "__Secure-better-auth.session_token"
    : "better-auth.session_token";
  const sessionToken = request.cookies.get(sessionCookieName);
  const { pathname } = request.nextUrl;

  // Protect chat, search, and settings routes
  const PROTECTED_ROUTES = ["/search", "/settings"];
  const isProtectedRoute = PROTECTED_ROUTES.includes(pathname) || pathname.startsWith("/chat");

  if (isProtectedRoute) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated users visiting home or login to chat
  if (pathname === "/" || pathname === "/login") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/chat/:path*", "/login", "/search", "/settings"],
};
