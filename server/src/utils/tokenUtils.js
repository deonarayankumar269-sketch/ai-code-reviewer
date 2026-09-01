const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAccessToken(payload) {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenTtl,
    issuer: 'ai-code-reviewer',
  });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenTtl,
    issuer: 'ai-code-reviewer',
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret, { issuer: 'ai-code-reviewer' });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret, { issuer: 'ai-code-reviewer' });
}

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };