import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import Post from './post';

@Table({
  modelName: 'Like',
  tableName: 'likes',
  timestamps: true,
})
export default class Like extends Model {
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
    type: DataType.UUID,
    allowNull: false,
  })
  postId!: string;

  @BelongsTo(() => Post, { as: 'post', foreignKey: 'postId' })
  post!: Post;
}
