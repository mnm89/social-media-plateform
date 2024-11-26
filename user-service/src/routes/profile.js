const express = require("express");
const {
  buildUserProfileWithPrivacy,
  ensurePrivacySettings,
} = require("../helpers/profilePrivacy");
const { getKeycloakUser } = require("../helpers/keycloakUser");
const keycloak = require("../config/keycloak");
const authenticate = require("../middleware/authenticate");
const { getAccessToken } = require("../helpers/accessToken");
const { Privacy } = require("../models");
/**
 * @type {import('ioredis').Redis}
 */
const cache = require("../config/cache");

const router = express.Router();

router.get("/:id", authenticate, async (req, res) => {
  const user = await getKeycloakUser(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Failed to find user" });
  }
  // Ensure privacy settings exist for this user
  await ensurePrivacySettings(req.params.id);

  const { profile } = await buildUserProfileWithPrivacy(user, req.user?.sub);

  res.json(profile);
});
router.get("/", keycloak.protect("realm:user"), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const user = await getKeycloakUser(userId);
  await ensurePrivacySettings(userId);
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
  const profilePrivacy = await buildUserProfileWithPrivacy(user, userId);

  res.json(profilePrivacy);
});

module.exports = router;
