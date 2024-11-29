import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
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
}
