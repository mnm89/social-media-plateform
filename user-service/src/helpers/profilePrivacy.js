const { getAccessToken } = require("./accessToken");
const { Privacy } = require("../models");
const { isFriends } = require("./isFriends");
const {
  attributes,
  groups,
  defaultPrivacyAttributes,
} = require("../config/profile");

async function ensurePrivacySettings(userId) {
  // Check if any privacy settings exist for this user
  const existingSettings = await Privacy.findOne({ where: { userId } });

  if (!existingSettings) {
    // No settings found, so create default settings
    const defaultSettings = defaultPrivacyAttributes.map((attr) => ({
      userId,
      ...attr,
    }));
    await Privacy.bulkCreate(defaultSettings);
  }
}
async function ensureUsersProfileAttributes() {
  const token = await getAccessToken();

  try {
    const response = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          attributes,
          groups,
        }),
      }
    );
    if (!response.ok) {
      console.error("Failed to bootstrap users profile:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to bootstrap users profile:", error);
  }
}
// services/privacyService.js

async function getUserProfileWithPrivacy(userId, requesterId) {
  // Ensure privacy settings exist for this user
  await ensurePrivacySettings(userId);

  // Check friendship and authentication status
  const isAuthenticated = !!requesterId;
  const isFriend = isAuthenticated
    ? await isFriends(userId, req.user.sub)
    : false;

  // Retrieve privacy settings and filter based on visibility
  const privacySettings = await Privacy.findAll({ where: { userId } });
  const filteredProfile = {};

  privacySettings.forEach((setting) => {
    if (
      setting.visibility === "public" ||
      (setting.visibility === "private" && isAuthenticated) ||
      (setting.visibility === "friends-only" && isFriend)
    ) {
      filteredProfile[setting.attribute] = setting.value;
    }
  });

  return filteredProfile;
}

module.exports = {
  ensurePrivacySettings,
  ensureUsersProfileAttributes,
  getUserProfileWithPrivacy,
};
