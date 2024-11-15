const { Model, DataTypes } = require("sequelize");

class Storage extends Model {
  static initModel(sequelize) {
    Storage.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        externalId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        entityType: {
          type: DataTypes.ENUM("post", "user", "none"),
          allowNull: false,
          defaultValue: "none",
        },
        type: {
          type: DataTypes.ENUM("avatar", "image", "video", "sound", "other"),
          allowNull: false,
          defaultValue: "other",
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Storage",
        tableName: "storages",
        timestamps: true,
      }
    );
  }
}

module.exports = Storage;
