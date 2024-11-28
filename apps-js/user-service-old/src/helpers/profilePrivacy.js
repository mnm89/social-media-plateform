const { getAccessToken } = require('./accessToken');
const { attributes, groups } = require('../config/profile');

async function ensureUsersProfileAttributes() {
  const token = await getAccessToken();

  try {
    const response = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/profile`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          attributes,
          groups,
        }),
      }
    );
    if (!response.ok) {
      console.error('Failed to bootstrap users profile:', response.statusText);
    }
  } catch (error) {
    console.error('Failed to bootstrap users profile:', error);
  }
}

module.exports = {
  ensureUsersProfileAttributes,
};
