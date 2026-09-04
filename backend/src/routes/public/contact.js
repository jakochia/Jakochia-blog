import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendEmail } from '../../services/email.js';
import { contactRateLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

// Email template for contact notifications
const buildContactEmailHtml = ({ name, email, subject, message }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #111827; color: #e2e8f0; border-radius: 12px;">
      <h2 style="color: #60a5fa; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">📩 New Contact Message</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
      <div style="background: #0f172a; padding: 16px; border-radius: 8px; margin-top: 12px;">
        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
      </div>
      <hr style="border: 1px solid #1e293b; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 14px;">This message was sent via the Jakochia Blog contact form.</p>
    </div>
  `;
};

// POST /api/contact
router.post(
  '/',
  contactRateLimiter,
  [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').optional().isLength({ max: 200 }),
    body('message').notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(err => ({ field: err.path, message: err.msg })),
      });
    }

    const { name, email, subject, message } = req.body;

    try {
      // Send email to admin
      const adminEmail = process.env.ADMIN_EMAIL || 'ombuyanewton@gmail.com';
      const emailSubject = subject ? `[Contact] ${subject}` : '[Contact] New message from website';

      const result = await sendEmail({
        to: adminEmail,
        subject: emailSubject,
        htmlContent: buildContactEmailHtml({ name, email, subject, message }),
        plainText: `From: ${name} (${email})\nSubject: ${subject || 'No subject'}\n\nMessage:\n${message}`,
      });

      // Optional: send auto-reply to the user
      // (disabled to avoid spam, but can be enabled)

      res.status(200).json({
        success: true,
        message: 'Your message has been sent. We’ll get back to you soon!',
      });
    } catch (error) {
      console.error('Contact email error:', error);
      res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
  }
);

export default router;