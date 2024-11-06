const NodeCache = require("node-cache");
const { getAccessToken } = require("./accessToken");
const userCache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // Cache for 5 minutes
async function getUserAuthorName(userId) {
  const { username } = await getUserDetails(userId);
  return username;
}

async function getUserDetails(userId) {
  let user = userCache.get(userId);
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
      user = await userResponse.json();

      userCache.set(userId, user); // Cache the user details
    }
  }
  return user;
}

module.exports = { getUserAuthorName, getUserDetails };
