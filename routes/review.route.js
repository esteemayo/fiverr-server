import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as reviewController from '../controllers/review.controller.js';

const router = express.Router();

router.get('/gigs/:gigId', reviewController.getReviewsOnGig);

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
  .get(authMiddleware.protect, reviewController.getReview)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('user'),
    reviewController.updateReview,
  )
  .delete(authMiddleware.protect, reviewController.deleteReview);

export default router;
