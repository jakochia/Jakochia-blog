// ============================================================
// BACKEND src/routes/public/search.js
// ============================================================

import express from 'express';
import { Post } from '../../models/Post.js';
import { Category } from '../../models/Category.js';
import { Tag } from '../../models/Tag.js';
import { searchRateLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', searchRateLimiter, async (req, res) => {
  try {
    const { q, category, tag, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { status: 'published' };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Category filter
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) query.category = categoryDoc._id;
    }

    // Tag filter
    if (tag) {
      const tagDoc = await Tag.findOne({ slug: tag });
      if (tagDoc) query.tags = tagDoc._id;
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('category', 'name slug color')
        .populate('tags', 'name slug')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Post.countDocuments(query),
    ]);

    // Get suggestions (simple word match for autocomplete)
    const suggestions = posts.slice(0, 5).map(p => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
    }));

    res.json({
      results: posts,
      suggestions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      query: q,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;