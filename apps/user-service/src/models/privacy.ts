import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  modelName: 'Privacy',
  tableName: 'privacy_settings',
  timestamps: true,
})
export default class Privacy extends Model {
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
  attribute!: string;

  @Column({
    type: DataType.ENUM('public', 'private', 'friends-only'),
    allowNull: false,
    defaultValue: 'public',
  })
  visibility!: string;
}
