const NodeCache = require("node-cache");
const { getAccessToken } = require("./accessToken");
const storageCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

async function getUserAvatar(userId) {
  const storage = await getStorageUser(userId);
  return storage?.url;
}

async function getStorageUser(userId) {
  let storage = storageCache.get(userId);
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
      storage = await storageResponse.json();

      storageCache.set(userId, storage); // Cache the storage details
    } else {
      console.error("Error retrieving user storage:", storageResponse.status);
    }
  }
  return storage;
}

module.exports = { getStorageUser, getUserAvatar };
