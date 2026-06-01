/**
 * Error handler middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);
  
  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds the maximum allowed limit';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    } else {
      message = err.message;
    }
  } else if (err.code === 'ENOENT') {
    statusCode = 404;
    message = 'File not found';
  }
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

/**
 * Not found handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found'
    }
  });
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler
};

// Made with Bob
