const { getAccessToken } = require("./accessToken");
const { Privacy } = require("../models");
const { isFriends, isFriendshipRequested } = require("./isFriends");
const { attributes, groups, defaultPrivacy } = require("../config/profile");
const { getUserAvatarUrl } = require("./storageUser");

async function ensurePrivacySettings(userId) {
  const promises = defaultPrivacy.map(async ({ attribute, visibility }) => {
    const privacy = await Privacy.findOne({ where: { userId, attribute } });
    // No privacy found, so create default attribute privacy
    if (!privacy) await Privacy.create({ attribute, visibility, userId });
  });
  await Promise.all(promises);
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
  const isFriendshipExists = isAuthenticated
    ? await isFriendshipRequested(user.id, requesterId)
    : false;
  const isSameUser = user.id === requesterId;

  const avatar = await getUserAvatarUrl(user.id);

  const userProfile = defaultPrivacy.reduce(
    (p, c) => {
      if (user.attributes && user.attributes[c.attribute])
        p[c.attribute] = user.attributes[c.attribute][0];
      return p;
    },
    { id: user.id, avatar, isFriend, isFriendshipExists }
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
      isSameUser ||
      setting.visibility === "public" ||
      (setting.visibility === "private" && isAuthenticated) ||
      (setting.visibility === "friends-only" && isFriend)
    ) {
      filteredProfile[setting.attribute] = userProfile[setting.attribute];
    }
  });

  return { profile: filteredProfile, privacy: privacySettings };
}

module.exports = {
  ensurePrivacySettings,
  ensureUsersProfileAttributes,
  buildUserProfileWithPrivacy,
};
