const NodeCache = require("node-cache");
const { getAccessToken } = require("./accessToken");
const userCache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // Cache for 5 minutes
async function getUserAuthorName(userId) {
  const token = await getAccessToken();
  let authorName = userCache.get(userId);
  if (!authorName) {
    const userResponse = await fetch(
      `${process.env.USER_SERVICE_URL}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (userResponse.ok) {
      const user = await userResponse.json();
      authorName = user.username;
      userCache.set(userId, authorName); // Cache the user details
    }
  }
  return authorName;
}

module.exports = { getUserAuthorName };
