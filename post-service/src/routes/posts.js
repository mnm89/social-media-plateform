const express = require("express");
const { Post, Comment, Like } = require("../models"); // Import the Post model
const checkOwnership = require("../middleware/checkOwnership");
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
    const posts = await Post.findAll({ order: [["createdAt", "ASC"]] });
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

    res.json(cleanPosts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
});

// Get a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          as: "comments",
          where: { parentId: null }, // Only main comments
          required: false, // Ensures LEFT OUTER JOIN instead of INNER JOIN
          include: [
            {
              model: Comment,
              as: "replies",
              required: false, // Ensures LEFT OUTER JOIN for replies
              order: [["createdAt", "ASC"]],
            }, // Include replies here
          ],
        },
        {
          model: Like,
          as: "likes",
          required: false, // Ensures LEFT OUTER JOIN for replies
        },
      ],
    });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isFriends = await isFriend(
      post.userId,
      req.kauth.grant.access_token.content.sub
    );
    const isAuthor = post.userId === req.kauth.grant.access_token.content.sub;

    if (
      ["public", "private"].includes(post.visibility) ||
      (post.visibility === "friends-only" && isFriends) ||
      isAuthor
    ) {
      return res.json(post);
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
