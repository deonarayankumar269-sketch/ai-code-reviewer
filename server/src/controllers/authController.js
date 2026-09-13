const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/authService');
const env = require('../config/env');

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  path: '/api/auth',
};

const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.status(201).json(new ApiResponse(201, { user, accessToken }, 'Account created successfully'));
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.status(200).json(new ApiResponse(200, { user, accessToken }, 'Login successful'));
});

const refreshTokens = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refresh(refreshToken);
  res.cookie('refreshToken', result.refreshToken, cookieOptions);
  res.status(200).json(new ApiResponse(200, { user: result.user, accessToken: result.accessToken }, 'Token refreshed'));
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  res.clearCookie('refreshToken', cookieOptions);
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

module.exports = { register, login, refreshTokens, logout };