const { Model, DataTypes } = require("sequelize");

class Privacy extends Model {
  static initModel(sequelize) {
    Privacy.init(
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
        attribute: {
          type: DataTypes.STRING,
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
        modelName: "Privacy",
        tableName: "privacy_settings",
        timestamps: true,
      }
    );
  }
}

module.exports = Privacy;
