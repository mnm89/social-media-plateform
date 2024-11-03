"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("profiles", "privacy", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {
        bio: "public",
        address: "private",
        phone: "private",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("profiles", "privacy");
  },
};
