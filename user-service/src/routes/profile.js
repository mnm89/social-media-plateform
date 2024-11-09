const express = require("express");
const { getUserProfileWithPrivacy } = require("../helpers/profilePrivacy");
const { getKeycloakUser } = require("../helpers/keycloakUser");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/:id", authenticate, async (req, res) => {
  const userId = req.params.id;
  const user = await getKeycloakUser(userId);
  if (!user) {
    return res.status(404).json({ message: "Failed to find user" });
  }

  const profile = await getUserProfileWithPrivacy(userId, req.user?.sub);

  res.json(profile);
});

module.exports = router;
