import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from '../project/server/routes/auth.js';
import menuRoutes from '../project/server/routes/menu.js';
import orderRoutes from '../project/server/routes/orders.js';
import adminRoutes from '../project/server/routes/admin.js';
import inventoryRoutes from '../project/server/routes/inventory.js';
import migrateRoutes from '../project/server/routes/migrate.js';
import paymentRoutes from '../project/server/routes/payment.js';

// Import middleware
import { authenticateToken } from '../project/server/middleware/auth.js';
import { errorHandler } from '../project/server/middleware/errorHandler.js';

// Import services
import { testConnection } from '../project/server/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = (() => {
  const env = process.env.FRONTEND_URL;
  if (env) return env.split(',').map(s => s.trim());
  return ["http://localhost:5173", "http://localhost:5001"];
})();

const isOriginAllowed = (origin) => {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;
  const lanPattern = /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+):(5173|5001|3001)$/;
  if (lanPattern.test(origin)) return true;
  return false;
};

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn('⚠️ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rate limiting
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { error: 'Too many requests, please try again later' }
  });
  app.use(limiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock Socket.IO for serverless (real-time features won't work)
const mockIo = {
  to: () => ({ emit: () => {} }),
  emit: () => {},
  on: () => {}
};

app.use((req, res, next) => {
  req.io = mockIo;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/migrate', migrateRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files
const publicPath = path.join(__dirname, '../public');
const adminPath = path.join(publicPath, 'admin');

// Admin dashboard
app.use('/admin', express.static(adminPath));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'));
});

// Main frontend
app.use(express.static(publicPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handling
app.use(errorHandler);

// Initialize database connection
testConnection().catch(err => {
  console.error('Database connection failed:', err);
});

export default app;
