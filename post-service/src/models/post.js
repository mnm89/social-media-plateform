module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Post",
    {
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
};
