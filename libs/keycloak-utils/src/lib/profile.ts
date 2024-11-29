import { getAccessToken } from './token';

export async function ensureUsersProfileAttributes(attributes, groups) {
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
      console.error(
        'Failed to update users profile configuration:',
        response.statusText
      );
    } else {
      console.log('Users profile configuration updated');
    }
  } catch (error) {
    console.error('Failed to update users profile configuration:', error);
  }
}
