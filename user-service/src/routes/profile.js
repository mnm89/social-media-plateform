// src/routes/profiles.js
const express = require("express");
const router = express.Router();
const getProfile = require("../middleware/getProfile");
const keycloak = require("../config/keycloak");

// Route to get the authenticated user's profile
router.get("/", keycloak.protect("realm:user"), getProfile, (req, res) => {
  res.json(req.profile);
});

// Route to update the authenticated user's profile
router.put(
  "/",
  keycloak.protect("realm:user"),
  getProfile,
  async (req, res) => {
    try {
      const { bio, address, phone } = req.body;

      // Update profile fields
      await req.profile.update({ bio, address, phone });

      res.json(req.profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

// Route to delete the authenticated user's profile
router.delete(
  "/",
  keycloak.protect("realm:user"),
  getProfile,
  async (req, res) => {
    try {
      await req.profile.destroy();
      res.status(204).send(); // No content
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({ error: "Failed to delete profile" });
    }
  }
);

// Route to get another user's profile by user ID
router.get("/:userId", keycloak.protect("realm:user"), async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the profile by Keycloak user ID
    const profile = await Profile.findOne({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { bio, address, phone, privacy } = profile;

    // Build the response based on privacy settings
    const response = {
      userId,
      bio: privacy.bio === "public" ? bio : null,
      address: privacy.address === "public" ? address : null,
      phone: privacy.phone === "public" ? phone : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ error: "Failed to retrieve profile" });
  }
});

module.exports = router;
