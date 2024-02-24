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
