const Review = require('../models/Review');

class ReviewRepository {
  async create(data) {
    return Review.create(data);
  }

  async findByIdForUser(id, userId) {
    return Review.findOne({ _id: id, user: userId }).lean();
  }

  async listByUser(userId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Review.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-code') // exclude heavy field from list view
        .lean(),
      Review.countDocuments({ user: userId }),
    ]);
    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async updateStatus(id, status, patch = {}) {
    return Review.findByIdAndUpdate(id, { status, ...patch }, { new: true });
  }

  // Aggregation: severity distribution for a user's dashboard, done in a
  // single pipeline so it stays O(N) over matched documents with no
  // client-side post-processing loops.
  async severityBreakdown(userId) {
    return Review.aggregate([
      { $match: { user: userId, status: 'completed' } },
      { $unwind: '$findings' },
      {
        $group: {
          _id: '$findings.severity',
          count: { $sum: 1 },
        },
      },
      { $project: { severity: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);
  }
}

module.exports = new ReviewRepository();