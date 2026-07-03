// src/routes/menuRoutes.js
// UPDATED — tambahkan DELETE /api/menus/:id
// Base path: /api/menus (di-mount dari routes/index.js)

import { Router } from 'express';
import {
  getAllMenus,
  getTodayMenu,
  getMenuHistory,
  getMenuById,
  createMenu,
  updateMenu,
} from '../controllers/menuController.js';
// ← TAMBAHAN: import deleteMenu controller
import { deleteMenu } from '../controllers/deleteMenuController.js';

import { protect }                 from '../middleware/auth.js';
import { adminOnly }               from '../middleware/roleCheck.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createMenuSchema,
  updateMenuSchema,
  listMenuQuerySchema,
} from '../validations/menuValidation.js';

const router = Router();

// Semua route menus memerlukan autentikasi
router.use(protect);

// ─── Static routes — HARUS sebelum /:id ──────────────────────────

/**
 * GET /api/menus/today
 * Menu hari ini — mobile app + web admin
 */
router.get('/today', getTodayMenu);

/**
 * GET /api/menus/history
 * Riwayat menu published — mobile app + web admin
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
 * Detail menu — tersedia untuk semua role
 */
router.get('/:id', getMenuById);

/**
 * PUT /api/menus/:id
 * Update menu
 */
router.put('/:id', adminOnly, validateBody(updateMenuSchema), updateMenu);

/**
 * DELETE /api/menus/:id     ← BARU
 * Hapus menu dan seluruh MenuDetail yang berelasi
 */
router.delete('/:id', adminOnly, deleteMenu);

export default router;
