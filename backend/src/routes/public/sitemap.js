import express from 'express';
import { Post } from '../../models/Post.js';
import { Category } from '../../models/Category.js';
import { Tag } from '../../models/Tag.js';
import { Project } from '../../models/Project.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const [posts, categories, tags, projects] = await Promise.all([
      Post.find({ status: 'published' }).select('slug updatedAt'),
      Category.find().select('slug'),
      Tag.find().select('slug'),
      Project.find().select('slug'),
    ]);

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static pages
    const staticPages = ['', '/blog', '/projects', '/tutorials', '/about', '/contact', '/newsletter'];
    for (const page of staticPages) {
      sitemap += `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    }

    // Blog posts
    for (const post of posts) {
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;
    }

    // Categories
    for (const cat of categories) {
      sitemap += `
  <url>
    <loc>${baseUrl}/categories/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    // Tags
    for (const tag of tags) {
      sitemap += `
  <url>
    <loc>${baseUrl}/tags/${tag.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }

    // Projects
    for (const project of projects) {
      sitemap += `
  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    sitemap += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;