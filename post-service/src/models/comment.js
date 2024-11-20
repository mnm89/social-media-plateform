const { Model, DataTypes } = require("sequelize");
const { getUserAvatarUrl } = require("../helpers/userAvatar");
const { getUserName } = require("../helpers/userName");

class Comment extends Model {
  static initModel(sequelize) {
    Comment.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        postId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        parentId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Comment",
        tableName: "comments",
        timestamps: true,
      }
    );
    // Add afterFind hook to enrich comments with author data
    Comment.addHook("afterFind", async (comments) => {
      if (!comments) return;

      // Ensure we're working with an array
      const commentsArray = Array.isArray(comments) ? comments : [comments];

      // Fetch and bind author data for each comment
      await Promise.all(
        commentsArray.map(async (comment) => {
          // Set author fields on the comment instance
          comment.setDataValue("authorName", await getUserName(comment.userId));
          comment.setDataValue(
            "authorAvatar",
            await getUserAvatarUrl(comment.userId)
          );

          if (comment.replies && comment.replies.length > 0) {
            await Promise.all(
              comment.replies.map(async (reply) => {
                await Comment.runHooks("afterFind", reply);
              })
            );
          }
        })
      );
    });
  }
}

module.exports = Comment;
