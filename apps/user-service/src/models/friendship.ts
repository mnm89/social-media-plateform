import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
}
