import { StatusCodes } from 'http-status-codes';

import { CustomAPIError } from './CustomAPIError';

export class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
