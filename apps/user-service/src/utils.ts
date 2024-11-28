import {
  getAccessToken,
  getKeycloakUser,
} from '@social-media-platform/keycloak-utils';
import Friendship from './models/friendship';
import { Op } from 'sequelize';
import Privacy from './models/privacy';
import { cache } from './config';

export async function getUserName(id: string) {
  const cached = await cache.get(`user:${id}`);
  if (cached) return JSON.parse(cached).username;
  const user = await getKeycloakUser(id);
  if (user) {
    cache.set(`user:${id}`, JSON.stringify(user));
    return user.username;
  }
}

export async function getUserAvatarUrl(id: string) {
  const cached = await cache.get(`avatar:${id}`);
  if (cache) return JSON.parse(cached).url;
  const token = await getAccessToken();
  const response = await fetch(
    `${process.env.FILE_SERVICE_URL}/avatars/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.ok) {
    const json = await response.json();
    cache.set(`avatar:${id}`, JSON.stringify(json)); // Cache the storage model
    return json.url;
  }
}

export async function isFriends(user1, user2) {
  const friendship = await Friendship.findOne({
    where: {
      [Op.or]: [
        {
          userId: user1,
          friendId: user2,
          status: 'accepted',
        },
        {
          userId: user2,
          friendId: user1,
          status: 'accepted',
        },
      ],
    },
  });
  return !!friendship;
}

export async function isFriendshipRequested(user1, user2) {
  const friendship = await Friendship.findOne({
    where: {
      [Op.or]: [
        {
          userId: user1,
          friendId: user2,
        },
        {
          userId: user2,
          friendId: user1,
        },
      ],
    },
  });
  return !!friendship;
}
export const defaultPrivacy = [
  { attribute: 'phone', visibility: 'private' },
  { attribute: 'address', visibility: 'friends-only' },
  { attribute: 'bio', visibility: 'public' },
];
export async function ensureDefaultPrivacySettings(userId) {
  const promises = defaultPrivacy.map(async ({ attribute, visibility }) => {
    const privacy = await Privacy.findOne({ where: { userId, attribute } });
    // No privacy found, so create default attribute privacy
    if (!privacy) await Privacy.create({ attribute, visibility, userId });
  });
  await Promise.all(promises);
}
export async function buildUserProfileWithPrivacy(user, requesterId) {
  // Check friendship and authentication status
  const isAuthenticated = !!requesterId;
  const isFriend = isAuthenticated
    ? await isFriends(user.id, requesterId)
    : false;
  const isFriendshipExists = isAuthenticated
    ? await isFriendshipRequested(user.id, requesterId)
    : false;
  const isSameUser = user.id === requesterId;

  const avatar = await getUserAvatarUrl(user.id);

  const userProfile = defaultPrivacy.reduce(
    (p, c) => {
      if (user.attributes && user.attributes[c.attribute])
        p[c.attribute] = user.attributes[c.attribute][0];
      return p;
    },
    { id: user.id, avatar, isFriend, isFriendshipExists }
  );

  // Retrieve privacy settings and filter based on visibility
  const privacySettings = await Privacy.findAll({ where: { userId: user.id } });
  const filteredProfile = Object.fromEntries(
    Object.entries(userProfile).filter(
      ([key]) => !privacySettings.map((a) => a.attribute).includes(key)
    )
  );

  privacySettings.forEach((setting) => {
    if (
      isSameUser ||
      setting.visibility === 'public' ||
      (setting.visibility === 'private' && isAuthenticated) ||
      (setting.visibility === 'friends-only' && isFriend)
    ) {
      filteredProfile[setting.attribute] = userProfile[setting.attribute];
    }
  });

  return { profile: filteredProfile, privacy: privacySettings };
}
