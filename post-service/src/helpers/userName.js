const { getAccessToken } = require("./accessToken");
const cache = require("../config/cache");

async function getUserName(userId) {
  const { username } = await getUser(userId);
  return username;
}

async function getUser(userId) {
  let user = await cache.get(`user:${userId}`);
  if (!user) {
    const token = await getAccessToken();
    const userResponse = await fetch(
      `${process.env.USER_SERVICE_URL}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (userResponse.ok) {
      const json = await userResponse.json();
      cache.set(`user:${userId}`, JSON.stringify(json)); // Cache the user details
      return json;
    }
  }
  console.log({ user });
  return JSON.parse(user);
}

module.exports = { getUserName, getUser };
