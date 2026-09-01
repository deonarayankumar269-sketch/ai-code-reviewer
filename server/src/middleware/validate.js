const ApiError = require('../utils/ApiError');

// Generic Zod-driven validator: validates body/query/params in one pass
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return next(ApiError.badRequest('Validation failed', errors));
  }

  // Overwrite with parsed/coerced values
  req.body = result.data.body ?? req.body;

  if (result.data.query && req.query) {
    for (const key of Object.keys(req.query)) delete req.query[key];
    Object.assign(req.query, result.data.query);
  }

  if (result.data.params && req.params) {
    for (const key of Object.keys(req.params)) delete req.params[key];
    Object.assign(req.params, result.data.params);
  }

  next();
};

module.exports = validate;