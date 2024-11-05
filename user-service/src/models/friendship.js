const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Friendship = sequelize.define(
    "Friendship",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      friendId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "blocked"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "friendships",
      timestamps: true,
    }
  );

  // Adding a unique constraint to prevent duplicate relationships
  Friendship.addHook("beforeValidate", async (friends) => {
    const existingRelation = await Friends.findOne({
      where: {
        userId: friends.userId,
        friendId: friends.friendId,
      },
    });
    if (existingRelation) throw new Error("Friendship already exists.");
  });

  return Friendship;
};
