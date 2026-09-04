// ============================================================
// BACKEND src/routes/admin/comments.js
// ============================================================

import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { Comment } from '../../models/Comment.js';
import { AuditLog } from '../../models/AuditLog.js';

const router = express.Router();

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (status) query.status = status;

    const [comments, total] = await Promise.all([
      Comment.find(query)
        .populate('post', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Comment.countDocuments(query),
    ]);

    res.json({
      comments,
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

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await AuditLog.create({
      admin: req.admin._id,
      action: 'update_comment',
      resource: 'comment',
      resourceId: comment._id.toString(),
      details: { status: comment.status },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await AuditLog.create({
      admin: req.admin._id,
      action: 'delete_comment',
      resource: 'comment',
      resourceId: comment._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;