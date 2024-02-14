import { StatusCodes } from 'http-status-codes';

import { CustomAPIError } from './CustomAPIError';

export class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
