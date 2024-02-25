import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware';
import * as reviewController from '../controllers/review.controller';

const router = express.Router();

router
  .get('/')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    reviewController.getReviews,
  );

router.route('/:id').get(reviewController.getReview);

export default router;
