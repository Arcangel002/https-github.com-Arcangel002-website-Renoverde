// Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Validation errors
  if (err.errors && Array.isArray(err.errors)) {
    return res.status(status).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.msg,
      })),
      statusCode: status,
    });
  }

  // Database errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(422).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
      statusCode: 422,
    });
  }

  res.status(status).json({
    success: false,
    message,
    statusCode: status,
  });
};

// Not Found Handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    statusCode: 404,
  });
};

// Async Error Wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Class for API Error
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
