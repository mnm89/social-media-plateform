"use server";
import { cookies } from "next/headers";
import { handleNonOkResponse } from "@/lib/api";

export async function refreshToken(refreshToken = "") {
  if (!refreshToken) {
    // try to get token from headers of not provided
    refreshToken = (await cookies()).get("refresh_token")?.value;
  }

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
  if (response.ok) return response.json();

  console.error("Failed refreshing access token", response.statusText);
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
export async function registerAction({
  firstName,
  lastName,
  email,
  password,
  username,
}) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      username,
      password,
    }),
  });

  if (response.status === 201) {
    return { success: true, message: "Account created successfully" };
  }
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}

export async function logoutAction() {
  (await cookies()).delete("refresh_token");
  (await cookies()).delete("access_token");
}
