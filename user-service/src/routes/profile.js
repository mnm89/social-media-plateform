const express = require("express");
const { buildUserProfileWithPrivacy } = require("../helpers/profilePrivacy");
const { getKeycloakUser } = require("../helpers/keycloakUser");
const keycloak = require("../config/keycloak");
const { getAccessToken } = require("../helpers/accessToken");
const { Privacy } = require("../models");
/**
 * @type {import('ioredis').Redis}
 */
const cache = require("../config/cache");

const router = express.Router();

router.get("/", keycloak.protect("realm:user"), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const user = await getKeycloakUser(userId);

  const { profile, privacy } = await buildUserProfileWithPrivacy(user, userId);
  res.json({ profile, privacy });
});

router.put("/privacy", keycloak.protect("realm:user"), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const { profile, privacy } = req.body;
  let user = await getKeycloakUser(userId);
  const promises = Object.entries(privacy).map(([attribute, visibility]) =>
    Privacy.update(
      { visibility },
      {
        where: {
          userId,
          attribute,
        },
      }
    )
  );

  await Promise.all(promises);

  const payload = {
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    attributes: Object.keys(profile).reduce((p, c) => {
      p[c] = [profile[c]];
      return p;
    }, {}),
  };

  const token = await getAccessToken();
  const response = await fetch(
    `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    console.error("Error patching user profile:", response.status);

    return res.status(500).json({ message: "Error patching user profile" });
  }
  await cache.del(`user:${userId}`);
  user = await getKeycloakUser(userId);
  res.json(user);
});

router.put("/identity", keycloak.protect("realm:user"), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const { firstName, lastName, email, username } = req.body;
  let user = await getKeycloakUser(userId);

  const payload = {
    email,
    username,
    firstName,
    lastName,
    attributes: user.attributes,
  };
  console.log({ payload });

  const token = await getAccessToken();
  const response = await fetch(
    `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    console.error("Error patching user identity:", response.status);

    return res.status(500).json({ message: "Error patching user identity" });
  }
  await cache.del(`user:${userId}`);
  user = await getKeycloakUser(userId);
  res.json(user);
});

router.put("/password", keycloak.protect("realm:user"), async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.kauth.grant.access_token.content.sub;
  const userName = req.kauth.grant.access_token.content.preferred_username;

  try {
    // Step 1: Verify current password
    const loginResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_WEB_CLIENT_ID,
          grant_type: "password",
          username: userName,
          password: currentPassword,
        }),
      }
    );

    if (!loginResponse.ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Step 2: Obtain an admin access token for the service account
    const token = await getAccessToken();

    // Step 3: Reset user password
    const response = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/reset-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "password",
          value: newPassword,
          temporary: false,
        }),
      }
    );
    if (!response.ok) {
      console.error("Error patching user password:", response.status);

      return res.status(500).json({ message: "Error patching user password" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
