const { getAccessToken } = require("./accessToken");
const storageCache = require("../config/cache");

async function getUserAvatarUrl(userId) {
  const storage = await getUserAvatarStorage(userId);
  return storage?.url;
}

async function getUserAvatarStorage(userId) {
  let storage = storageCache.get(`avatar:${userId}`);
  if (!storage) {
    const token = await getAccessToken();
    const storageResponse = await fetch(
      `${process.env.FILE_SERVICE_URL}/avatars/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (storageResponse.ok) {
      const json = await storageResponse.json();
      storageCache.set(`avatar:${userId}`, JSON.stringify(json)); // Cache the storage model
      return json;
    } else {
      console.error("Error retrieving user storage:", storageResponse.status);
    }
  }
  return JSON.parse(storage);
}

module.exports = { getUserAvatarStorage, getUserAvatarUrl };
