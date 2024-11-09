const Sequelize = require("sequelize");
const config =
  require("../config/database")[process.env.NODE_ENV || "development"];
const sequelize = new Sequelize(process.env.DATABASE_URL, config);

// Import models
const Friendship = require("./friendship");
const Privacy = require("./privacy");

// Initialize models
Friendship.initModel(sequelize);
Privacy.initModel(sequelize);

// Export initialized models
module.exports = {
  Friendship,
  Privacy,
};
