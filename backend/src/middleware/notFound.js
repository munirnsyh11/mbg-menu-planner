// src/middleware/notFound.js
// Handler untuk route yang tidak ditemukan

import { AppError } from './errorHandler.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Route tidak ditemukan: ${req.originalUrl}`, 404));
};
