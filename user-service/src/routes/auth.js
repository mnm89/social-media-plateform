const express = require("express");
const { getAccessToken } = require("../helpers/accessToken");
const router = express.Router();

// Endpoint for user registration
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Step 1: Obtain an admin access token for the service account
    const token = await getAccessToken();

    // Step 2: Create the user in Keycloak
    const createUserResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: email,
          email,
          firstName,
          lastName,
          enabled: true,
          credentials: [
            { type: "password", value: password, temporary: false },
          ],
        }),
      }
    );

    if (!createUserResponse.ok) {
      console.error("Error creating user account:", createUserResponse.status);
      return res.status(500).json({ message: "Failed to create user" });
    }

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// Endpoint for user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Authenticate the user with Keycloak
    const loginResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_WEB_CLIENT_ID,
          grant_type: "password",
          username,
          password,
        }),
      }
    );

    if (!loginResponse.ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokens = await loginResponse.json();
    return res.status(200).json(tokens);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// Refresh token route
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    // Request a new access token from Keycloak
    const response = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_WEB_CLIENT_ID,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.error });
    }

    const tokens = await response.json();
    return res.status(200).json(tokens);
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Failed to refresh token" });
  }
});

module.exports = router;
