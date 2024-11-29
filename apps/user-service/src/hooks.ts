import Friendship from './models/friendship';
import { getUserAvatarUrl, getUserName } from './utils';

export async function initializeModelsHooks() {
  Friendship.addHook(
    'afterFind',
    async (friendships: Friendship | Friendship[] | null) => {
      if (!friendships) return;

      // Ensure we're working with an array
      const friendshipsArray = Array.isArray(friendships)
        ? friendships
        : [friendships];
      await Promise.all(
        friendshipsArray.map(async (friendship) => {
          // Set author fields on the comment instance
          friendship.setDataValue(
            'friendName',
            await getUserName(friendship.friendId)
          );
          friendship.setDataValue(
            'friendAvatar',
            await getUserAvatarUrl(friendship.friendId)
          );
          friendship.setDataValue(
            'senderName',
            await getUserName(friendship.userId)
          );
          friendship.setDataValue(
            'senderAvatar',
            await getUserAvatarUrl(friendship.userId)
          );
        })
      );
    }
  );
}
