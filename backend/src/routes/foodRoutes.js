// src/routes/foodRoutes.js
// Route definitions untuk Foods CRUD
// Base path: /api/foods (di-mount dari routes/index.js)

import { Router } from 'express';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/foodController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleCheck.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createFoodSchema,
  updateFoodSchema,
  listFoodQuerySchema,
} from '../validations/foodValidation.js';

const router = Router();

// Semua route foods memerlukan autentikasi + role admin
// Terapkan protect + adminOnly sebagai base middleware untuk seluruh router
router.use(protect, adminOnly);

// ─── Collection Routes ────────────────────────────────────────────

/**
 * GET  /api/foods
 * List makanan — pagination, search, filter category
 * Query: ?page=1&limit=10&search=ayam&category=protein&sort_by=name&sort_order=asc
 */
router.get('/', validateQuery(listFoodQuerySchema), getAllFoods);

/**
 * POST /api/foods
 * Tambah data makanan baru
 * Body: { name, category, unit, description? }
 */
router.post('/', validateBody(createFoodSchema), createFood);

// ─── Member Routes ────────────────────────────────────────────────

/**
 * GET /api/foods/:id
 * Detail satu makanan (include nutrisi jika ada)
 */
router.get('/:id', getFoodById);

/**
 * PUT /api/foods/:id
 * Update data makanan (partial update)
 * Body: { name?, category?, unit?, description? }
 */
router.put('/:id', validateBody(updateFoodSchema), updateFood);

/**
 * DELETE /api/foods/:id
 * Hapus data makanan
 * Business rule: gagal jika makanan sedang digunakan di menu
 */
router.delete('/:id', deleteFood);

export default router;
