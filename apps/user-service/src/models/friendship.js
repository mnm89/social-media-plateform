const { Model, DataTypes } = require("sequelize");
const { getUserName } = require("../helpers/keycloakUser");
const { getUserAvatarUrl } = require("../helpers/storageUser");

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
            await getUserAvatarUrl(friendship.friendId)
          );
          friendship.setDataValue(
            "senderName",
            await getUserName(friendship.userId)
          );
          friendship.setDataValue(
            "senderAvatar",
            await getUserAvatarUrl(friendship.userId)
          );
        })
      );
    });
  }
}

module.exports = Friendship;
