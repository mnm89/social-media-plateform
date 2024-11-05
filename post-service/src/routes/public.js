const express = require("express");
const { Post } = require("../models"); // Import the Post model
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { visibility: "public" }, // Adjust this to include other visibility options if needed
    });
    res.json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
});
module.exports = router;
