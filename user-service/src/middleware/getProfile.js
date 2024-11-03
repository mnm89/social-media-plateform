// src/middleware/getProfile.js
const Profile = require("../models/profile");

const getProfile = async (req, res, next) => {
  try {
    // Get the Keycloak user ID from the token
    const userId = req.kauth.grant.access_token.content.sub;

    // Look up the profile by userId
    let profile = await Profile.findOne({ where: { userId } });

    // If no profile exists, create a new one
    if (!profile) {
      profile = await Profile.create({ userId });
    }

    // Attach the profile to the request object
    req.profile = profile;
    next();
  } catch (error) {
    console.error("Error fetching or creating profile:", error);
    res.status(500).json({ error: "Failed to retrieve or create profile" });
  }
};

module.exports = getProfile;
