// Lightweight XSS sanitizer for string fields in body/query — strips
// script tags and neutralizes event-handler-style injection vectors
// without mangling legitimate source code being submitted for review.
function stripDangerousMarkup(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*("[^"]*"|'[^']*')/gi, '');
}

function deepSanitize(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return stripDangerousMarkup(obj);
  if (Array.isArray(obj)) return obj.map(deepSanitize);
  if (typeof obj === 'object') {
    const out = {};
    for (const key of Object.keys(obj)) {
      out[key] = deepSanitize(obj[key]);
    }
    return out;
  }
  return obj;
}

// Only sanitize metadata fields, never the raw `code` field the user
// submits for review — mangling submitted source code would corrupt
// the exact thing we're asked to analyze. Code is safely rendered as
// text on the frontend (React escapes by default) and never executed.
function sanitizeMiddleware(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    const { code, ...rest } = req.body;
    req.body = { ...deepSanitize(rest), ...(code !== undefined ? { code } : {}) };
  }
if (req.query && typeof req.query === 'object') {
  const sanitizedQuery = deepSanitize(req.query);
  for (const key of Object.keys(req.query)) {
    delete req.query[key];
  }
  Object.assign(req.query, sanitizedQuery);
}
  next();
}

module.exports = sanitizeMiddleware;