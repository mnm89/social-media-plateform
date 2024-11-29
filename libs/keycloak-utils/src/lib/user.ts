import { getAccessToken } from './token';

export async function getKeycloakUser(userId) {
  const token = await getAccessToken();
  const userResponse = await fetch(
    `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (userResponse.ok) return await userResponse.json();

  console.error('Error retrieving user account:', userResponse.status);
}
