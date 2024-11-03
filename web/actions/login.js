"use server";
import { cookies } from "next/headers";
import { sessionOptions } from "../lib/session";
import { getIronSession } from "iron-session/edge";

export async function loginAction(username, password) {
  const session = await getIronSession({ cookies }, sessionOptions);
  const response = await fetch(
    `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        grant_type: "password",
        username,
        password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const { access_token, refresh_token } = await response.json();
  // Update session with the new tokens
  session.user = { accessToken: access_token, refreshToken: refresh_token };
  await session.save();
}
