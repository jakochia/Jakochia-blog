import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';

const app = express();

// ✅ FIX 1: Trust proxy – required for Render (behind reverse proxy)
app.set('trust proxy', 1);

// ✅ FIX 2: Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));

// ✅ FIX 3: CORS configuration – allows cross-domain cookies
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://blog.jakochia.co.ke',
  'https://jakochia-blog.vercel.app',
  'https://jakochia-blog.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,                    // ✅ Required for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
}));

// ✅ FIX 4: Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ FIX 5: Cookie parser
app.use(cookieParser());

// ✅ FIX 6: Rate limiting
app.use('/api', apiRateLimiter);

// ✅ FIX 7: API routes
app.use('/api', routes);

// ✅ FIX 8: Health check / root endpoint
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

import rssRouter from './routes/public/rss.js';
import sitemapRouter from './routes/public/sitemap.js';

// ... after all other app.use() calls, before error handlers:

app.use('/rss.xml', rssRouter);
app.use('/sitemap.xml', sitemapRouter);

// ✅ FIX 12: Optional – log all requests in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

export default app;