const { getAccessToken } = require("./accessToken");
const { Privacy } = require("../models");
const { isFriends, isFriendshipRequested } = require("./isFriends");
const { attributes, groups, defaultPrivacy } = require("../config/profile");

async function ensurePrivacySettings(userId) {
  // Check if any privacy settings exist for this user
  const existingSettings = await Privacy.findOne({ where: { userId } });

  if (!existingSettings) {
    // No settings found, so create default settings
    const defaultSettings = defaultPrivacy.map((attr) => ({
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

async function buildUserProfileWithPrivacy(user, requesterId) {
  // Check friendship and authentication status
  const isAuthenticated = !!requesterId;
  const isFriend = isAuthenticated
    ? await isFriends(user.id, requesterId)
    : false;
  const isFriendshipRequested = isAuthenticated
    ? await isFriendshipRequested(user.id, requesterId)
    : false;

  const userProfile = attributes.reduce(
    (p, c) => {
      if (user.attributes && user.attributes[c.name])
        p[c.name] = user.attributes[c.name][0];

      if (user[c.name]) p[c.name] = user[c.name];

      return p;
    },
    { id: user.id, isFriend, isFriendshipRequested }
  );

  // Retrieve privacy settings and filter based on visibility
  const privacySettings = await Privacy.findAll({ where: { userId: user.id } });
  const filteredProfile = Object.fromEntries(
    Object.entries(userProfile).filter(
      ([key]) => !privacySettings.map((a) => a.attribute).includes(key)
    )
  );

  privacySettings.forEach((setting) => {
    if (
      setting.visibility === "public" ||
      (setting.visibility === "private" && isAuthenticated) ||
      (setting.visibility === "friends-only" && isFriend)
    ) {
      filteredProfile[setting.attribute] = userProfile[setting.attribute];
    }
  });

  return filteredProfile;
}

module.exports = {
  ensurePrivacySettings,
  ensureUsersProfileAttributes,
  buildUserProfileWithPrivacy,
};
