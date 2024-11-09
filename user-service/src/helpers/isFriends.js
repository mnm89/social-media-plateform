const { Friendship } = require("../models");

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

module.exports = { isFriends };
