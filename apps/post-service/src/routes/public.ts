import Comment from '../models/comment';
import Like from '../models/like';
import Post from '../models/post';
import express from 'express';

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    // Fetch public posts from the database
    const posts = await Post.findAll({
      where: { visibility: 'public' },
      order: [['createdAt', 'ASC']],
    });

    res.json(posts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ message: 'Failed to retrieve posts' });
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    // Fetch public posts from the database
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          as: 'comments',
          where: { parentId: null }, // Only main comments
          required: false, // Ensures LEFT OUTER JOIN instead of INNER JOIN
          include: [
            {
              model: Comment,
              as: 'replies',
              required: false, // Ensures LEFT OUTER JOIN for replies
              order: [['createdAt', 'ASC']],
            }, // Include replies here
          ],
        },
        {
          model: Like,
          as: 'likes',
          required: false, // Ensures LEFT OUTER JOIN for replies
        },
      ],
    });

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.visibility !== 'public')
      return res
        .status(403)
        .json({ message: 'Unauthorized to see this content' });

    res.json(post);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ message: 'Failed to retrieve posts' });
  }
});

export default router;
