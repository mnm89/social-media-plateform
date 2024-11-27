const { getAccessToken } = require("./accessToken");
const cache = require("../config/cache");
async function getUserName(userId) {
  const user = await getKeycloakUser(userId);
  return user?.username;
}

async function getKeycloakUser(userId) {
  let user = await cache.get(`user:${userId}`);
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
      const json = await userResponse.json();
      cache.set(`user:${userId}`, JSON.stringify(json)); // Cache the user details
      return json;
    } else {
      console.error("Error retrieving user account:", userResponse.status);
    }
  }
  return JSON.parse(user);
}

module.exports = { getKeycloakUser, getUserName };
