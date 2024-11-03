import { NextResponse } from "next/server";
import { refreshToken } from "@/actions/refresh";
import { isTokenExpired } from "@/lib/token";
import { getAccessToken } from "@/lib/session";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Exclude static files, images, favicon, unauthenticated routes, and the home page
  const isUnauthenticatedPath = ["/login", "/register", "/"].includes(pathname);
  if (isUnauthenticatedPath) {
    return NextResponse.next(); // Allow access without authentication
  }
  // Define paths to exclude from authentication check
  const token = await getAccessToken();

  if (token && isTokenExpired(token)) {
    try {
      await refreshToken();
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware token refresh failed:", error);
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
// Excludes paths from middleware for:
// - Static files: _next/static
// - Image optimization files: _next/image
// - Favicon: favicon.ico
// - Common image file extensions

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
