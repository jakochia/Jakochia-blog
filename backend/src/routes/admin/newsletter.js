import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { Subscriber } from '../../models/Subscriber.js';
import { AuditLog } from '../../models/AuditLog.js';
import { sendEmail, sendNewsletter } from '../../services/email.js';

const router = express.Router();

/**
 * POST /api/admin/newsletter/send
 * Send a newsletter to all active subscribers (or a test email)
 * Body: { subject, content, testEmail? }
 */
router.post('/send', authenticate, requireAdmin, async (req, res) => {
  try {
    const { subject, content, testEmail } = req.body;

    // Validate input
    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content are required' });
    }

    // If testEmail is provided, send only to that address
    if (testEmail) {
      const result = await sendEmail({
        to: testEmail,
        subject: `[TEST] ${subject}`,
        htmlContent: content,
        plainText: content.replace(/<[^>]*>/g, ''), // fallback plain text
        unsubscribeUrl: '', // not needed for test
      });

      await AuditLog.create({
        admin: req.admin._id,
        action: 'send_test_email',
        resource: 'newsletter',
        details: { subject, testEmail },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      return res.json({
        success: true,
        message: 'Test email sent successfully',
        result,
      });
    }

    // Get all active subscribers
    const subscribers = await Subscriber.find({ status: 'active' }).select('email');
    const recipientEmails = subscribers.map(s => s.email);

    if (recipientEmails.length === 0) {
      return res.status(400).json({ error: 'No active subscribers' });
    }

    // Send to all subscribers
    const results = await sendNewsletter({
      recipients: recipientEmails,
      subject,
      htmlContent: content,
      plainText: content.replace(/<[^>]*>/g, ''),
      unsubscribeUrl: '', // you can build a proper unsubscribe link later
    });

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    await AuditLog.create({
      admin: req.admin._id,
      action: 'send_newsletter',
      resource: 'newsletter',
      details: {
        subject,
        total: recipientEmails.length,
        successCount,
        failCount,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: `Newsletter sent to ${successCount} subscribers`,
      stats: {
        total: recipientEmails.length,
        success: successCount,
        failed: failCount,
      },
      results, // optional – includes per‑email status
    });
  } catch (error) {
    console.error('Newsletter send error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/newsletter/stats
 * Get the number of active subscribers
 */
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const total = await Subscriber.countDocuments({ status: 'active' });
    res.json({ totalSubscribers: total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;