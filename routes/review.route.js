import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as reviewController from '../controllers/review.controller.js';

const router = express.Router();

router.get('/gigs/:gigId', reviewController.getReviewsOnGig);

router.use(authMiddleware.protect);

router
  .route('/')
  .get(authMiddleware.restrictTo('admin'), reviewController.getReviews)
  .post(authMiddleware.restrictTo('user'), reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
