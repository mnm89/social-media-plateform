const { Model, DataTypes } = require("sequelize");

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
  }
}

module.exports = Post;
