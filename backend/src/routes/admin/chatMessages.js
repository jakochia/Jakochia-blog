import express from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { ChatMessage } from '../../models/ChatMessage.js';
import { AuditLog } from '../../models/AuditLog.js';
import { emitNewMessage, emitMessageRead } from '../../socket/socketHandler.js';

const router = express.Router();

// ------------------------------------------------------------
// Rate limiter for admin chat endpoints
// ------------------------------------------------------------
const adminChatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Please slow down.' },
});

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const isValidConversationId = (id) =>
  typeof id === 'string' && id.length > 0 && id.length <= 100;

const safeInt = (value, fallback, min, max) => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
};

// ============================================================
// GET /conversations — list all conversations (grouped + paginated)
// ============================================================
router.get('/conversations', authenticate, requireAdmin, adminChatLimiter, async (req, res) => {
  try {
    const page = safeInt(req.query.page, 1, 1, 10_000);
    const limit = safeInt(req.query.limit, 50, 1, 100);
    const skip = (page - 1) * limit;

    const [conversations, totalResult] = await Promise.all([
      ChatMessage.aggregate([
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: '$conversationId',
            lastMessage: { $first: '$message' },
            lastSender: { $first: '$sender' },
            lastMessageAt: { $first: '$createdAt' },
            allNames: {
              $push: {
                $cond: [
                  {
                    $and: [
                      { $ne: ['$visitorName', null] },
                      { $ne: ['$visitorName', ''] },
                    ],
                  },
                  '$visitorName',
                  '$$REMOVE',
                ],
              },
            },
            allEmails: {
              $push: {
                $cond: [
                  {
                    $and: [
                      { $ne: ['$visitorEmail', null] },
                      { $ne: ['$visitorEmail', ''] },
                    ],
                  },
                  '$visitorEmail',
                  '$$REMOVE',
                ],
              },
            },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$sender', 'visitor'] },
                      { $eq: ['$read', false] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            totalMessages: { $sum: 1 },
          },
        },
        {
          $addFields: {
            visitorName: { $arrayElemAt: ['$allNames', 0] },
            visitorEmail: { $arrayElemAt: ['$allEmails', 0] },
          },
        },
        { $project: { allNames: 0, allEmails: 0 } },
        { $sort: { lastMessageAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      ChatMessage.aggregate([
        { $group: { _id: '$conversationId' } },
        { $count: 'total' },
      ]),
    ]);

    const total = totalResult[0]?.total || 0;

    res.json({
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Conversations error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// GET /unread-count — global unread visitor messages
// ============================================================
router.get('/unread-count', authenticate, requireAdmin, adminChatLimiter, async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({
      sender: 'visitor',
      read: false,
    });
    res.json({ count });
  } catch (error) {
    console.error('Unread count error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// GET /conversation/:conversationId — messages + mark as read
// ============================================================
router.get(
  '/conversation/:conversationId',
  authenticate,
  requireAdmin,
  adminChatLimiter,
  async (req, res) => {
    try {
      const { conversationId } = req.params;

      if (!isValidConversationId(conversationId)) {
        return res.status(400).json({ error: 'Invalid conversation ID' });
      }

      const messages = await ChatMessage.find({ conversationId }).sort({ createdAt: 1 });

      await ChatMessage.updateMany(
        { conversationId, sender: 'visitor', read: false },
        { $set: { read: true } }
      );

      const io = req.app.get('io');
      if (io) emitMessageRead(io, conversationId);

      res.json(messages);
    } catch (error) {
      console.error('Fetch conversation error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// ============================================================
// POST /reply — admin replies to a conversation
// ============================================================
router.post('/reply', authenticate, requireAdmin, adminChatLimiter, async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!isValidConversationId(conversationId)) {
      return res.status(400).json({ error: 'Valid conversation ID required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 chars)' });
    }

    const reply = await ChatMessage.create({
      conversationId,
      message: message.trim(),
      sender: 'admin',
      adminId: req.admin._id,
      adminName: req.admin.name || req.admin.displayName || 'Newton Asha',
      read: true,
    });

    const io = req.app.get('io');
    if (io) {
      emitNewMessage(io, {
        _id: reply._id,
        conversationId: reply.conversationId,
        message: reply.message,
        sender: reply.sender,
        adminName: reply.adminName,
        createdAt: reply.createdAt,
      });
    }

    await AuditLog.create({
      admin: req.admin._id,
      action: 'reply_chat',
      resource: 'chat',
      resourceId: conversationId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error('Reply error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// DELETE /conversation/:conversationId
// ============================================================
router.delete(
  '/conversation/:conversationId',
  authenticate,
  requireAdmin,
  adminChatLimiter,
  async (req, res) => {
    try {
      const { conversationId } = req.params;

      if (!isValidConversationId(conversationId)) {
        return res.status(400).json({ error: 'Invalid conversation ID' });
      }

      const result = await ChatMessage.deleteMany({ conversationId });

      await AuditLog.create({
        admin: req.admin._id,
        action: 'delete_conversation',
        resource: 'chat',
        resourceId: conversationId,
        details: { deletedCount: result.deletedCount },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
      console.error('Delete conversation error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;