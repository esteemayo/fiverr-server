/* eslint-disable */

import { StatusCodes } from 'http-status-codes';

import { CustomAPIError } from './customAPIError.js';

export class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
