import express from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../../models/Admin.js';
import { AuditLog } from '../../models/AuditLog.js';
import { loginRateLimiter } from '../../middleware/rateLimiter.js';
import { validate, loginValidations } from '../../middleware/validation.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Initial admin setup (first run)
router.post('/setup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await Admin.findOne();
    if (existing) {
      return res.status(403).json({ error: 'Admin already exists' });
    }

    const passwordHash = await Admin.hashPassword(password);

    const admin = await Admin.create({
      email: email || process.env.ADMIN_EMAIL || 'admin@jakochia.com',
      passwordHash,
      name: name || 'Newton Asha',
      role: 'superadmin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', loginRateLimiter, validate(loginValidations), async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      return res.status(401).json({
        error: 'Account temporarily locked. Please try again later.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= 5) {
        admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await admin.save();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset login attempts
    admin.loginAttempts = 0;
    admin.lockedUntil = null;
    admin.lastLogin = new Date();
    await admin.save();

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Set cookie (fallback, but frontend will use token from response body)
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    // ✅ Send token in response body (primary method for frontend)
    res.json({
      success: true,
      token, // <-- Critical: send token here
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Log login
    await AuditLog.create({
      admin: admin._id,
      action: 'login',
      resource: 'admin',
      details: { email: admin.email },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    await AuditLog.create({
      admin: req.admin._id,
      action: 'logout',
      resource: 'admin',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current admin (protected)
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;