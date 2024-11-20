const { Model, DataTypes } = require("sequelize");
const Comment = require("./comment");
const { getUserAvatarUrl } = require("../helpers/userAvatar");
const { getUserName } = require("../helpers/useName");

class Post extends Model {
  static initModel(sequelize) {
    Post.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          // Keycloak user ID as a foreign key
          type: DataTypes.STRING,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        visibility: {
          type: DataTypes.ENUM("public", "private", "friends-only"),
          allowNull: false,
          defaultValue: "public",
        },
      },
      {
        sequelize,
        modelName: "Post",
        tableName: "posts",
        timestamps: true,
      }
    );
    // Add afterFind hook to enrich comments with author data
    Post.addHook("afterFind", async (posts) => {
      if (!posts) return;

      // Ensure we're working with an array
      const postsArray = Array.isArray(posts) ? posts : [posts];

      // Fetch and bind author data for each comment
      await Promise.all(
        postsArray.map(async (post) => {
          // Set author fields on the comment instance
          post.setDataValue("authorName", await getUserName(post.userId));
          post.setDataValue(
            "authorAvatar",
            await getUserAvatarUrl(post.userId)
          );
          if (post.comments && post.comments.length > 0) {
            // Manually trigger the afterFind hook for each comment
            await Promise.all(
              post.comments.map(async (comment) => {
                await Comment.runHooks("afterFind", comment);
              })
            );
          }
        })
      );
    });
  }
}

module.exports = Post;
