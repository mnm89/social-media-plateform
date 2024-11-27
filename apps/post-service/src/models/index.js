const Sequelize = require("sequelize");
const config =
  require("../config/database")[process.env.NODE_ENV || "development"];
const sequelize = new Sequelize(process.env.DATABASE_URL, config);

// Import models
const Post = require("./post");
const Comment = require("./comment");
const Like = require("./like");

// Initialize models
Post.initModel(sequelize);
Comment.initModel(sequelize);
Like.initModel(sequelize);

// Define associations after all models are initialized
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

// Enable nested comments (replies)
Comment.hasMany(Comment, { as: "replies", foreignKey: "parentId" });
Comment.belongsTo(Comment, { as: "parent", foreignKey: "parentId" });

Post.hasMany(Like, { foreignKey: "postId", as: "likes" });
Like.belongsTo(Post, { foreignKey: "postId", as: "post" });

// Export initialized models
module.exports = {
  Post,
  Comment,
  Like,
};
