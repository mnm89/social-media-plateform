// Sequelize model example for Profile table
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Profile = (module.exports = Profile);

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Profile",
    {
      userId: {
        // Foreign key, stores Keycloak user ID
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure one-to-one relationship with Keycloak user
      },
      bio: { type: DataTypes.TEXT, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      privacy: {
        // New column to define visibility options
        type: DataTypes.JSON,
        defaultValue: { bio: "public", address: "private", phone: "private" },
      },
    },
    {
      tableName: "Profiles", // This prevents Sequelize from pluralizing the table name
      timestamps: true,
    }
  );
};
