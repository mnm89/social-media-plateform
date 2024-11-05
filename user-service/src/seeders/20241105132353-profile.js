"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("profiles", [
      {
        userId: "11111111-1111-1111-1111-111111111111",
        bio: "Software engineer and tech enthusiast.",
        address: "San Francisco, CA",
        phone: "123-456-7890",
      },
      {
        userId: "22222222-2222-2222-2222-222222222222",
        bio: "Digital artist and designer.",
        address: "New York, NY",
        phone: "234-567-8901",
      },
      {
        userId: "33333333-3333-3333-3333-333333333333",
        bio: "Marketing specialist and travel blogger.",
        address: "Los Angeles, CA",
        phone: "345-678-9012",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("profiles", null, {});
  },
};
