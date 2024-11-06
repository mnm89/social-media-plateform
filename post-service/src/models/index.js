const Sequelize = require("sequelize");
const config = require("../config/database");
const sequelize = new Sequelize(config);

// Import models
const Post = require("./post");
const Comment = require("./comment");
const Like = require("./like");

// Initialize models
Post.initModel(sequelize);
Comment.initModel(sequelize);
Like.initModel(sequelize);

// Define associations after all models are initialized
Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

// Enable nested comments (replies)
Comment.hasMany(Comment, { as: "replies", foreignKey: "parentId" });
Comment.belongsTo(Comment, { as: "parent", foreignKey: "parentId" });

Post.hasMany(Like, { foreignKey: "postId" });
Like.belongsTo(Post, { foreignKey: "postId" });

// Export initialized models
module.exports = {
  Post,
  Comment,
  Like,
};
