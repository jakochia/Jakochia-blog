import express from 'express';
import { Post } from '../../models/Post.js';

const router = express.Router();

router.get('/rss.xml', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(20)
      .populate('category', 'name');

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Jakochia Blog</title>
  <link>${baseUrl}</link>
  <description>Code. Build. Learn. Share. — Exploring software engineering, networking, cybersecurity, AI, and technology.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />`;

    for (const post of posts) {
      const pubDate = post.publishedAt || post.createdAt;
      const excerpt = post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 200) + '...';
      
      rss += `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${baseUrl}/blog/${post.slug}</link>
    <guid>${baseUrl}/blog/${post.slug}</guid>
    <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
    <description><![CDATA[${excerpt}]]></description>
    <category>${post.category?.name || 'Uncategorized'}</category>
  </item>`;
    }

    rss += `
</channel>
</rss>`;

    res.header('Content-Type', 'application/xml');
    res.send(rss);
  } catch (error) {
    console.error('RSS generation error:', error);
    res.status(500).send('Error generating RSS feed');
  }
});

export default router;