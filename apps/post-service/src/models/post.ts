import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { getUserAvatarUrl, getUserName } from '../utils';
import Comment from './comment';
import Like from './like';

@Table({
  modelName: 'Post',
  tableName: 'posts',
  timestamps: true,
})
export default class Post extends Model {
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
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.ENUM('public', 'private', 'friends-only'),
    allowNull: false,
    defaultValue: 'public',
  })
  visibility!: string;

  @HasMany(() => Comment, { as: 'comments', foreignKey: 'postId' })
  comments!: Comment[];

  @HasMany(() => Like, { as: 'likes', foreignKey: 'postId' })
  likes!: Like[];

  static initializeHooks() {
    this.addHook('afterFind', async (posts: Post | Post[] | null) => {
      if (!posts) return;

      // Ensure we're working with an array
      const postsArray = Array.isArray(posts) ? posts : [posts];

      // Fetch and bind author data for each comment
      await Promise.all(
        postsArray.map(async (post) => {
          // Set author fields on the comment instance
          post.setDataValue('authorName', await getUserName(post.userId));
          post.setDataValue(
            'authorAvatar',
            await getUserAvatarUrl(post.userId)
          );
          if (post.comments && post.comments.length > 0) {
            // Manually trigger the afterFind hook for each comment
            await Promise.all(
              post.comments.map(async (comment) => {
                // Set author fields on the comment instance
                comment.setDataValue(
                  'authorName',
                  await getUserName(comment.userId)
                );
                comment.setDataValue(
                  'authorAvatar',
                  await getUserAvatarUrl(comment.userId)
                );

                if (comment.replies && comment.replies.length > 0) {
                  await Promise.all(
                    comment.replies.map(async (reply) => {
                      reply.setDataValue(
                        'authorName',
                        await getUserName(reply.userId)
                      );
                      reply.setDataValue(
                        'authorAvatar',
                        await getUserAvatarUrl(reply.userId)
                      );
                    })
                  );
                }
              })
            );
          }
        })
      );
    });
  }
}
