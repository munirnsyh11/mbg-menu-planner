// src/routes/menuRoutes.js
// Route definitions untuk Menus
// Base path: /api/menus (di-mount dari routes/index.js)
//
// Akses per role:
//   - Web Admin (admin)      : semua endpoint
//   - Mobile App (school_officer) : GET /today, GET /history, GET /:id

import { Router } from 'express';
import {
  getAllMenus,
  getTodayMenu,
  getMenuHistory,
  getMenuById,
  createMenu,
  updateMenu,
} from '../controllers/menuController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleCheck.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createMenuSchema,
  updateMenuSchema,
  listMenuQuerySchema,
} from '../validations/menuValidation.js';

const router = Router();

// Semua route menus memerlukan autentikasi
router.use(protect);

// ─── Public (semua role terautentikasi) ──────────────────────────

/**
 * GET /api/menus/today
 * Menu hari ini — mobile app + web admin
 * ⚠️  HARUS didefinisikan SEBELUM /:id agar tidak di-intercept sebagai ObjectId
 */
router.get('/today', getTodayMenu);

/**
 * GET /api/menus/history
 * Riwayat menu published — mobile app + web admin
 * ⚠️  HARUS didefinisikan SEBELUM /:id
 */
router.get('/history', validateQuery(listMenuQuerySchema), getMenuHistory);

// ─── Admin only ────────────────────────────────────────────────────

/**
 * GET /api/menus
 * List semua menu dengan filter lengkap
 */
router.get('/', adminOnly, validateQuery(listMenuQuerySchema), getAllMenus);

/**
 * POST /api/menus
 * Buat menu baru
 */
router.post('/', adminOnly, validateBody(createMenuSchema), createMenu);

/**
 * GET /api/menus/:id
 * Detail menu — tersedia untuk semua role (admin & school_officer)
 */
router.get('/:id', getMenuById);

/**
 * PUT /api/menus/:id
 * Update menu
 */
router.put('/:id', adminOnly, validateBody(updateMenuSchema), updateMenu);

export default router;
