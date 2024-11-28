"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("friendships", [
      {
        userId: "11111111-1111-1111-1111-111111111111",
        friendId: "22222222-2222-2222-2222-222222222222",
        status: "pending",
      },
      {
        userId: "11111111-1111-1111-1111-111111111111",
        friendId: "33333333-3333-3333-3333-333333333333",
        status: "accepted",
      },
      {
        userId: "11111111-1111-1111-1111-111111111111",
        friendId: "44444444-4444-4444-4444-444444444444",
        status: "blocked",
      },
      {
        userId: "55555555-5555-5555-5555-555555555555",
        friendId: "11111111-1111-1111-1111-111111111111",
        status: "pending",
      },
      {
        userId: "66666666-6666-6666-6666-666666666666",
        friendId: "11111111-1111-1111-1111-111111111111",
        status: "accepted",
      },
      {
        userId: "77777777-7777-7777-7777-777777777777",
        friendId: "11111111-1111-1111-1111-111111111111",
        status: "blocked",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("friendships", null, {});
  },
};
