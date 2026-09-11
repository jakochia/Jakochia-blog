import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { ChatMessage } from '../../models/ChatMessage.js';
import { AuditLog } from '../../models/AuditLog.js';

const router = express.Router();

// GET – list all conversations (grouped)
router.get('/conversations', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const conversations = await ChatMessage.aggregate([
      // Group by conversationId
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$message' },
          lastSender: { $first: '$sender' },
          lastMessageAt: { $first: '$createdAt' },
          visitorName: { $first: '$visitorName' },
          visitorEmail: { $first: '$visitorEmail' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$sender', 'visitor'] }, { $eq: ['$read', false] }] },
                1,
                0,
              ],
            },
          },
          totalMessages: { $sum: 1 },
        },
      },
      // Sort by most recent
      { $sort: { lastMessageAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    const total = await ChatMessage.distinct('conversationId').then((ids) => ids.length);

    res.json({
      conversations,
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

// GET – unread count (for sidebar badge)
router.get('/unread-count', authenticate, requireAdmin, async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({
      sender: 'visitor',
      read: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET – messages in a conversation
router.get('/conversation/:conversationId', authenticate, requireAdmin, async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    // Mark all visitor messages as read
    await ChatMessage.updateMany(
      {
        conversationId: req.params.conversationId,
        sender: 'visitor',
        read: false,
      },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST – admin replies to a conversation
router.post('/reply', authenticate, requireAdmin, async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message?.trim()) {
      return res.status(400).json({ error: 'Conversation ID and message required' });
    }

    const reply = await ChatMessage.create({
      conversationId,
      message: message.trim(),
      sender: 'admin',
      adminId: req.admin._id,
      adminName: req.admin.name || 'Newton Asha',
      read: true,
    });

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
    res.status(500).json({ error: error.message });
  }
});

// DELETE – delete a conversation
router.delete('/conversation/:conversationId', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await ChatMessage.deleteMany({
      conversationId: req.params.conversationId,
    });

    await AuditLog.create({
      admin: req.admin._id,
      action: 'delete_conversation',
      resource: 'chat',
      resourceId: req.params.conversationId,
      details: { deletedCount: result.deletedCount },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;