// ============================================================
// BACKEND src/routes/public/tags.js
// ============================================================

import express from 'express';
import { Tag } from '../../models/Tag.js';
import { Post } from '../../models/Post.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ count: -1, name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const posts = await Post.find({
      tags: tag._id,
      status: 'published',
    })
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ publishedAt: -1 });

    res.json({ tag, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;