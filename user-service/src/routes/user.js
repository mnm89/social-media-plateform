const express = require("express");
const { Profile } = require("../models");
const keycloak = require("../config/keycloak");
const { getAccessToken } = require("../helpers/accessToken");

const router = express.Router();
router.use(keycloak.protect("realm:service"));

// Route to get another user's profile by user ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const token = await getAccessToken();
    const userResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!userResponse.ok) {
      console.error("Error retrieving user account:", userResponse.status);
      return res.status(500).json({ message: "Failed to find user" });
    }

    const user = await userResponse.json();

    // Find the profile by Keycloak user ID
    const profile = await Profile.findOne({
      where: { userId: id },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { bio, address, phone, privacy } = profile;
    const { username, email } = user;

    // Build the response based on privacy settings
    const response = {
      id,
      username,
      email,
      bio: privacy.bio === "public" ? bio : null,
      address: privacy.address === "public" ? address : null,
      phone: privacy.phone === "public" ? phone : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Failed to retrieve profile" });
  }
});
module.exports = router;
