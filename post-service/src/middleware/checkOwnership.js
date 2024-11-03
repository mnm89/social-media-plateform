const Post = require("../models/post"); // Import the Post model
// Middleware to check if the user is the owner of the post
const checkOwnership = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.kauth.grant.access_token.content.sub;

  const post = await Post.findByPk(id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (post.userId !== userId)
    return res.status(403).json({ error: "Unauthorized" });

  req.post = post; // Attach post to request for use in later middleware
  next();
};
module.exports = checkOwnership;
