// src/middleware/validate.js
// Middleware validasi request menggunakan Joi schema

import { AppError } from './errorHandler.js';

/**
 * Validasi request body dengan Joi schema.
 * Jika gagal → return 400 dengan detail field yang bermasalah.
 * Jika lulus → req.body berisi nilai yang sudah di-sanitize (stripUnknown).
 *
 * @param {import('joi').Schema} schema - Joi object schema
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,   // Kumpulkan semua error sekaligus
      stripUnknown: true,  // Buang field yang tidak ada di schema
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, ''),
      }));

      // Gunakan pesan field pertama sebagai pesan utama
      const mainMessage = details[0]?.message || 'Validasi gagal';

      const err = new AppError(mainMessage, 400);
      err.errors = details;
      return next(err);
    }

    req.body = value;
    next();
  };
};

/**
 * Validasi query parameters dengan Joi schema.
 *
 * @param {import('joi').Schema} schema - Joi object schema
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, ''),
      }));

      const mainMessage = details[0]?.message || 'Query parameter tidak valid';
      const err = new AppError(mainMessage, 400);
      err.errors = details;
      return next(err);
    }

    req.query = value;
    next();
  };
};
