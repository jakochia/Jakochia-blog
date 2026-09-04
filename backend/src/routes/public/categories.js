// ============================================================
// BACKEND src/routes/public/categories.js
// ============================================================

import express from 'express';
import { Category } from '../../models/Category.js';
import { Post } from '../../models/Post.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ count: -1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const posts = await Post.find({
      category: category._id,
      status: 'published',
    })
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ publishedAt: -1 });

    res.json({ category, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;