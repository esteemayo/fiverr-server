import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import { ForbiddenError } from './../errors/forbidden.js';
import { UnauthenticatedError } from '../errors/unauthenticated.js';

import User from '../models/user.model.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ').pop();
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(
      new UnauthenticatedError(
        'You are not logged in! Please log in to get access',
      ),
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );

  const currentUser = await User.findById(decoded.id).select('+password');
  if (!currentUser) {
    return next(
      new UnauthenticatedError(
        'The user belonging to this token does no longer exist',
      ),
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new UnauthenticatedError(
        'User recently changed password! Please log in again',
      ),
    );
  }

  req.user = currentUser;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError('You do not have permission to perform this action'),
      );
    }

    next();
  };
