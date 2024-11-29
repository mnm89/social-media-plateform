import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isTokenExpired } from "@/lib/token";
import { isPublicPath } from "@/lib/url";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next(); // Allow access without authentication
  }
  // Define paths to exclude from authentication check
  const token = await (await cookies()).get("access_token")?.value;

  if (token && isTokenExpired(token)) {
    console.error("Middleware token expiry detected", { pathname });
    // const loginUrl = req.nextUrl.clone();
    // loginUrl.pathname = "/login?redirectTo=" + pathname;
    // return NextResponse.redirect(loginUrl);
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
