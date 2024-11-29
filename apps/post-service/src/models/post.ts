import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
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
}
