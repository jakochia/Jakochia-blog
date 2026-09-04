// ============================================================
// BACKEND src/routes/admin/dashboard.js
// ============================================================

import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { Post } from '../../models/Post.js';
import { Comment } from '../../models/Comment.js';
import { Subscriber } from '../../models/Subscriber.js';
import { Project } from '../../models/Project.js';
import { Analytics } from '../../models/Analytics.js';
import { AuditLog } from '../../models/AuditLog.js';

const router = express.Router();

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      pendingComments,
      totalComments,
      totalSubscribers,
      totalProjects,
      recentActivity,
    ] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: 'published' }),
      Post.countDocuments({ status: 'draft' }),
      Post.aggregate([{ $group: { _id: null, total: { $sum: '$viewCount' } } }]),
      Comment.countDocuments({ status: 'pending' }),
      Comment.countDocuments(),
      Subscriber.countDocuments({ status: 'active' }),
      Project.countDocuments(),
      AuditLog.find()
        .populate('admin', 'name email')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    // Get recent posts
    const recentPosts = await Post.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status publishedAt createdAt');

    // Get recent comments
    const recentComments = await Comment.find()
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name content status createdAt');

    res.json({
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews[0]?.total || 0,
        pendingComments,
        totalComments,
        totalSubscribers,
        totalProjects,
      },
      recentActivity,
      recentPosts,
      recentComments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics data for charts
router.get('/analytics', authenticate, requireAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Page views over time
    const viewsOverTime = await Analytics.aggregate([
      {
        $match: {
          type: 'pageview',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Top articles
    const topArticles = await Post.find({ status: 'published' })
      .sort({ viewCount: -1 })
      .limit(5)
      .select('title slug viewCount');

    // Device types
    const devices = await Analytics.aggregate([
      {
        $match: { type: 'pageview' },
      },
      {
        $group: {
          _id: '$deviceType',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      viewsOverTime: viewsOverTime.map(d => ({
        date: `${d._id.year}-${String(d._id.month).padStart(2, '0')}-${String(d._id.day).padStart(2, '0')}`,
        count: d.count,
      })),
      topArticles,
      devices: devices.map(d => ({
        type: d._id || 'unknown',
        count: d.count,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;