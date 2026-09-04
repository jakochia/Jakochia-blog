// ============================================================
// BACKEND src/routes/admin/posts.js
// ============================================================

import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { Post } from '../../models/Post.js';
import { Category } from '../../models/Category.js';
import { Tag } from '../../models/Tag.js';
import { AuditLog } from '../../models/AuditLog.js';
import { validate, postValidations } from '../../middleware/validation.js';

const router = express.Router();

// Get all posts (admin view - includes drafts)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (status) query.status = status;

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('category', 'name slug color')
        .populate('tags', 'name slug')
        .sort({ createdAt: -1 })
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

// Get single post (admin view)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category', 'name slug color')
      .populate('tags', 'name slug');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/', authenticate, requireAdmin, validate(postValidations), async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      tags = [],
      status = 'draft',
      featured = false,
      scheduledFor,
      seoTitle,
      seoDescription,
      canonicalUrl,
      ogImage,
      coverImage,
    } = req.body;

    // Check category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ error: 'Category not found' });
    }

    // Check tags exist
    const tagDocs = await Tag.find({ _id: { $in: tags } });
    const validTagIds = tagDocs.map(t => t._id);

    const postData = {
      title,
      excerpt,
      content,
      category,
      tags: validTagIds,
      status,
      featured,
      seoTitle,
      seoDescription,
      canonicalUrl,
      ogImage,
      coverImage,
    };

    if (status === 'published' && !scheduledFor) {
      postData.publishedAt = new Date();
    }

    if (scheduledFor) {
      postData.scheduledFor = new Date(scheduledFor);
      postData.status = 'scheduled';
    }

    const post = await Post.create(postData);

    // Update category count
    await Category.findByIdAndUpdate(category, { $inc: { count: 1 } });

    // Update tag counts
    for (const tagId of validTagIds) {
      await Tag.findByIdAndUpdate(tagId, { $inc: { count: 1 } });
    }

    await AuditLog.create({
      admin: req.admin._id,
      action: 'create',
      resource: 'post',
      resourceId: post._id.toString(),
      details: { title: post.title, status: post.status },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update post
router.put('/:id', authenticate, requireAdmin, validate(postValidations), async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      tags = [],
      status,
      featured,
      scheduledFor,
      seoTitle,
      seoDescription,
      canonicalUrl,
      ogImage,
      coverImage,
    } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ error: 'Category not found' });
    }

    // Check tags exist
    const tagDocs = await Tag.find({ _id: { $in: tags } });
    const validTagIds = tagDocs.map(t => t._id);

    // Update counts for old category/tags
    if (post.category.toString() !== category) {
      await Category.findByIdAndUpdate(post.category, { $inc: { count: -1 } });
      await Category.findByIdAndUpdate(category, { $inc: { count: 1 } });
    }

    // Update old tags
    const oldTagIds = post.tags.map(t => t.toString());
    for (const tagId of oldTagIds) {
      if (!validTagIds.includes(tagId)) {
        await Tag.findByIdAndUpdate(tagId, { $inc: { count: -1 } });
      }
    }
    for (const tagId of validTagIds) {
      if (!oldTagIds.includes(tagId.toString())) {
        await Tag.findByIdAndUpdate(tagId, { $inc: { count: 1 } });
      }
    }

    const updateData = {
      title,
      excerpt,
      content,
      category,
      tags: validTagIds,
      featured,
      seoTitle,
      seoDescription,
      canonicalUrl,
      ogImage,
      coverImage,
    };

    if (status === 'published' && post.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    if (scheduledFor) {
      updateData.scheduledFor = new Date(scheduledFor);
      updateData.status = 'scheduled';
    } else if (status) {
      updateData.status = status;
    }

    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('category', 'name slug color')
      .populate('tags', 'name slug');

    await AuditLog.create({
      admin: req.admin._id,
      action: 'update',
      resource: 'post',
      resourceId: post._id.toString(),
      details: { title: post.title, oldStatus: post.status, newStatus: updated.status },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Decrement category count
    await Category.findByIdAndUpdate(post.category, { $inc: { count: -1 } });

    // Decrement tag counts
    for (const tagId of post.tags) {
      await Tag.findByIdAndUpdate(tagId, { $inc: { count: -1 } });
    }

    await post.deleteOne();

    await AuditLog.create({
      admin: req.admin._id,
      action: 'delete',
      resource: 'post',
      resourceId: post._id.toString(),
      details: { title: post.title },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;