const { Model, DataTypes } = require("sequelize");

class Like extends Model {
  static initModel(sequelize) {
    Like.init(
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
        sequelize,
        modelName: "Like",
        tableName: "likes",
        timestamps: true,
      }
    );
  }
}

module.exports = Like;
