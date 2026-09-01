const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const reviewService = require('../services/reviewService');

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, review, 'Code review completed'));
});

const getReview = asyncHandler(async (req, res) => {
  const review = await reviewService.getReview(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, review, 'Review fetched'));
});

const listReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50); // hard cap prevents abuse
  const result = await reviewService.listReviews(req.user.id, page, limit);
  res.status(200).json(new ApiResponse(200, result, 'Reviews fetched'));
});

const dashboardStats = asyncHandler(async (req, res) => {
  const stats = await reviewService.getDashboardStats(req.user.id);
  res.status(200).json(new ApiResponse(200, stats, 'Stats fetched'));
});

module.exports = { createReview, getReview, listReviews, dashboardStats };