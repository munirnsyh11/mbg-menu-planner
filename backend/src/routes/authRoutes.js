// src/routes/authRoutes.js
// Route definitions untuk Authentication Module
// Base path: /api/auth (di-mount dari routes/index.js)

import { Router } from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema } from '../validations/authValidation.js';

const router = Router();

// ─── Public Routes (tidak butuh token) ───────────────────────────

/**
 * POST /api/auth/login
 * Login Admin / School Officer
 * Body: { email, password }
 *
 * Middleware pipeline:
 *   validateBody(loginSchema) → login controller
 */
router.post('/login', validateBody(loginSchema), login);

// ─── Protected Routes (butuh token) ──────────────────────────────

/**
 * GET /api/auth/me
 * Ambil data user yang sedang login
 * Header: Authorization: Bearer <token>
 *
 * Middleware pipeline:
 *   protect → getMe controller
 */
router.get('/me', protect, getMe);

/**
 * POST /api/auth/logout
 * Logout — konfirmasi sisi server (stateless JWT)
 * Header: Authorization: Bearer <token>
 *
 * Middleware pipeline:
 *   protect → logout controller
 */
router.post('/logout', protect, logout);

export default router;
