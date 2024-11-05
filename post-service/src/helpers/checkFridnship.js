const { getAccessToken } = require("./accessToken");

// Check if the user is friends with the specified friendId
async function isFriend(userId, friendId) {
  const token = await getAccessToken();
  try {
    const response = await fetch(
      `${process.env.USER_SERVICE_URL}/friends/check?userId=${userId}&friendId=${friendId}`,
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

    const data = await response.json();
    return data.isFriend;
  } catch (error) {
    console.error("Error checking friendship status:", error);
    return false; // Default to "not friends" if the check fails
  }
}

module.exports = { isFriend };
