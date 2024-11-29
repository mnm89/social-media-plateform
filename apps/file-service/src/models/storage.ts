import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'storages',
  timestamps: true,
  modelName: 'Storage',
})
export class Storage extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  externalId: string;

  @Column({
    type: DataType.ENUM('post', 'user', 'none'),
    allowNull: false,
    defaultValue: 'none',
  })
  entityType!: string;

  @Column({
    type: DataType.ENUM('avatar', 'image', 'video', 'sound', 'other'),
    allowNull: false,
    defaultValue: 'other',
  })
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bucket!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path!: string;
}

export default Storage;
