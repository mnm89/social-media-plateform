const { Post } = require(".");
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
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
    },
    {
      tableName: "likes",
      timestamps: true,
    }
  );
  Like.belongsTo(Post, { foreignKey: "postId" });
  return Like;
};
