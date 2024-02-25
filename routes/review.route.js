import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware';
import * as reviewController from '../controllers/review.controller';

const router = express.Router();

router
  .route('/')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    reviewController.getReviews,
  )
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('user'),
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authMiddleware.protect, reviewController.updateReview)
  .delete(authMiddleware.protect, reviewController.deleteReview);

export default router;
