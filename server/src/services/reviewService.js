const reviewRepository = require('../repositories/reviewRepository');
const aiService = require('../services/aiService');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

async function createReview(userId, { language, code }) {
  const codeSnippetHash = aiService.hashCode(code);

  const review = await reviewRepository.create({
    user: userId,
    language,
    code,
    codeSnippetHash,
    status: 'pending',
  });

  try {
    const analysis = await aiService.analyzeCode(language, code);
    const updated = await reviewRepository.updateStatus(review._id, 'completed', {
      findings: analysis.findings,
      timeComplexity: analysis.timeComplexity,
      spaceComplexity: analysis.spaceComplexity,
      summary: analysis.summary,
      overallScore: analysis.overallScore,
    });
    return updated;
  } catch (err) {
    logger.error(`Review analysis failed for ${review._id}: ${err.message}`);
    await reviewRepository.updateStatus(review._id, 'failed', {
      errorMessage: 'Analysis could not be completed. Please try again.',
    });
    // Surface a clean error, but the review record persists for audit/history
    throw ApiError.internal('Code analysis failed. Please try submitting again.');
  }
}

async function getReview(id, userId) {
  const review = await reviewRepository.findByIdForUser(id, userId);
  if (!review) {
    throw ApiError.notFound('Review not found');
  }
  return review;
}

async function listReviews(userId, page, limit) {
  return reviewRepository.listByUser(userId, { page, limit });
}

async function getDashboardStats(userId) {
  return reviewRepository.severityBreakdown(userId);
}

module.exports = { createReview, getReview, listReviews, getDashboardStats };