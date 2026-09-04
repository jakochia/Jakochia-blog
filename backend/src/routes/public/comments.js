// ============================================================
// BACKEND src/routes/public/comments.js
// ============================================================

import express from 'express';
import { Comment } from '../../models/Comment.js';
import { Post } from '../../models/Post.js';
import { commentRateLimiter } from '../../middleware/rateLimiter.js';
import { validate, commentValidations } from '../../middleware/validation.js';

const router = express.Router();

router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      status: 'approved',
    })
      .select('-email -ipAddress')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/',
  commentRateLimiter,
  validate(commentValidations),
  async (req, res) => {
    try {
      const { post: postId, name, email, content } = req.body;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const comment = await Comment.create({
        post: postId,
        name,
        email,
        content,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'pending',
      });

      res.status(201).json({
        success: true,
        message: 'Comment submitted for approval',
        comment: {
          id: comment._id,
          name: comment.name,
          content: comment.content,
          createdAt: comment.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;