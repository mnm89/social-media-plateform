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

  await queryInterface.createTable('likes', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.fn('gen_random_uuid'),
      allowNull: false,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
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
  await queryInterface.dropTable('likes');
};
