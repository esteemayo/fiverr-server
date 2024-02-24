import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Gig from '../models/gig.model.js';
import { NotFoundError } from '../errors/notFound.js';
import { ForbiddenError } from '../errors/forbidden.js';

export const createGig = asyncHandler(async (req, res, next) => {
  if (!req.user.isSeller) {
    return next(new ForbiddenError('Only sellers can create a gig!'));
  }

  if (!req.body.user) req.body.user = req.user.id;
  const gig = await Gig.create({ ...req.body });

  return res.status(StatusCodes.CREATED).json(gig);
});

export const deleteGig = asyncHandler(async (req, res, next) => {
  const { id: gigId } = req.params;

  const gig = await Gig.findById(gigId);

  if (!gig) {
    return next(
      new NotFoundError(`There is no gig found with that ID → ${gigId}`),
    );
  }

  if (gig.user.toString() !== req.user.id || req.user.role !== 'admin') {
    return next(new ForbiddenError('You can delete only your gig!'));
  }

  await Gig.findByIdAndDelete(gigId);

  return res.status(StatusCodes.NO_CONTENT).end();
});
