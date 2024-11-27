const Sequelize = require("sequelize");
const config =
  require("../config/database")[process.env.NODE_ENV || "development"];
const sequelize = new Sequelize(process.env.DATABASE_URL, config);

// Import models
const Storage = require("./storage");
// Initialize models
Storage.initModel(sequelize);
// Export initialized models
module.exports = {
  Storage,
};
