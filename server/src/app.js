const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const env = require('./config/env');
const routes = require('./routes');
const sanitizeMiddleware = require('./middleware/sanitize');
const { globalLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet());
app.use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true }));

// CORS — locked to a single known origin, credentials enabled for cookie refresh flow
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(compression());
app.use(express.json({ limit: '256kb' })); // bounds payload size against DoS
app.use(express.urlencoded({ extended: true, limit: '256kb' }));
app.use(cookieParser());

// NoSQL injection prevention — strips `$` and `.` operators from user input
app.use(mongoSanitize());
// XSS sanitization on request data
app.use(xssClean());
// HTTP Parameter Pollution prevention
app.use(hpp());
// Custom sanitizer that preserves raw code payloads while cleaning metadata
app.use(sanitizeMiddleware);

// Global rate limiting baseline (route-specific limiters layer on top)
app.use('/api', globalLimiter);

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;