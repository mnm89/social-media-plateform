import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { getUserAvatarUrl, getUserName } from '../utils';
import Post from './post';

@Table({
  modelName: 'Comment',
  tableName: 'comments',
  timestamps: true,
})
export default class Comment extends Model {
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
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  postId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  parentId: string;

  @HasMany(() => Comment, { as: 'replies', foreignKey: 'parentId' })
  replies!: Comment[];

  @BelongsTo(() => Comment, { as: 'parent', foreignKey: 'parentId' })
  parent: Comment;

  @BelongsTo(() => Post, { as: 'post', foreignKey: 'postId' })
  post!: Post;

  static initializeHooks() {
    this.addHook('afterFind', async (comments: Comment | Comment[] | null) => {
      if (!comments) return;

      // Ensure we're working with an array
      const commentsArray = Array.isArray(comments) ? comments : [comments];

      // Fetch and bind author data for each comment
      await Promise.all(
        commentsArray.map(async (comment) => {
          // Set author fields on the comment instance
          comment.setDataValue('authorName', await getUserName(comment.userId));
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
    });
  }
}
