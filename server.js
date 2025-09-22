const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy to get real IP addresses (for rate limiting)
app.set('trust proxy', true);

// Rate limiting - 2 requests per IP per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 2, // Limit each IP to 2 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  
  // Key generator to ensure we're using the correct IP
  keyGenerator: (req) => {
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
               (req.connection.socket ? req.connection.socket.remoteAddress : null);
    console.log(`Rate limit check for IP: ${ip}`);
    return ip;
  },
  
  // Skip successful requests that don't hit our audit endpoint
  skip: (req) => {
    const isAuditRequest = req.path === '/api/shopify/audit-public-store' && req.method === 'POST';
    if (!isAuditRequest) {
      console.log(`Skipping rate limit for non-audit request: ${req.method} ${req.path}`);
    }
    return !isAuditRequest;
  },
  
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    const ip = req.ip;
    console.log(`Rate limit exceeded for IP: ${ip}`);
    res.status(429).json({
      status: 'error',
      message: 'You\'ve reached the free audit limit (2 per 15 minutes). Install the AI Marketing Agent for unlimited audits and advanced features.',
      installUrl: 'https://apps.shopify.com/ai-marketing-coordinator',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
      currentRequests: req.rateLimit.current,
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining
    });
  }
});

// Apply rate limiting to all requests
app.use(limiter);

// Debug middleware to log IP addresses
app.use((req, res, next) => {
  if (req.path.includes('/api/shopify/audit-public-store')) {
    console.log(`Audit request from IP: ${req.ip}, X-Forwarded-For: ${req.get('X-Forwarded-For')}, X-Real-IP: ${req.get('X-Real-IP')}`);
  }
  next();
});

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.DJANGO_API_BASE_URL || "http://localhost:8000"],
      fontSrc: ["'self'"],
    },
  },
}));
app.use(compression());
app.use(cors());
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/assets', express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api', require('./routes/api'));
app.use('/', require('./routes/pages'));

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    status: 'error', 
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fix My Shopify server running on port ${PORT}`);
  console.log(`📱 Visit: http://localhost:${PORT}`);
  console.log(`🔗 Django API: ${process.env.DJANGO_API_BASE_URL || 'http://localhost:8000'}`);
});

module.exports = app;
