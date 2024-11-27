const express = require("express");
const { buildUserProfileWithPrivacy } = require("../helpers/profilePrivacy");
const { getKeycloakUser } = require("../helpers/keycloakUser");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/profiles/:id", authenticate, async (req, res) => {
  const user = await getKeycloakUser(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Failed to find user" });
  }

  const { profile } = await buildUserProfileWithPrivacy(user, req.user?.sub);

  res.json(profile);
});

router.get("/profiles", authenticate, async (req, res) => {
  res.json({ message: "not implemented" });
});

module.exports = router;
