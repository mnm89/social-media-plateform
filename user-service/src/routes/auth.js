const express = require("express");
const router = express.Router();

// Endpoint for user registration
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Step 1: Obtain an admin access token for the service account
    const tokenResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_SERVICE_ACCOUNT_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_SERVICE_ACCOUNT_CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      }
    );

    if (!tokenResponse.ok) {
      return res.status(500).json({ error: "Failed to obtain access token" });
    }

    const { access_token } = await tokenResponse.json();

    // Step 2: Create the user in Keycloak
    const createUserResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
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
      return res.status(500).json({ error: "Failed to create user" });
    }

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
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
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          grant_type: "password",
          username,
          password,
        }),
      }
    );

    if (!loginResponse.ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const tokens = await loginResponse.json();
    return res.status(200).json(tokens);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
