const express = require("express");
const { Post } = require("../models"); // Import the Post model
const router = express.Router();

router.get("/posts", async (req, res) => {
  try {
    // Fetch public posts from the database
    const posts = await Post.findAll({
      where: { visibility: "public" },
      order: [["createdAt", "ASC"]],
    });

    res.json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    // Fetch public posts from the database
    const post = await Post.findOne({
      where: { visibility: "public", id: req.params.id },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
});
module.exports = router;
