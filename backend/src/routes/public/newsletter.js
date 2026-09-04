import express from 'express';
import { Subscriber } from '../../models/Subscriber.js';
import { newsletterRateLimiter } from '../../middleware/rateLimiter.js';
import { validate, subscriberValidations } from '../../middleware/validation.js';
import { sendEmail } from '../../services/email.js';

const router = express.Router();

// Welcome email template
const buildWelcomeEmailHtml = (email) => {
  const year = new Date().getFullYear();
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #111827; color: #e2e8f0; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="color: #60a5fa; text-align: center;">📬 Welcome to Jakochia Blog!</h2>
      <p>Hi there,</p>
      <p>You've successfully subscribed to the <strong>Jakochia Blog</strong> newsletter.</p>
      <p>You'll receive updates about new articles, tutorials, projects, and technology insights from <strong>Newton Asha</strong>.</p>
      <div style="background: #0f172a; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #94a3b8;">📅 You'll get our next email soon. Stay tuned!</p>
      </div>
      <hr style="border: 1px solid #1e293b; margin: 20px 0;" />
      <p style="font-size: 14px; color: #94a3b8; text-align: center;">
        If you didn't subscribe, you can ignore this email or 
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/newsletter" style="color: #3b82f6; text-decoration: underline;">unsubscribe here</a>.
      </p>
      <p style="font-size: 12px; color: #475569; text-align: center; margin-top: 16px;">
        &copy; ${year} Jakochia Blog — Code. Build. Learn. Share.
      </p>
    </div>
  `;
};

// POST /api/newsletter/subscribe
router.post(
  '/subscribe',
  newsletterRateLimiter,
  validate(subscriberValidations),
  async (req, res) => {
    try {
      const { email } = req.body;

      // Check if already subscribed
      const existing = await Subscriber.findOne({ email });
      if (existing) {
        if (existing.status === 'unsubscribed') {
          // Re-activate
          existing.status = 'active';
          existing.unsubscribedAt = null;
          await existing.save();

          // Send reactivation welcome back email
          // (optional: you could send a different template)
          await sendEmail({
            to: email,
            subject: 'Welcome back to Jakochia Blog!',
            htmlContent: buildWelcomeEmailHtml(email),
          });

          return res.json({
            success: true,
            message: 'You have been re-subscribed! Check your email.',
          });
        }
        return res.status(409).json({
          error: 'Email already subscribed',
        });
      }

      // Create new subscriber
      const subscriber = await Subscriber.create({
        email,
        ipAddress: req.ip,
      });

      // Send welcome email
      try {
        await sendEmail({
          to: email,
          subject: 'Welcome to Jakochia Blog! 🎉',
          htmlContent: buildWelcomeEmailHtml(email),
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // We still return success to the user, but log the error
        // Optionally, you can store a flag to retry later
      }

      res.status(201).json({
        success: true,
        message: 'Subscribed successfully! Check your email for confirmation.',
      });
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// POST /api/newsletter/unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found' });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({
      success: true,
      message: 'Unsubscribed successfully.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;