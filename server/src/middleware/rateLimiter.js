const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const handler = (req, res, next) => {
  next(ApiError.tooMany('Too many requests, please try again later'));
};

const isDev = env.nodeEnv !== 'production';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 10, // dev mein testing ke liye zyada allow, production mein strict
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  message: 'Too many authentication attempts',
});

const reviewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isDev ? 30 : 8, // AI calls dev mein bhi limited rahenge but zyada headroom
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

module.exports = { authLimiter, reviewLimiter, globalLimiter };