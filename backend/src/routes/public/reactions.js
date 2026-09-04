// ============================================================
// BACKEND src/routes/public/reactions.js
// ============================================================

import express from 'express';
import { Reaction } from '../../models/Reaction.js';
import { Post } from '../../models/Post.js';
import { reactionRateLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

const REACTION_TYPES = ['like', 'fire', 'helpful', 'applause'];

router.post('/', reactionRateLimiter, async (req, res) => {
  try {
    const { postId, type } = req.body;

    if (!REACTION_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid reaction type' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Use IP + User-Agent as identifier (simple anti-abuse)
    const identifier = `${req.ip}-${req.headers['user-agent'] || 'unknown'}`;

    const existing = await Reaction.findOne({ post: postId, identifier, type });

    if (existing) {
      // Remove reaction (toggle)
      await existing.deleteOne();
      post.reactionCounts[type] = Math.max(0, post.reactionCounts[type] - 1);
      await post.save();

      return res.json({
        success: true,
        action: 'removed',
        reaction: type,
        counts: post.reactionCounts,
      });
    }

    const reaction = await Reaction.create({
      post: postId,
      type,
      identifier,
    });

    post.reactionCounts[type] += 1;
    await post.save();

    res.status(201).json({
      success: true,
      action: 'added',
      reaction: type,
      counts: post.reactionCounts,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Reaction already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get('/post/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).select('reactionCounts');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const identifier = `${req.ip}-${req.headers['user-agent'] || 'unknown'}`;
    const userReactions = await Reaction.find({
      post: req.params.postId,
      identifier,
    }).select('type');

    const userReactionTypes = userReactions.map(r => r.type);

    res.json({
      counts: post.reactionCounts,
      userReactions: userReactionTypes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;