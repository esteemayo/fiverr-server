/* eslint-disable */

import { StatusCodes } from 'http-status-codes';

import { CustomAPIError } from './customAPIError.js';

export class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
