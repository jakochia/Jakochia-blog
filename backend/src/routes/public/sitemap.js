import express from 'express';
import { Post } from '../../models/Post.js';
import { Project } from '../../models/Project.js';
import { Category } from '../../models/Category.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const siteUrl = process.env.FRONTEND_URL || 'https://blog.jakochia.co.ke';
    const now = new Date().toISOString();

    const posts = await Post.find({ status: 'published' }).select('slug updatedAt');
    const projects = await Project.find().select('slug updatedAt');
    const categories = await Category.find().select('slug');

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><lastmod>${now}</lastmod><priority>1.0</priority></url>
  <url><loc>${siteUrl}/blog</loc><lastmod>${now}</lastmod><priority>0.9</priority></url>
  <url><loc>${siteUrl}/projects</loc><lastmod>${now}</lastmod><priority>0.8</priority></url>
  <url><loc>${siteUrl}/about</loc><lastmod>${now}</lastmod><priority>0.7</priority></url>
  <url><loc>${siteUrl}/contact</loc><lastmod>${now}</lastmod><priority>0.6</priority></url>
`;

    posts.forEach(post => {
      const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString() : now;
      sitemap += `  <url><loc>${siteUrl}/blog/${post.slug}</loc><lastmod>${lastmod}</lastmod><priority>0.8</priority></url>\n`;
    });

    projects.forEach(proj => {
      const lastmod = proj.updatedAt ? new Date(proj.updatedAt).toISOString() : now;
      sitemap += `  <url><loc>${siteUrl}/projects/${proj.slug}</loc><lastmod>${lastmod}</lastmod><priority>0.7</priority></url>\n`;
    });

    categories.forEach(cat => {
      sitemap += `  <url><loc>${siteUrl}/categories/${cat.slug}</loc><lastmod>${now}</lastmod><priority>0.6</priority></url>\n`;
    });

    sitemap += `</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;