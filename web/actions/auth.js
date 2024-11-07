"use server";
import { cookies } from "next/headers";
import { handleNonOkResponse } from "@/lib/api";

export async function refreshToken() {
  const refreshToken = (await cookies()).get("refresh_token")?.value;

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }
  console.log("Refreshing access token");
  const response = await fetch(`${process.env.API_GATEWAY_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}

export async function loginAction(username, password) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}
export async function registerAction(firstName, lastName, email, password) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
    }),
  });

  if (response.status === 201) {
    return { success: true, message: "Account created successfully" };
  }
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}