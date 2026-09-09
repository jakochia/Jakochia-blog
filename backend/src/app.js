import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';

// Import sitemap and RSS routes
import sitemapRouter from './routes/public/sitemap.js';
import rssRouter from './routes/public/rss.js';

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
// 3. CORS – allow cross-origin requests with credentials
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
// 4. Body parsers
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// 5. Cookie parser
// ============================================
app.use(cookieParser());

// ============================================
// 6. Rate limiting
// ============================================
app.use('/api', apiRateLimiter);

// ============================================
// 7. API routes
// ============================================
app.use('/api', routes);

// ============================================
// 8. Sitemap & RSS (directly at root)
// ============================================
app.use('/sitemap.xml', sitemapRouter);
app.use('/rss.xml', rssRouter);

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