import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';

const app = express();

// ✅ Fix: Trust proxy – required for Render (behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ✅ CORS configuration for cross-domain cookies
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://blog.jakochia.co.ke',
  'https://jakochia-blog.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
app.use('/api', apiRateLimiter);

// API routes
app.use('/api', routes);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Jakochia API is running',
    endpoints: {
      posts: '/api/posts',
      categories: '/api/categories',
      projects: '/api/projects',
      admin: '/api/admin',
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;