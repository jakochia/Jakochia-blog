// ============================================================
// BACKEND src/routes/admin/media.js
// ============================================================

import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { Media } from '../../models/Media.js';
import { AuditLog } from '../../models/AuditLog.js';

const router = express.Router();

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [media, total] = await Promise.all([
      Media.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Media.countDocuments(),
    ]);

    res.json({
      media,
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

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { filename, originalName, path, url, altText, mimeType, size, width, height } = req.body;

    const media = await Media.create({
      filename,
      originalName,
      path,
      url,
      altText,
      mimeType,
      size,
      width,
      height,
      uploadedBy: req.admin.email,
    });

    await AuditLog.create({
      admin: req.admin._id,
      action: 'upload_media',
      resource: 'media',
      resourceId: media._id.toString(),
      details: { filename: media.filename },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    await AuditLog.create({
      admin: req.admin._id,
      action: 'delete_media',
      resource: 'media',
      resourceId: media._id.toString(),
      details: { filename: media.filename },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;