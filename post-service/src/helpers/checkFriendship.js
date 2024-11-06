const { getAccessToken } = require("./accessToken");
const NodeCache = require("node-cache");

const userCache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // Cache for 5 minutes

// Check if the user is friends with the specified friendId
async function isFriend(userId, friendId) {
  const [first, second] = [userId, friendId].sort();
  const key = `${first}|${second}`;
  if (userCache.has(key)) return userCache.get(key);
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `${process.env.USER_SERVICE_URL}/friendship/check?userId=${userId}&friendId=${friendId}`,
      {
        headers: {
          // Assuming `Authorization` is required for internal service requests
          Authorization: `Bearer ${token}`, // Ensure this token is managed securely
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to check friendship status:", response.statusText);
      return false; // Default to "not friends" if the check fails
    }

    const { isFriend } = await response.json();
    userCache.set(key, isFriend);
    return isFriend;
  } catch (error) {
    console.error("Error checking friendship status:", error);
    return false; // Default to "not friends" if the check fails
  }
}

module.exports = { isFriend };
