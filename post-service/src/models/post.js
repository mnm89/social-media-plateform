const { Model, DataTypes } = require("sequelize");
const { getAuthorName, getAuthorAvatar } = require("../helpers/userData");

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
          post.setDataValue("authorName", await getAuthorName(post.userId));
          post.setDataValue("authorAvatar", await getAuthorAvatar(post.userId));
        })
      );
    });
  }
}

module.exports = Post;
