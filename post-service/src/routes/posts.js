const express = require("express");
const router = express.Router();
const keycloak = require("../config/keycloak"); // Assuming Keycloak config is here
const Post = require("../models/post"); // Import the Post model

// Create a new post
router.post("/", keycloak.protect("realm:user"), async (req, res) => {
  const { title, content, visibility } = req.body;
  const userId = req.kauth.grant.access_token.content.sub;

  try {
    const post = await Post.create({ userId, title, content, visibility });
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Get all posts (public posts or restricted by visibility)
router.get("/", keycloak.protect("realm:user"), async (req, res) => {
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

// Get a single post by ID
router.get("/:id", keycloak.protect("realm:user"), async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Only show post if visibility is public or user is the creator
    const userId = req.kauth.grant.access_token.content.sub;
    if (post.visibility !== "public" && post.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ error: "Failed to retrieve post" });
  }
});

// Update a post by ID (only if the user is the owner)
router.put(
  "/:id",
  keycloak.protect("realm:user"),
  checkOwnership,
  async (req, res) => {
    const { title, content, visibility } = req.body;

    try {
      await req.post.update({ title, content, visibility });
      res.json(req.post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  }
);

// Delete a post by ID (only if the user is the owner)
router.delete(
  "/:id",
  keycloak.protect("realm:user"),
  checkOwnership,
  async (req, res) => {
    try {
      await req.post.destroy();
      res.status(204).send(); // No content response
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  }
);

module.exports = router;
