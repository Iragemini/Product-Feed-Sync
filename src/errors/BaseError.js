/**
 * Create a new instance of BaseError
 */
class BaseError extends Error {
  constructor(name, status, message) {
    super(message);
    this.name = name;
    this.status = status;
    this.message = message;
  }
}

export default BaseError;
