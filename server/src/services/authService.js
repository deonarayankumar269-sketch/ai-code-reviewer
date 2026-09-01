const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function register({ name, email, password }) {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }
  const user = await userRepository.create({ name, email, password });
  return issueTokenPair(user);
}

async function login({ email, password }) {
  const user = await userRepository.findByEmail(email, true);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  return issueTokenPair(user);
}

async function issueTokenPair(user) {
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ sub: user._id.toString() });
  await userRepository.setRefreshTokenHash(user._id, hashToken(refreshToken));
  return { user: user.toSafeObject(), accessToken, refreshToken };
}

async function refresh(refreshToken) {
  if (!refreshToken) {
    throw ApiError.unauthorized('Refresh token missing');
  }
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await userRepository.findById(decoded.sub, true);
  if (!user || !user.refreshTokenHash) {
    throw ApiError.unauthorized('Session no longer valid');
  }

  const providedHash = hashToken(refreshToken);
  if (providedHash !== user.refreshTokenHash) {
    // Possible token reuse/theft — invalidate the session
    await userRepository.setRefreshTokenHash(user._id, null);
    throw ApiError.unauthorized('Session invalidated, please log in again');
  }

  return issueTokenPair(user);
}

async function logout(userId) {
  await userRepository.setRefreshTokenHash(userId, null);
}

module.exports = { register, login, refresh, logout };