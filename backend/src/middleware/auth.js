// src/middleware/auth.js
// Middleware: Autentikasi JWT
// Membaca Bearer Token, verify, attach req.user

import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';

// ─── protect ─────────────────────────────────────────────────────
/**
 * Middleware autentikasi — wajib dipakai di setiap route yang butuh login.
 *
 * Flow:
 * 1. Baca header Authorization: Bearer <token>
 * 2. Verify token dengan JWT_SECRET
 * 3. Attach decoded payload ke req.user
 * 4. Return 401 jika token tidak ada / tidak valid / kadaluarsa
 *
 * req.user akan berisi: { id, role, email, iat, exp }
 */
export const protect = async (req, res, next) => {
  try {
    // Langkah 1: Baca token dari header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(
        new AppError('Akses ditolak. Token tidak ditemukan.', 401)
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(
        new AppError('Akses ditolak. Token tidak valid.', 401)
      );
    }

    // Langkah 2: Verify token
    // verifyAccessToken akan throw JsonWebTokenError / TokenExpiredError
    // yang ditangkap oleh global errorHandler di middleware/errorHandler.js
    const decoded = verifyAccessToken(token);

    // Langkah 3: Attach payload ke req.user
    // { id, role, email, iat, exp }
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    // JsonWebTokenError & TokenExpiredError diteruskan ke global errorHandler
    next(error);
  }
};
