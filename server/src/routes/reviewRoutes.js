const router = require('express').Router();
const {
  createReview, getReview, listReviews, dashboardStats,
} = require('../controllers/reviewController');
const { authenticate } = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { createReviewSchema, paginationSchema } = require('../validators/reviewValidator');
const { reviewLimiter } = require('../middleware/rateLimiter');

router.use(authenticate);
router.post('/', reviewLimiter, validate(createReviewSchema), createReview);
router.get('/', validate(paginationSchema), listReviews);
router.get('/stats/summary', dashboardStats);
router.get('/:id', getReview);

module.exports = router;