import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';

// ─── protect ─────────────────────────────────────────────────────
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
    const decoded = verifyAccessToken(token);

    // Langkah 3: Attach payload ke req.user
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
