import User from '../models/User.js';
import { signAccessToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';

// ─── Login ────────────────────────────────────────────────────────
/**
 * Proses login:
 * 1. Cari user berdasarkan email
 * 2. Cek is_active
 * 3. Compare password dengan bcrypt
 * 4. Generate JWT
 * 5. Return user (tanpa password) + token
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ user: object, token: string }}
 */
export const loginService = async (email, password) => {
  // Langkah 1: Cari user berdasarkan email
  // .select('+password') karena field password pakai select: false di schema
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Email atau password salah', 401);
  }

  // Langkah 2: Cek status akun
  if (!user.is_active) {
    throw new AppError('Akun Anda telah dinonaktifkan. Hubungi administrator.', 403);
  }

  // Langkah 3: Compare password dengan bcrypt
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError('Email atau password salah', 401);
  }

  // Langkah 4: Generate JWT
  // Payload minimal — jangan simpan data sensitif di token
  const tokenPayload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  const token = signAccessToken(tokenPayload);

  // Langkah 5: Return user aman (tanpa password) + token
  const safeUser = user.toSafeObject();

  return { user: safeUser, token };
};

// ─── Get Current User ─────────────────────────────────────────────
/**
 * Ambil data user yang sedang login berdasarkan ID dari JWT payload
 *
 * @param {string} userId - dari req.user.id (hasil decode token)
 * @returns {object} user document
 */
export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User tidak ditemukan', 404);
  }

  if (!user.is_active) {
    throw new AppError('Akun Anda telah dinonaktifkan.', 403);
  }

  return user.toSafeObject();
};

// ─── Verify Admin Role ────────────────────────────────────────────
/**
 * Cek apakah user memiliki role admin
 * Digunakan oleh roleMiddleware
 *
 * @param {string} role
 * @returns {boolean}
 */
export const isAdmin = (role) => role === ROLES.ADMIN;
