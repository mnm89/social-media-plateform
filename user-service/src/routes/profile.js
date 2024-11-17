const express = require("express");
const {
  buildUserProfileWithPrivacy,
  ensurePrivacySettings,
} = require("../helpers/profilePrivacy");
const { getKeycloakUser } = require("../helpers/keycloakUser");
const keycloak = require("../config/keycloak");
const authenticate = require("../middleware/authenticate");
const { getAccessToken } = require("../helpers/accessToken");

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

router.put("/", keycloak.protect("realm:user"), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const patch = req.body;

  const payload = {
    attributes: Object.keys(patch).reduce((p, c) => {
      p[c] = [patch[c]];
    }, {}),
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
    console.error("Error patching user profile:", response.status);

    return res.status(500).json({ message: "Error patching user profile" });
  }

  const user = await getKeycloakUser(userId);
  const { profile, privacy } = await buildUserProfileWithPrivacy(user, userId);
  res.json({ profile, privacy });
});

module.exports = router;
