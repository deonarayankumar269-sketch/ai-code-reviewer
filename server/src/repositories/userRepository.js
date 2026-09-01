const User = require('../models/User');

class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async findByEmail(email, withPassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (withPassword) query.select('+password');
    return query.exec();
  }

  async findById(id, withRefreshHash = false) {
    const query = User.findById(id);
    if (withRefreshHash) query.select('+refreshTokenHash');
    return query.exec();
  }

  async setRefreshTokenHash(userId, hash) {
    return User.findByIdAndUpdate(
      userId,
      { refreshTokenHash: hash },
      { new: true }
    ).select('+refreshTokenHash');
  }
}

module.exports = new UserRepository();