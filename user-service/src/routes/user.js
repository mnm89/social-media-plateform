const express = require("express");
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

    const { username, email } = user;

    //TODO Build the response based on a privacy model
    const response = {
      id,
      username,
      email,
    };

    res.json(response);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Failed to retrieve profile" });
  }
});
module.exports = router;
