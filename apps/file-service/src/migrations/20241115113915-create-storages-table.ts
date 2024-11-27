import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export const up = async ({
  context,
}: {
  context: {
    queryInterface: QueryInterface;
    sequelize: Sequelize;
  };
}) => {
  const { queryInterface, sequelize } = context;
  await queryInterface.createTable('storages', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.fn('gen_random_uuid'),
      allowNull: false,
      primaryKey: true,
    },
    externalId: {
      type: DataTypes.STRING,

      allowNull: true,
    },
    entityType: {
      type: DataTypes.ENUM('post', 'user', 'none'),
      allowNull: false,
      defaultValue: 'none',
    },
    type: {
      type: DataTypes.ENUM('avatar', 'image', 'video', 'sound', 'other'),
      allowNull: false,
      defaultValue: 'other',
    },
    bucket: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });
};

export const down = async ({
  context,
}: {
  context: {
    queryInterface: QueryInterface;
    sequelize: Sequelize;
  };
}) => {
  await context.queryInterface.dropTable('storages');
};
