require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const taskRoutes = require('./routes/taskRoutes');
const alertRoutes = require('./routes/alertRoutes');
const moodRoutes = require('./routes/moodRoutes');

// Connect to Database
connectDB();

const app = express();
app.set('trust proxy', 1);

// ─── Security Middleware ──────────────────────────────────────────────────────

// 1. Set secure HTTP response headers (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet());

// 2. Restrictive CORS — allow deployed frontend origins + dynamic vercel preview URLs
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://mental-wellbeing-app-sandy.vercel.app',
  'https://mental-wellbeing-app-cf86.vercel.app'
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin, allowed explicit origins, OR any vercel.app subdomain
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 3. Limit request body size to prevent payload flooding
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// 4. Global rate limiter — prevent brute-force / DoS on all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// 5. Stricter rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/users/login', authLimiter);   // Apply strict limiter to login
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/moods', moodRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── Global Error Handler (prevents stack trace leakage) ─────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  // Log full error internally but never expose stack traces to the client
  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${err.message}`);
  res.status(status).json({
    message: err.message,
    // Only include stack in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

module.exports = app; // Required for Vercel serverless deployment