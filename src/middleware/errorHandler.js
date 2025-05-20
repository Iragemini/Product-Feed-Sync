import ApiError from '../errors/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let status = 500;
  const { message = 'Something went wrong...' } = err;

  if (err instanceof ApiError) {
    status = err.status;
  }

  res.status(status).json({ status, message });
};
