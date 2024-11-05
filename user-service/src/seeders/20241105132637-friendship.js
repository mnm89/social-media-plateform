"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("friendships", [
      {
        userId: "11111111-1111-1111-1111-111111111111",
        friendId: "22222222-2222-2222-2222-222222222222",
        status: "accepted",
      },
      {
        userId: "22222222-2222-2222-2222-222222222222",
        friendId: "33333333-3333-3333-3333-333333333333",
        status: "accepted",
      },
      {
        userId: "33333333-3333-3333-3333-333333333333",
        friendId: "11111111-1111-1111-1111-111111111111",
        status: "pending",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("friendships", null, {});
  },
};
