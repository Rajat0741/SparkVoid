import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");
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
