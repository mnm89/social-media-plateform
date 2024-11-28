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
  await queryInterface.createTable('privacy_settings', {
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
    attribute: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private', 'friends-only'),
      allowNull: false,
      defaultValue: 'public',
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

  // Create a unique constraint for userId and attribute to avoid duplicates
  await queryInterface.addConstraint('privacy_settings', {
    fields: ['userId', 'attribute'],
    type: 'unique',
    name: 'unique_user_attribute',
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
  // Drop the table and the ENUM type if necessary
  await queryInterface.dropTable('privacy_settings');
};
