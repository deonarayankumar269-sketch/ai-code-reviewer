const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const env = require('../config/env');

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
}

// Central error handler — normalizes Mongo/JWT/Zod-adjacent errors into
// ApiError shape and never leaks stack traces in production.
function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error.name === 'ValidationError') {
      error = ApiError.badRequest('Validation error', Object.values(error.errors).map(e => e.message));
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      error = ApiError.conflict(`${field} already in use`);
    } else if (error.name === 'CastError') {
      error = ApiError.badRequest('Invalid resource identifier');
    } else {
      error = ApiError.internal(env.nodeEnv === 'production' ? 'Internal server error' : error.message);
    }
  }

  if (!error.isOperational) {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  } else if (error.statusCode >= 500) {
    logger.error(err.message, { stack: err.stack });
  } else {
    logger.warn(err.message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(env.nodeEnv !== 'production' && { stack: err.stack }),
  });
}

module.exports = { notFoundHandler, errorHandler };