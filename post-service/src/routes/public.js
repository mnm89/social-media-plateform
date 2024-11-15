const express = require("express");
const { Post } = require("../models"); // Import the Post model
const router = express.Router();

router.get("/", async (req, res) => {
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
module.exports = router;
