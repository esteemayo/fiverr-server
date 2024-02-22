import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import asyncHandler from 'express-async-handler';

import User from '../models/user.model.js';
import { BadRequestError } from '../errors/badRequest.js';
import { createSendToken } from '../utils/createSendToken.js';
import { NotFoundError } from '../errors/notFound.js';

export const getUsers = asyncHandler(async (req, res, next) => {
  const query = req.query.new;

  const users = query
    ? await User.find().sort('-createdAt').limit(5)
    : await User.find().sort('-_id');

  return res.status(StatusCodes.OK).json(users);
});

export const getUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(
      new NotFoundError(`There is no user found with that ID → ${userId}`),
    );
  }

  return res.status(StatusCodes.OK).json(user);
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidations: true,
    },
  );

  if (!user) {
    return next(
      new NotFoundError(`There is no user found with that ID → ${userId}`),
    );
  }

  return res.status(StatusCodes.OK).json(user);
});

export const updateMe = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return next(
      new BadRequestError(
        `This route is not for password updates. Please use ${req.protocol}://${req.get('host')}/api/v1/auth/update-my-password`,
      ),
    );
  }

  const filterBody = _.pick(req.body, [
    'username',
    'email',
    'image',
    'country',
    'phone',
    'desc',
  ]);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { ...filterBody } },
    {
      new: true,
      runValidators: true,
    },
  );

  createSendToken(updatedUser, StatusCodes.OK, req, res);
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return next(
      new NotFoundError(`There is no user found with that ID → ${userId}`),
    );
  }

  return res.status(StatusCodes.NO_CONTENT).end();
});

export const deleteMe = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  await User.findByIdAndUpdate(userId, { $set: { isActive: false } });

  return res.status(StatusCodes.NO_CONTENT).end();
});

export const createUser = (req, res, next) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    message: `This route is not defined! Please use ${req.protocol}://${req.get(
      'host',
    )}/api/v1/auth/register`,
  });
};
