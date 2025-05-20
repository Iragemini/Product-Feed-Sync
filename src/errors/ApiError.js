import BaseError from './BaseError.js';
import { INTERNAL_SERVER_ERROR } from '../constants.js';

/**
 * Create a new instance of ApiError
 */
class ApiError extends BaseError {
  constructor(message, status = INTERNAL_SERVER_ERROR) {
    super('ApiError', status, message);
  }
}

export default ApiError;
