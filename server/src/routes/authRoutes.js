const router = require('express').Router();
const { register, login, refreshTokens, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', authLimiter, refreshTokens);
router.post('/logout', authenticate, logout);

module.exports = router;