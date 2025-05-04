require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const loanRoutes = require('./routes/loanRoutes');
const repaymentRoutes = require('./routes/repaymentRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// ======================
// Security Middleware
// ======================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Prevent parameter pollution
app.use(hpp());

// Sanitize data to prevent MongoDB injection attacks
app.use(mongoSanitize({
  replaceWith: '_removed_' // Replace malicious characters with this placeholder
}));

// ======================
// Standard Middleware
// ======================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev'));

// ======================
// Static Files
// ======================
app.use('/receipts', express.static(path.join(__dirname, 'receipts')));

// ======================
// API Routes (Versioned)
// ======================
const apiRouter = express.Router();
app.use('/api/v1', apiRouter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/loans', loanRoutes);
apiRouter.use('/repayments', repaymentRoutes);
apiRouter.use('/summary', summaryRoutes);
apiRouter.use('/notifications', notificationRoutes);

// ======================
// Health Check Route
// ======================
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ======================
// Documentation Route
// ======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================
// Error Handlers
// ======================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.use(errorHandler);

// ======================
// Start Server After DB Connect
// ======================
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Listening on port ${PORT}`);
    console.log('🗄  Database: ✅ Connected');
  });

  // Graceful shutdown for SIGTERM and SIGINT
  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully...');
    server.close(() => {
      console.log('💥 Process terminated!');
      process.exit(1);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT RECEIVED. Shutting down gracefully...');
    server.close(() => {
      console.log('💥 Process terminated!');
      process.exit(1);
    });
  });

  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err.name, err.message);
    server.close(() => process.exit(1));
  });

}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
  process.exit(1);
});

module.exports = app;
