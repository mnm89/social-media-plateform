import { NextResponse } from "next/server";
import { refreshToken } from "../actions/refresh";
import { cookies } from "next/headers";
import { isTokenExpired } from "../lib/token";

export async function middleware(req) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (accessToken && isTokenExpired(accessToken)) {
    try {
      const newAccessToken = await refreshToken(cookieStore);
      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken);
      return response;
    } catch (error) {
      console.error("Middleware token refresh failed:", error);
      return NextResponse.redirect("/login");
    }
  }

  return NextResponse.next();
}
