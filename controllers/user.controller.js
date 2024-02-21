import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import asyncHandler from 'express-async-handler';

import User from '../models/user.model.js';
import { BadRequestError } from '../errors/badRequest.js';
import { createSendToken } from '../utils/createSendToken.js';

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
