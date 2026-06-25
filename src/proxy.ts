import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const sessionCookieName = isProd
    ? "__Secure-better-auth.session_token"
    : "better-auth.session_token";
  const sessionToken = request.cookies.get(sessionCookieName);
  const { pathname } = request.nextUrl;

  // Protect chat routes
  if (pathname.startsWith("/chat")) {
    if (!sessionToken) {
      // Redirect unauthenticated users to login page
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users trying to access login page to chat page
  if (pathname === "/login") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/login"],
};
