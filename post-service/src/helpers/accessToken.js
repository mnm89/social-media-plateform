let accessToken = null;
let tokenExpiry = null;

async function refreshAccessToken() {
  try {
    const response = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to refresh access token:", response.statusText);
      return;
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Set token expiry time (expires_in is in seconds)
    tokenExpiry = Date.now() + data.expires_in * 1000;
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
}

// Automatically refreshes the token if expired
async function getAccessToken() {
  if (!accessToken || Date.now() >= tokenExpiry) {
    await refreshAccessToken();
  }
  return accessToken;
}
module.exports = { getAccessToken, refreshAccessToken };
