const { Post } = require(".");
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      parentId: {
        type: DataTypes.UUID, // This references another comment for replies
        allowNull: true,
      },
    },
    {
      tableName: "comments",
      timestamps: true,
    }
  );
  Comment.belongsTo(Post, { foreignKey: "postId" });
  return Comment;
};
