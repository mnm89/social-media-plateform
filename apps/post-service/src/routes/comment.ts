import { extractUserSub } from '@social-media-platform/keycloak-utils';
import express from 'express';
import Comment from '../models/comment';
const router = express.Router();

router.post('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { content, parentId } = req.body; // parentId is optional for replies
  const userId = extractUserSub(req);

  try {
    const comment = await Comment.create({ postId, userId, content, parentId });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { postId, parentId: null }, // Fetch only top-level comments
      include: [{ model: Comment, as: 'replies' }], // Nested replies
    });
    res.json(comments);
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
});
router.post('/:postId/:commentId/replies', async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const userId = extractUserSub(req);

  try {
    const reply = await Comment.create({
      postId,
      userId,
      content,
      parentId: commentId, // Set parent ID to link it as a reply
    });
    res.status(201).json(reply);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

export default router;
