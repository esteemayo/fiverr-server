import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import { CustomAPIError } from '../errors/customAPIError.js';
import { NotFoundError } from '../errors/notFound.js';
import { UnauthenticatedError } from './../errors/unauthenticated.js';
import { BadRequestError } from './../errors/badRequest.js';

import { sendEmail } from './../utils/email.js';
import { createSendToken } from '../utils/createSendToken.js';

import User from '../models/user.model.js';

export const register = asyncHandler(async (req, res, next) => {
  const user = await User.create({ ...req.body });

  if (user) {
    return createSendToken(user, StatusCodes.CREATED, req, res);
  }
});

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new BadRequestError('Please provide username and password'));
  }

  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new UnauthenticatedError('Incorrect username or password'));
  }

  return createSendToken(user, StatusCodes.OK, req, res);
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new BadRequestError('Please enter your email address'));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new NotFoundError('There is no user with the email address'));
  }

  const resetToken = user.changedPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

  const message = `
    Hi ${user.username},
    There was a request to change your password!
    If you did not make this request then please ignore this email.
    Otherwise, please click this link to change your password: ${resetURL}
  `;

  const html = `
    <div style='background: #f7f7f7; color: #333; padding: 50px; text-align: left;'>
      <h3>Hi ${user.name},</h3>
      <p>There was a request to change your password!</p>
      <p>If you did not make this request then please ignore this email.</p>
      <p>Otherwise, please click this link to change your password: 
        <a href='${resetURL}'>Reset my password →</a>
      </p>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message,
      html,
    });

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Token sent to your email address',
    });
  } catch (err) {
    return next(
      new CustomAPIError(
        'There was an error sending the email. Try again later',
      ),
    );
  }
});
