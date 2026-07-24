import { AppError } from './errorHandler.js';
import { ROLES } from '../utils/constants.js';

// ─── restrictTo ───────────────────────────────────────────────────
/**
 * Batasi akses berdasarkan role.
 * Gunakan setelah protect middleware.
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

export const adminOnly = restrictTo(ROLES.ADMIN);

// ─── Shorthand: schoolOfficerOnly ────────────────────────────────

export const schoolOfficerOnly = restrictTo(ROLES.SCHOOL_OFFICER);
