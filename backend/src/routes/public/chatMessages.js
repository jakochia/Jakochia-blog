import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { ChatMessage } from '../../models/ChatMessage.js';
import { sendEmail } from '../../services/email.js';
import {
  emitNewMessage,
  emitConversationUpdate,
} from '../../socket/socketHandler.js';

const router = express.Router();

// ============================================================
// Rate limiters
// ============================================================
const messageRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { error: 'Too many messages. Please wait before sending another.' },
});

const readRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Please slow down.' },
});

// ============================================================
// Helpers
// ============================================================
const isValidConversationId = (id) =>
  typeof id === 'string' && id.length > 0 && id.length <= 100;

const escapeHtml = (str) =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// ============================================================
// Email notification template — Jakochia brand palette
// Colors: #F8FAFC, #2563EB, #1E1B4B, #EA580C, #334155 · Font: Inter
// ============================================================
const buildNotificationHtml = ({ visitorName, visitorEmail, message }) => {
  const siteUrl = process.env.FRONTEND_URL || 'https://blog.jakochia.co.ke';
  const safeName = escapeHtml(visitorName || 'Anonymous');
  const safeEmail = escapeHtml(visitorEmail || 'Not provided');
  const safeMessage = escapeHtml(message || '');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:24px 12px; background-color:#F8FAFC; font-family:'Inter','Segoe UI','Helvetica Neue',system-ui,-apple-system,Arial,sans-serif; color:#334155;">

  <div style="max-width:600px; margin:0 auto; background-color:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(30,27,75,0.08); border:1px solid #E2E8F0;">

    <!-- Header: Primary → Secondary gradient with accent border -->
    <div style="background:linear-gradient(135deg,#2563EB 0%,#1E1B4B 100%); padding:28px 24px; text-align:center; border-bottom:4px solid #EA580C;">
      <h2 style="margin:0; font-size:22px; font-weight:700; color:#F8FAFC; letter-spacing:-0.3px;">
        💬 New Chat Message
      </h2>
      <p style="margin:6px 0 0; font-size:14px; color:#F8FAFC; opacity:0.85; font-weight:400;">
        Someone just reached out on Jakochia Blog
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px 24px;">

      <table style="width:100%; border-collapse:collapse; margin-bottom:18px;">
        <tr>
          <td style="padding:8px 0; font-size:14px; color:#334155; width:80px; font-weight:600;">From:</td>
          <td style="padding:8px 0; font-size:15px; color:#1E1B4B; font-weight:600;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-size:14px; color:#334155; font-weight:600;">Email:</td>
          <td style="padding:8px 0; font-size:15px;">
            ${
              visitorEmail
                ? `<a href="mailto:${safeEmail}" style="color:#2563EB; text-decoration:none; font-weight:600;">${safeEmail}</a>`
                : `<span style="color:#94A3B8;">${safeEmail}</span>`
            }
          </td>
        </tr>
      </table>

      <div style="border-left:4px solid #EA580C; background:#F1F5F9; padding:16px 18px; border-radius:0 10px 10px 0;">
        <p style="margin:0; font-size:15px; line-height:1.7; color:#334155; white-space:pre-wrap;">${safeMessage}</p>
      </div>

      <div style="text-align:center; margin-top:28px;">
        <a href="${siteUrl}/admin/inbox"
           style="display:inline-block; background:#2563EB; color:#F8FAFC; padding:13px 32px; border-radius:50px; text-decoration:none; font-weight:600; font-size:15px; letter-spacing:0.3px;">
          Reply in Admin Inbox →
        </a>
      </div>

    </div>

    <div style="background-color:#F8FAFC; padding:18px 24px; text-align:center; border-top:1px solid #E2E8F0;">
      <p style="margin:0; font-size:12px; color:#94A3B8;">
        Automated notification from <strong style="color:#1E1B4B;">Jakochia Blog</strong> · Code. Build. Learn. Share.
      </p>
    </div>

  </div>

</body>
</html>
  `;
};

// ============================================================
// POST /api/chat-messages — visitor sends a message
// ============================================================
router.post(
  '/',
  messageRateLimiter,
  [
    body('conversationId').notEmpty().withMessage('Conversation ID is required'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 2000 })
      .withMessage('Message too long (max 2000 chars)'),
    body('visitorName').optional().trim().isLength({ max: 100 }),
    body('visitorEmail')
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage('Valid email required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { conversationId, message, visitorName, visitorEmail } = req.body;

      if (!isValidConversationId(conversationId)) {
        return res.status(400).json({ error: 'Invalid conversation ID' });
      }

      let finalName = visitorName?.trim() || null;
      let finalEmail = visitorEmail?.trim().toLowerCase() || null;

      // If name or email missing, pull them from the latest message in this conversation
      if (!finalName || !finalEmail) {
        const existing = await ChatMessage.findOne({
          conversationId,
          sender: 'visitor',
          $or: [
            { visitorName: { $nin: [null, ''] } },
            { visitorEmail: { $nin: [null, ''] } },
          ],
        }).sort({ createdAt: -1 });

        if (existing) {
          if (!finalName) finalName = existing.visitorName;
          if (!finalEmail) finalEmail = existing.visitorEmail;
        }
      }

      const chatMessage = await ChatMessage.create({
        conversationId,
        visitorName: finalName,
        visitorEmail: finalEmail,
        message: message.trim(),
        sender: 'visitor',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      // Backfill name/email on any older messages missing them
      if (finalName || finalEmail) {
        const update = {};
        if (finalName) update.visitorName = finalName;
        if (finalEmail) update.visitorEmail = finalEmail;

        await ChatMessage.updateMany(
          {
            conversationId,
            sender: 'visitor',
            $or: [
              { visitorName: { $in: [null, ''] } },
              { visitorEmail: { $in: [null, ''] } },
            ],
          },
          { $set: update }
        );
      }

      // Real-time emit
      const io = req.app.get('io');
      if (io) {
        emitNewMessage(io, {
          _id: chatMessage._id,
          conversationId: chatMessage.conversationId,
          visitorName: finalName,
          visitorEmail: finalEmail,
          message: chatMessage.message,
          sender: chatMessage.sender,
          read: chatMessage.read,
          createdAt: chatMessage.createdAt,
        });
        emitConversationUpdate(io, conversationId);
      }

      // Email notification (fire and forget)
      if (process.env.EMAIL_USER) {
        sendEmail({
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: `💬 New message from ${finalName || 'a visitor'}`,
          htmlContent: buildNotificationHtml({
            visitorName: finalName,
            visitorEmail: finalEmail,
            message,
          }),
        }).catch((err) =>
          console.error('Email notification failed:', err.message)
        );
      }

      res.status(201).json({
        success: true,
        message: 'Message sent!',
        chatMessage: {
          id: chatMessage._id,
          createdAt: chatMessage.createdAt,
        },
      });
    } catch (error) {
      console.error('Chat message error:', error.message);
      res.status(500).json({ error: 'Failed to send message.' });
    }
  }
);

// ============================================================
// GET /api/chat-messages/:conversationId — visitor fetches history
// ============================================================
router.get('/:conversationId', readRateLimiter, async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!isValidConversationId(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const messages = await ChatMessage.find({ conversationId })
      .select('sender message adminName createdAt')
      .sort({ createdAt: 1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    console.error('Fetch messages error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;