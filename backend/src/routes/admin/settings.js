// ============================================================
// BACKEND src/routes/admin/settings.js
// ============================================================

import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { Admin } from '../../models/Admin.js';
import { AuditLog } from '../../models/AuditLog.js';

const router = express.Router();

// Get admin profile
router.get('/profile', authenticate, requireAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-passwordHash');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admin profile
router.put('/profile', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase();

    await admin.save();

    await AuditLog.create({
      admin: req.admin._id,
      action: 'update_profile',
      resource: 'admin',
      resourceId: admin._id.toString(),
      details: { name: admin.name, email: admin.email },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.put('/password', authenticate, requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id);
    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    admin.passwordHash = await Admin.hashPassword(newPassword);
    await admin.save();

    await AuditLog.create({
      admin: req.admin._id,
      action: 'change_password',
      resource: 'admin',
      resourceId: admin._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;