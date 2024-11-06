const express = require("express");
const getProfile = require("../middleware/getProfile");
const { Profile } = require("../models");
const keycloak = require("../config/keycloak");

const router = express.Router();
router.use(keycloak.protect("realm:user"));

// Route to get the authenticated user's profile
router.get("/", getProfile, (req, res) => {
  res.json(req.profile);
});
// Route to update the authenticated user's profile
router.put("/", getProfile, async (req, res) => {
  try {
    const { bio, address, phone } = req.body;
    // Update profile fields
    await req.profile.update({ bio, address, phone });
    res.json(req.profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});
// Route to delete the authenticated user's profile
router.delete("/", getProfile, async (req, res) => {
  try {
    await req.profile.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Failed to delete profile" });
  }
});
module.exports = router;
