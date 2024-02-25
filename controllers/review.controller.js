import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import { NotFoundError } from '../errors/notFound.js';
import { ForbiddenError } from '../errors/forbidden.js';

import Review from './../models/review.model.js';

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

export const updateReview = asyncHandler(async (req, res, next) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(
      new NotFoundError(`There is no review found with that ID → ${reviewId}`),
    );
  }

  if (String(review.user) === req.user.id || req.user.role === 'admin') {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(StatusCodes.OK).json(updatedReview);
  }

  return next(new ForbiddenError('You can update only your review!'));
});
