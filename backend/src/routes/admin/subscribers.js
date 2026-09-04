// ============================================================
// BACKEND src/routes/admin/subscribers.js
// ============================================================

import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { Subscriber } from '../../models/Subscriber.js';

const router = express.Router();

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status = 'active', page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (status) query.status = status;

    const [subscribers, total] = await Promise.all([
      Subscriber.find(query)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Subscriber.countDocuments(query),
    ]);

    res.json({
      subscribers,
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

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }
    res.json({ success: true, message: 'Subscriber removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;