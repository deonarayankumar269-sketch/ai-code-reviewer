const router = require('express').Router();
const authRoutes = require('./authRoutes');
const reviewRoutes = require('./reviewRoutes');

router.use('/auth', authRoutes);
router.use('/reviews', reviewRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;