// ============================================================
// BACKEND src/routes/public/posts.js
// ============================================================

import express from 'express';
import { Post } from '../../models/Post.js';
import { Category } from '../../models/Category.js';
import { Tag } from '../../models/Tag.js';
import { Analytics } from '../../models/Analytics.js';

const router = express.Router();

// Get all published posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, featured } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { status: 'published' };
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) query.category = categoryDoc._id;
    }
    if (tag) {
      const tagDoc = await Tag.findOne({ slug: tag });
      if (tagDoc) query.tags = tagDoc._id;
    }
    if (featured === 'true') query.featured = true;

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('category', 'name slug color')
        .populate('tags', 'name slug')
        .sort({ featured: -1, publishedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Post.countDocuments(query),
    ]);

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured posts
router.get('/featured', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published', featured: true })
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(6);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular posts
router.get('/popular', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ viewCount: -1, publishedAt: -1 })
      .limit(5);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: 'published',
    })
      .populate('category', 'name slug color')
      .populate('tags', 'name slug');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    // Track analytics
    await Analytics.create({
      post: post._id,
      type: 'articleview',
      path: `/blog/${post.slug}`,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;