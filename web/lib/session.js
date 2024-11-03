// lib/session.js
import { withIronSession } from "iron-session/next";

export const sessionOptions = {
  password: process.env.SESSION_SECRET, // Secure, random secret in .env
  cookieName: "keycloak-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSession(handler) {
  return withIronSession(handler, sessionOptions);
}
