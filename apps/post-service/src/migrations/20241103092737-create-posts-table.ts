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
  await queryInterface.createTable('posts', {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private', 'friends-only'),
      allowNull: false,
      defaultValue: 'public',
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
  const { queryInterface } = context;

  await queryInterface.dropTable('friendships');
};
