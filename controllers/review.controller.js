import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Gig from '../models/gig.model.js';
import Review from './../models/review.model.js';

import { NotFoundError } from '../errors/notFound.js';
import { ForbiddenError } from '../errors/forbidden.js';

export const getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(StatusCodes.OK).json(reviews);
});

export const getReviewsOnGig = asyncHandler(async (req, res, next) => {
  const { id: gigId } = req.params;

  const reviews = await Review.find({ gig: gigId });

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
  const { id: userId, isSeller } = req.user;

  if (isSeller) {
    return next(new ForbiddenError("Sellers can't create a review!"));
  }

  if (!req.body.user) req.body.user = userId;

  const review = await Review.findOne({
    gig: req.body.gig,
    user: userId,
  });

  if (review) {
    return next(
      new ForbiddenError('You have already created a review for this gig'),
    );
  }

  const newReview = await Review.create({ ...req.body });
  await Gig.findByIdAndUpdate(req.body.gig, {
    $inc: {
      totalStars: req.body.star,
      starNumber: 1,
    },
  });

  res.status(StatusCodes.CREATED).json(newReview);
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

export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(
      new NotFoundError(`There is no review found with that ID → ${reviewId}`),
    );
  }

  if (String(review.user) === req.user.id || req.user.role === 'admin') {
    await Review.findByIdAndDelete(reviewId);

    res.status(StatusCodes.NO_CONTENT).end();
  }

  return next(new ForbiddenError('You can delete only your review!'));
});
