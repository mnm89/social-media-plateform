const { Comment, Like } = require(".");
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
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
      tableName: "posts",
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );
  Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
  Post.hasMany(Like, { foreignKey: "postId", onDelete: "CASCADE" });

  return Post;
};
