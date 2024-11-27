"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("privacy_settings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn("gen_random_uuid"),
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attribute: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      visibility: {
        type: Sequelize.ENUM("public", "private", "friends-only"),
        allowNull: false,
        defaultValue: "public",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Create a unique constraint for userId and attribute to avoid duplicates
    await queryInterface.addConstraint("privacy_settings", {
      fields: ["userId", "attribute"],
      type: "unique",
      name: "unique_user_attribute",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the table and the ENUM type if necessary
    await queryInterface.dropTable("privacy_settings");
  },
};
