import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Review from './../models/review.model.js';

export const getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(StatusCodes.OK).json(reviews);
});
