const { Friendship } = require("../models");
const { Op } = require("sequelize");

async function isFriends(user1, user2) {
  const friendship = await Friendship.findOne({
    where: {
      [Op.or]: [
        {
          userId: user1,
          friendId: user2,
          status: "accepted",
        },
        {
          userId: user2,
          friendId: user1,
          status: "accepted",
        },
      ],
    },
  });
  return !!friendship;
}

async function isFriendshipRequested(user1, user2) {
  const friendship = await Friendship.findOne({
    where: {
      [Op.or]: [
        {
          userId: user1,
          friendId: user2,
        },
        {
          userId: user2,
          friendId: user1,
        },
      ],
    },
  });
  return !!friendship;
}

module.exports = { isFriends, isFriendshipRequested };
