import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import { NotFoundError } from '../errors/notFound.js';
import { ForbiddenError } from '../errors/forbidden.js';

import Gig from '../models/gig.model.js';

export const getGigs = asyncHandler(async (req, res, next) => {
  const q = req.query;

  const filters = {
    ...(q.user && { user: q.user }),
    ...(q.category && { category: q.category }),
    ...((q.max || q.min) && {
      price: { ...(q.min && { $gte: q.min }), ...(q.max && { $lte: q.max }) },
    }),
    ...(q.search && { title: { $regex: q.search, $options: 'i' } }),
  };

  const gigs = await Gig.find(filters).sort('-createdAt');

  res.status(StatusCodes.OK).json(gigs);
});

export const getGig = asyncHandler(async (req, res, next) => {
  const { id: gigId } = req.params;

  const gig = await Gig.findById(gigId);

  if (!gig) {
    return next(
      new NotFoundError(`There is no gig found with that ID → ${gigId}`),
    );
  }

  return res.status(StatusCodes.OK).json(gig);
});

export const createGig = asyncHandler(async (req, res, next) => {
  if (!req.user.isSeller) {
    return next(new ForbiddenError('Only sellers can create a gig!'));
  }

  if (!req.body.user) req.body.user = req.user.id;
  const gig = await Gig.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(gig);
});

export const deleteGig = asyncHandler(async (req, res, next) => {
  const { id: gigId } = req.params;

  const gig = await Gig.findById(gigId);

  if (!gig) {
    return next(
      new NotFoundError(`There is no gig found with that ID → ${gigId}`),
    );
  }

  if (gig.user.toString() === req.user.id || req.user.role === 'admin') {
    await Gig.findByIdAndDelete(gigId);

    res.status(StatusCodes.NO_CONTENT).end();
  }

  return next(new ForbiddenError('You can delete only your gig!'));
});
