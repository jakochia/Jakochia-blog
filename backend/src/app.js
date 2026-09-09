import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';
import { Post } from './models/Post.js';
import { Project } from './models/Project.js';
import { Category } from './models/Category.js';

const app = express();

// ============================================
// 1. Trust proxy – required for Render
// ============================================
app.set('trust proxy', 1);

// ============================================
// 2. Security headers (Helmet)
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://vercel.live", "https://vercel.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://*"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://jakochia-backend.onrender.com", "https://blog.jakochia.co.ke"],
      frameSrc: ["'self'", "https://vercel.live"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
}));

// ============================================
// 3. CORS
// ============================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://blog.jakochia.co.ke',
  'https://jakochia-blog.vercel.app',
  'https://jakochia-blog.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
}));

// ============================================
// 4. Body parsers & cookie parser
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ============================================
// 5. Rate limiting
// ============================================
app.use('/api', apiRateLimiter);

// ============================================
// 6. API routes
// ============================================
app.use('/api', routes);

// ============================================
// 7. Sitemap (inline)
// ============================================
app.get('/sitemap.xml', async (req, res) => {
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
  <url><loc>${siteUrl}/tutorials</loc><lastmod>${now}</lastmod><priority>0.6</priority></url>
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

// ============================================
// 8. RSS Feed (inline)
// ============================================
app.get('/rss.xml', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('category', 'name')
      .populate('tags', 'name')
      .sort({ publishedAt: -1 })
      .limit(20);

    const siteUrl = process.env.FRONTEND_URL || 'https://blog.jakochia.co.ke';

    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Jakochia Blog</title>
  <link>${siteUrl}</link>
  <description>Code. Build. Learn. Share. – Exploring software engineering, networking, cybersecurity, AI and technology.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
`;

    posts.forEach(post => {
      const pubDate = post.publishedAt || post.createdAt;
      const link = `${siteUrl}/blog/${post.slug}`;
      const description = (post.excerpt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const content = (post.content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      rss += `
  <item>
    <title>${post.title.replace(/&/g, '&amp;')}</title>
    <link>${link}</link>
    <guid>${link}</guid>
    <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
    <description><![CDATA[${description}]]></description>
    <content:encoded><![CDATA[${content}]]></content:encoded>
    ${post.category ? `<category>${post.category.name.replace(/&/g, '&amp;')}</category>` : ''}
    ${post.tags.map(tag => `<category>${tag.name.replace(/&/g, '&amp;')}</category>`).join('')}
  </item>`;
    });

    rss += `
</channel>
</rss>`;

    res.set('Content-Type', 'application/rss+xml');
    res.send(rss);
  } catch (error) {
    console.error('RSS generation error:', error);
    res.status(500).send('Error generating RSS');
  }
});

// ============================================
// 9. Health check / root endpoint
// ============================================
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Jakochia API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      posts: '/api/posts',
      categories: '/api/categories',
      tags: '/api/tags',
      projects: '/api/projects',
      comments: '/api/comments',
      search: '/api/search',
      admin: '/api/admin',
      newsletter: '/api/newsletter',
      contact: '/api/contact',
      rss: '/rss.xml',
      sitemap: '/sitemap.xml',
    },
  });
});

// ============================================
// 10. Error handling (must be last)
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// 11. Optional – development logging
// ============================================
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

export default app;