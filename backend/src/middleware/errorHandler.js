import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handler: Mongoose CastError (invalid ObjectId)
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handler: Mongoose duplicate key
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const message = `Data dengan ${field} tersebut sudah ada. Gunakan nilai yang berbeda.`;
  return new AppError(message, 409);
};

// Handler: Mongoose ValidationError
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Data tidak valid: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handler: JWT errors
const handleJWTError = () =>
  new AppError('Token tidak valid. Silakan login kembali.', 401);

const handleJWTExpiredError = () =>
  new AppError('Token sudah kadaluarsa. Silakan login kembali.', 401);

// Response format untuk development (detail error)
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// Response format untuk production (pesan aman)
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    logger.error('Unexpected error:', err);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
    });
  }
};

// Main error handler middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.statusCode < 500 ? 'fail' : 'error';

  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl}`);

  let error = { ...err, message: err.message };

  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (env.IS_DEVELOPMENT) {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};
