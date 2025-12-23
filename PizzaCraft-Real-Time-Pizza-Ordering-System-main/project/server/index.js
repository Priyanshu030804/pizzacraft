import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import inventoryRoutes from './routes/inventory.js';
import migrateRoutes from './routes/migrate.js';
import paymentRoutes from './routes/payment.js';
import feedbackRoutes from './routes/feedback.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import services
import { initializeSocket } from './services/socketService.js';
import { testConnection } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = createServer(app);
// CORS configuration with dynamic origin validation
const allowedOrigins = (() => {
  const defaults = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5001",
    "http://localhost:5002",
    "http://localhost:3002",
    "http://172.26.91.12:5173",
    "http://172.26.91.12:5174",
    "http://172.26.91.12:5001",
    "http://172.26.91.12:5002"
  ];
  const env = process.env.FRONTEND_URL;
  if (env) {
    const envOrigins = env.split(',').map(s => s.trim());
    return [...new Set([...defaults, ...envOrigins])];
  }
  return defaults;
})();

// Function to check if origin is allowed (supports LAN IPs dynamically)
const isOriginAllowed = (origin) => {
  if (!origin) return false;

  // Check exact matches
  if (allowedOrigins.includes(origin)) return true;

  // Allow Vercel deployment URLs (*.vercel.app)
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;

  // Allow any local network IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x) with ports 5173 or 5001
  const lanPattern = /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+):(5173|5174|5001|5002|3001|3002)$/;
  if (lanPattern.test(origin)) return true;

  return false;
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
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

// Explicitly handle CORS preflight
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin || isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rate limiting (relaxed in development to prevent accidental 429s during HMR / double effects)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { error: 'Too many requests, please try again later' }
  });
  app.use(limiter);
} else {
  // In development, still guard extreme abuse but allow generous limit
  const devLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(devLimiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Socket.IO
initializeSocket(io);

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/migrate', migrateRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve admin dashboard at /admin
  const adminPath = path.join(__dirname, '../../admin-dashboard/dist');
  app.use('/admin', express.static(adminPath));

  // Serve main frontend at root
  const frontendPath = path.join(__dirname, '../dist');
  app.use(express.static(frontendPath));

  // SPA fallback for admin routes
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
  });

  // SPA fallback for main app (must be last)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// 404 handler (only in development, production uses SPA fallback)
if (process.env.NODE_ENV !== 'production') {
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

// Align default port with frontend expectations (frontend hardcodes 3001)
console.log('DEBUG: process.argv:', process.argv);
let portFromArg = null;
const portArgIndex = process.argv.indexOf('--port');
if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
  const parsed = parseInt(process.argv[portArgIndex + 1], 10);
  if (!isNaN(parsed)) {
    portFromArg = parsed;
  }
}
const PORT = portFromArg || process.env.PORT || 3002;
console.log('DEBUG: Selected PORT:', PORT);

// For Vercel serverless deployment, export the app
// Check if running in Vercel environment
const isVercel = process.env.VERCEL === '1' || process.env.NOW_REGION;

if (!isVercel) {
  // Local/traditional server mode
  // Test database connection before starting server
  testConnection().then((connected) => {
    if (connected) {
      console.log('✅ Database connected successfully');
    } else {
      console.log('⚠️ Database connection failed, but starting server anyway for development');
    }

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Socket.IO server initialized`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL(s): ${allowedOrigins.join(', ')}`);
    });
  }).catch((error) => {
    console.error('❌ Database connection error:', error.message);
    console.log('⚠️ Starting server anyway for development');

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (without database)`);
      console.log(`📱 Socket.IO server initialized`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL(s): ${allowedOrigins.join(', ')}`);
    });
  });
}

// Export for Vercel serverless
export default app;
export { io };