// ============================================================
// BACKEND src/routes/public/projects.js
// ============================================================

import express from 'express';
import { Project } from '../../models/Project.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    const query = {};
    if (featured === 'true') query.featured = true;

    const projects = await Project.find(query)
      .sort({ featured: -1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;