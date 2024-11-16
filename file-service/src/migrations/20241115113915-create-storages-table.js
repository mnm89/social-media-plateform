"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("storages", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn("gen_random_uuid"),
        allowNull: false,
        primaryKey: true,
      },
      externalId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      entityType: {
        type: Sequelize.ENUM("post", "user", "none"),
        allowNull: false,
        defaultValue: "none",
      },
      type: {
        type: Sequelize.ENUM("avatar", "image", "video", "sound", "other"),
        allowNull: false,
        defaultValue: "other",
      },
      bucket: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("storages");
  },
};
