const express = require("express");
const { Post, Comment, Like } = require("../models"); // Import the Post model
const checkOwnership = require("../middleware/checkOwnership");
const { getUserDetails, getUserAuthorName } = require("../helpers/postUser");
const { isFriend } = require("../helpers/checkFriendship");

const router = express.Router();
// Create a new post
router.post("/", async (req, res) => {
  const { title, content, visibility } = req.body;
  const userId = req.kauth.grant.access_token.content.sub;

  try {
    const post = await Post.create({ userId, title, content, visibility });
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// Get all posts (public posts or restricted by visibility)
router.get("/", async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  try {
    const posts = await Post.findAll();
    const visiblePosts = await Promise.all(
      posts.map(async (post) => {
        if (post.visibility === "public") return post;
        if (post.visibility === "private") return post; // Show to any authenticated user
        if (post.userId === userId) return post;
        if (
          post.visibility === "friends-only" &&
          (await isFriend(post.userId, userId))
        )
          return post;
        return null;
      })
    );

    const cleanPosts = visiblePosts.filter(Boolean); // Filter out null posts

    // Get unique user IDs from posts
    const userIds = [...new Set(cleanPosts.map((post) => post.userId))];

    // Fetch and cache author names
    const names = await Promise.all(userIds.map(getUserAuthorName));

    // Enrich posts with author names
    const enrichedPosts = cleanPosts.map((post) => ({
      ...post.dataValues,
      authorName: names[userIds.indexOf(post.userId)] || "Anonymous",
    }));

    res.json(enrichedPosts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
});

// Get a single post by ID
router.get("/:id", async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: Comment, as: "comments" },
        { model: Like, as: "likes" },
      ],
    });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      post.visibility === "public" ||
      post.visibility === "private" || // Show to any authenticated user
      post.userId === userId ||
      (post.visibility === "friends-only" &&
        (await isFriend(post.userId, userId)))
    ) {
      const user = await getUserDetails(post.userId);
      const authorName = await getUserAuthorName(post.userId);
      return res.json({ ...post.dataValues, user, authorName });
    }

    res.status(403).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ message: "Failed to retrieve post" });
  }
});

// Update a post by ID (only if the user is the owner)
router.put("/:id", checkOwnership, async (req, res) => {
  const { title, content, visibility } = req.body;

  try {
    await req.post.update({ title, content, visibility });
    res.json(req.post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
});

// Delete a post by ID (only if the user is the owner)
router.delete("/:id", checkOwnership, async (req, res) => {
  try {
    await req.post.destroy();
    res.status(204).send(); // No content response
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

module.exports = router;
