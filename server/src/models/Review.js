const mongoose = require('mongoose');

const findingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['security', 'bug', 'performance', 'style', 'complexity'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'info'],
      required: true,
    },
    line: { type: Number, default: null },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    suggestion: { type: String, maxlength: 2000, default: '' },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 30,
    },
    codeSnippetHash: {
      // store a hash instead of raw code twice — dedup + integrity check
      type: String,
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      maxlength: 50000, // ~ bound the payload to prevent abuse
    },
    findings: {
      type: [findingSchema],
      default: [],
    },
    timeComplexity: { type: String, default: 'N/A', maxlength: 100 },
    spaceComplexity: { type: String, default: 'N/A', maxlength: 100 },
    summary: { type: String, maxlength: 3000, default: '' },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    errorMessage: { type: String, default: null },
  },
  { timestamps: true }
);

// Compound index: fast per-user history queries sorted by recency
reviewSchema.index({ user: 1, createdAt: -1 });
// Analytics: findings by severity/type aggregation performance
reviewSchema.index({ 'findings.severity': 1 });
reviewSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);