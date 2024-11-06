const express = require("express");
const { Post } = require("../models"); // Import the Post model
const { getUserAuthorName } = require("../helpers/authorName");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Fetch public posts from the database
    const posts = await Post.findAll({
      where: { visibility: "public" },
    });

    // Get unique user IDs from posts
    const userIds = [...new Set(posts.map((post) => post.userId))];

    // Fetch and cache author names
    const names = await Promise.all(userIds.map(getUserAuthorName));

    // Enrich posts with author names
    const enrichedPosts = posts.map((post) => ({
      ...post.dataValues,
      authorName: names[userIds.indexOf(post.userId)] || "Anonymous",
    }));

    res.json(enrichedPosts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
});
module.exports = router;
