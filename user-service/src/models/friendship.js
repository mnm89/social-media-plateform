const { Model, DataTypes } = require("sequelize");
const { getUserName, getUserAvatar } = require("../helpers/keycloakUser");

class Friendship extends Model {
  static initModel(sequelize) {
    Friendship.init(
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
        sequelize,
        modelName: "Friendship",
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
    // Add afterFind hook to enrich comments with author data
    Friendship.addHook("afterFind", async (friendships) => {
      if (!friendships) return;

      // Ensure we're working with an array
      const friendshipsArray = Array.isArray(friendships)
        ? friendships
        : [friendships];

      // Fetch and bind author data for each comment
      await Promise.all(
        friendshipsArray.map(async (friendship) => {
          // Set author fields on the comment instance
          friendship.setDataValue(
            "friendName",
            await getUserName(friendship.friendId)
          );
          friendship.setDataValue(
            "friendAvatar",
            await getUserAvatar(friendship.friendId)
          );
          friendship.setDataValue(
            "senderName",
            await getUserName(friendship.userId)
          );
          friendship.setDataValue(
            "senderAvatar",
            await getUserAvatar(friendship.userId)
          );
        })
      );
    });
  }
}

module.exports = Friendship;
