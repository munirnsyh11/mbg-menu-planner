// src/middleware/roleCheck.js
// Middleware: Otorisasi berbasis role
// Selalu digunakan SETELAH protect middleware

import { AppError } from './errorHandler.js';
import { ROLES } from '../utils/constants.js';

// ─── restrictTo ───────────────────────────────────────────────────
/**
 * Batasi akses berdasarkan role.
 * Gunakan setelah protect middleware.
 *
 * Contoh penggunaan:
 *   router.get('/foods', protect, restrictTo(ROLES.ADMIN), foodController.getAll)
 *
 * @param {...string} roles - Role yang diizinkan mengakses route
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Autentikasi diperlukan.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'Anda tidak memiliki izin untuk mengakses resource ini.',
          403
        )
      );
    }

    next();
  };
};

// ─── Shorthand: adminOnly ─────────────────────────────────────────
/**
 * Shorthand middleware — hanya admin yang boleh akses.
 * Setara dengan restrictTo(ROLES.ADMIN)
 *
 * Contoh:
 *   router.post('/foods', protect, adminOnly, foodController.create)
 */
export const adminOnly = restrictTo(ROLES.ADMIN);

// ─── Shorthand: schoolOfficerOnly ────────────────────────────────
/**
 * Shorthand middleware — hanya school_officer yang boleh akses.
 * Digunakan untuk endpoint Mobile App (STEP berikutnya)
 */
export const schoolOfficerOnly = restrictTo(ROLES.SCHOOL_OFFICER);
