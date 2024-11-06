"use server";
import { cookies } from "next/headers";

export async function refreshToken() {
  const refreshToken = (await cookies()).get("refreshToken")?.value;

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await fetch(`${process.env.API_GATEWAY_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    throw new Error("Invalid token");
  }
  const { access_token, refresh_token } = await response.json();

  return { access_token, refresh_token };
}
