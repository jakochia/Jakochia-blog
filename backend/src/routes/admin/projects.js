// ============================================================
// BACKEND src/routes/admin/projects.js
// ============================================================

import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { Project } from '../../models/Project.js';
import { AuditLog } from '../../models/AuditLog.js';
import { validate, projectValidations } from '../../middleware/validation.js';

const router = express.Router();

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, requireAdmin, validate(projectValidations), async (req, res) => {
  try {
    const {
      name,
      description,
      longDescription,
      technologies = [],
      coverImage,
      screenshots = [],
      githubUrl,
      liveUrl,
      featured = false,
      status = 'planning',
    } = req.body;

    const project = await Project.create({
      name,
      description,
      longDescription,
      technologies,
      coverImage,
      screenshots,
      githubUrl,
      liveUrl,
      featured,
      status,
    });

    await AuditLog.create({
      admin: req.admin._id,
      action: 'create_project',
      resource: 'project',
      resourceId: project._id.toString(),
      details: { name: project.name },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, requireAdmin, validate(projectValidations), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await AuditLog.create({
      admin: req.admin._id,
      action: 'update_project',
      resource: 'project',
      resourceId: project._id.toString(),
      details: { name: project.name },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await AuditLog.create({
      admin: req.admin._id,
      action: 'delete_project',
      resource: 'project',
      resourceId: project._id.toString(),
      details: { name: project.name },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;