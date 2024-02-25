import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Review from './../models/review.model.js';
import { NotFoundError } from '../errors/notFound.js';

export const getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(StatusCodes.OK).json(reviews);
});

export const getReview = asyncHandler(async (req, res, next) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(
      new NotFoundError(`There is no review found with that ID → ${reviewId}`),
    );
  }

  res.status(StatusCodes.OK).json(review);
});

export const createReview = asyncHandler(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.gig) req.body.gig = req.params.gigId;

  const review = await Review.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(review);
});
