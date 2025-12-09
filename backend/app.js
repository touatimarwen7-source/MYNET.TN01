const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { logger } = require('./utils/logger');

// Initialize Express app
const app = express();

// Enhanced CORS configuration for Replit
const corsOptions = {
  origin: (origin, callback) => {
    // Allow Replit origins
    const replitPattern = /\.replit\.dev$/;
    const replitCodePattern = /\.replit\.codes$/;
    const rikerPattern = /\.riker\.replit\.dev$/;

    // Allow localhost and development origins
    const allowedOrigins = [
      'http://localhost:5000',
      'http://localhost:3000',
      'http://0.0.0.0:5000',
      'http://0.0.0.0:3000',
      'http://127.0.0.1:5000',
      'http://127.0.0.1:3000',
      'https://localhost:5000',
      'https://localhost:3000',
    ];

    // Allow if no origin (Vite proxy, mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow Replit domains (including riker)
    if (replitPattern.test(origin) || replitCodePattern.test(origin) || rikerPattern.test(origin)) {
      return callback(null, true);
    }

    // Allow configured origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all in development (Replit is always development)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Total-Count'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Log CORS requests for debugging
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`📨 Incoming request: ${req.method} ${req.path} from ${req.headers.origin || 'no-origin'}`);
  }
  next();
});

app.use(cors(corsOptions));

// Enhanced security with Content Security Policy (CSP)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'",
        "https://*.replit.dev",
        "wss://*.replit.dev",
        "https://*.replit.codes",
        "wss://*.replit.codes",
        "http://localhost:*",
        "https://localhost:*",
        "ws://localhost:*",
        "wss://localhost:*",
        "http://0.0.0.0:*",
        "https://0.0.0.0:*",
        "ws://0.0.0.0:*",
        "wss://0.0.0.0:*",
      ],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  })
);