// src/routes/profiles.js
const express = require("express");
const router = express.Router();
const keycloak = require("../config/keycloak"); // Assuming you have Keycloak configured
const getProfile = require("../middleware/getProfile");

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

module.exports = router;
