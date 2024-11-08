const NodeCache = require("node-cache");
const { getAccessToken } = require("./accessToken");
const userCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });
async function getUserName(userId) {
  const { username } = await getKeycloakUser(userId);
  return username;
}
async function getUserAvatar(userId) {
  const { avatar } = await getKeycloakUser(userId);
  return avatar;
}

async function getKeycloakUser(userId) {
  let user = userCache.get(userId);
  if (!user) {
    const token = await getAccessToken();
    const userResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (userResponse.ok) {
      user = await userResponse.json();

      userCache.set(userId, user); // Cache the user details
    }
  }
  return user;
}

module.exports = { getKeycloakUser, getUserAvatar, getUserName };
