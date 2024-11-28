import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { getUserAvatarUrl, getUserName } from '../utils';

@Table({
  modelName: 'Friendship',
  tableName: 'friendships',
  timestamps: true,
})
export default class Friendship extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  friendId!: string;
  @Column({
    type: DataType.ENUM('pending', 'accepted', 'blocked'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: string;

  static initializeHooks() {
    this.addHook(
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
}
