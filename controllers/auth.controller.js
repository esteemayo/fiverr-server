import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
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

export const logout = async (req, res, next) => {
  res
    .clearCookie('accessToken', {
      sameSite: 'none',
      secure: true,
    })
    .status(StatusCodes.OK)
    .json('User has been logged out');
};

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
    <div style='background: #f9f9f9; color: #555; padding: 50px; text-align: left;'>
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

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new BadRequestError('Token is invalid or has expired'));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();

  return createSendToken(user, StatusCodes.OK, req, res);
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { password, confirmPassword, currentPassword } = req.body;

  const user = await User.findById(userId).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new UnauthenticatedError('Your current password is incorrect'));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();

  return createSendToken(user, StatusCodes.OK, req, res);
});
