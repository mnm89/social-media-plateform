import { QueryInterface, Sequelize, DataTypes } from 'sequelize';

export const up = async ({
  context,
}: {
  context: {
    queryInterface: QueryInterface;
    sequelize: Sequelize;
  };
}) => {
  const { queryInterface, sequelize } = context;
  await queryInterface.createTable('friendships', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.fn('gen_random_uuid'),
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    friendId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'blocked'),
      allowNull: false,
      defaultValue: 'pending',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
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
  const { queryInterface } = context;

  await queryInterface.dropTable('friendships');
};
