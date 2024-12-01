import { cache } from './config';
import { getAccessToken } from '@social-media-platform/keycloak-utils';

export async function getUser(id: string) {
  const token = await getAccessToken();
  const response = await fetch(`${process.env.USER_SERVICE_URL}/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) return response.json();
}

export async function getUserName(id: string) {
  const cached = await cache.get(`user:${id}`);
  if (cached) return JSON.parse(cached).username;
  const user = await getUser(id);
  if (user) return user.username;
}

export async function getUserAvatarUrl(id: string) {
  const cached = await cache.get(`avatar:${id}`);
  if (cached) return JSON.parse(cached).url;
  const user = await getUser(id);
  if (user) return user.avatar;
}
export async function isFriend(userId, friendId) {
  const [first, second] = [userId, friendId].sort();
  const key = `${first}|${second}`;
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);
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
      console.error('Failed to check friendship status:', response.statusText);
      return false; // Default to "not friends" if the check fails
    }

    const { isFriend } = await response.json();
    cache.set(key, JSON.stringify(isFriend));
    return isFriend;
  } catch (error) {
    console.error('Error checking friendship status:', error);
    return false; // Default to "not friends" if the check fails
  }
}
