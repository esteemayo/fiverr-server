import { StatusCodes } from 'http-status-codes';

import { CustomAPIError } from './CustomAPIError';

export class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
