"use server";

import { sessionOptions } from "../lib/session";
import { getIronSession } from "iron-session/edge";

export async function refreshToken(cookies) {
  const session = await getIronSession({ cookies }, sessionOptions);
  const { refreshToken } = session.user || {};

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await fetch(
    `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Invalid token");
  }
  const { access_token, refresh_token } = await response.json();

  // Update session with the new tokens
  session.user = { accessToken: access_token, refreshToken: refresh_token };
  await session.save();

  return access_token;
}
