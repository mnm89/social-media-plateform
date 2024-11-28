import { getAccessToken } from '@social-media-platform/keycloak-utils';
import express from 'express';
import { ensureDefaultPrivacySettings } from '../utils';
const router = express.Router();

// Endpoint for user registration
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;

  try {
    // Step 1: Obtain an admin access token for the service account
    const token = await getAccessToken();

    // Step 2: Create the user in Keycloak
    const createUserResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          firstName,
          lastName,
          enabled: true,
          credentials: [
            { type: 'password', value: password, temporary: false },
          ],
          //TODO: CHECK THIS
          emailVerified: 'true',
        }),
      }
    );

    if (!createUserResponse.ok) {
      console.error('Error creating user account:', createUserResponse.status);
      return res.status(500).json({ message: 'Failed to create user' });
    }

    // The response will not contain a body, but the 'Location' header will have the user ID
    const locationHeader = createUserResponse.headers.get('Location');
    const userId = locationHeader.split('/').pop(); // Extract the UUID from the URL

    // Step 3: Get the default realm role id
    const roleResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/roles/default-roles-${process.env.KEYCLOAK_REALM}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!roleResponse.ok) {
      console.error(
        'Error creating user account - getting default realm role:',
        roleResponse.status
      );
      return res.status(500).json({ message: 'Failed to create user' });
    }

    const { id: roleId } = await roleResponse.json();

    // Step 4: Revoke the "default-roles-{realm-name}" role from the user
    const revokeResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/role-mappings/realm`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([
          {
            id: roleId,
            name: `default-roles-${process.env.KEYCLOAK_REALM}`,
          },
        ]),
      }
    );
    if (!revokeResponse.ok) {
      console.error(
        'Error creating user account - revoking default realm role ' +
          roleId +
          ' for user: ' +
          userId,
        revokeResponse.status
      );
      return res.status(500).json({ message: 'Failed to create user' });
    }

    // Step 5: Assign the "user" role to the new user
    const userRoleResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/roles/user`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!userRoleResponse.ok) {
      console.error(
        'Error creating user account - getting user role: ',
        userRoleResponse.status
      );
      return res.status(500).json({ message: 'Failed to create user' });
    }
    const { id: userRoleId } = await userRoleResponse.json();

    const assignResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/role-mappings/realm`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([
          {
            id: userRoleId,
            name: `user`,
          },
        ]),
      }
    );
    if (!assignResponse.ok) {
      console.error(
        'Error creating user account - assigning user role: ',
        assignResponse.status
      );
      return res.status(500).json({ message: 'Failed to create user' });
    }

    //Step 6: Ensure privacy settings exist for this user
    await ensureDefaultPrivacySettings(userId);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Authenticate the user with Keycloak
    const loginResponse = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_WEB_CLIENT_ID,
          grant_type: 'password',
          username,
          password,
        }),
      }
    );

    if (!loginResponse.ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokens = await loginResponse.json();
    return res.status(200).json(tokens);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// Refresh token route
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    // Request a new access token from Keycloak
    const response = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_WEB_CLIENT_ID,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.error });
    }

    const tokens = await response.json();
    return res.status(200).json(tokens);
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({ message: 'Failed to refresh token' });
  }
});

export default router;
