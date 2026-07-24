import { loginService, getCurrentUserService } from '../services/authService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── POST /api/auth/login ──────────────────────────────────────

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await loginService(email, password);

  return ApiResponse.ok(res, 'Login berhasil', { user, token });
});

// ─── GET /api/auth/me ──────────────────────────────────────────

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.user.id);

  return ApiResponse.ok(res, 'Data pengguna berhasil diambil', { user });
});

// ─── POST /api/auth/logout ─────────────────────────────────────

export const logout = asyncHandler(async (req, res) => {
  return ApiResponse.ok(
    res,
    'Logout berhasil. Silakan hapus token di sisi client.'
  );
});
