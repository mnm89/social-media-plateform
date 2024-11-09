const express = require("express");
const {
  buildUserProfileWithPrivacy,
  ensurePrivacySettings,
} = require("../helpers/profilePrivacy");
const { getKeycloakUser } = require("../helpers/keycloakUser");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/:id", authenticate, async (req, res) => {
  const user = await getKeycloakUser(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Failed to find user" });
  }
  // Ensure privacy settings exist for this user
  await ensurePrivacySettings(req.params.id);

  const profile = await buildUserProfileWithPrivacy(user, req.user?.sub);

  res.json(profile);
});

module.exports = router;
