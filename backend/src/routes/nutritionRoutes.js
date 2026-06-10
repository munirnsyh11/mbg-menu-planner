// src/routes/nutritionRoutes.js
// Route definitions untuk Nutritions CRUD
// Base path: /api/nutritions (di-mount dari routes/index.js)

import { Router } from 'express';
import {
  getAllNutritions,
  getNutritionByFoodId,
  createNutrition,
  updateNutrition,
} from '../controllers/nutritionController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleCheck.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createNutritionSchema,
  updateNutritionSchema,
  listNutritionQuerySchema,
} from '../validations/nutritionValidation.js';

const router = Router();

// Semua route nutritions: autentikasi + role admin
router.use(protect, adminOnly);

// ─── Collection Routes ────────────────────────────────────────────

/**
 * GET  /api/nutritions
 * List semua data nutrisi dengan pagination dan join food
 * Query: ?page=1&limit=10&min_calories=50&max_calories=300
 */
router.get('/', validateQuery(listNutritionQuerySchema), getAllNutritions);

/**
 * POST /api/nutritions
 * Tambah data nutrisi baru untuk satu makanan
 * Body: { food_id, calories, protein, fat, carbohydrate, fiber? }
 */
router.post('/', validateBody(createNutritionSchema), createNutrition);

// ─── Member Routes — diakses via :foodId, bukan nutrition _id ─────

/**
 * GET /api/nutritions/:foodId
 * Detail nutrisi satu makanan
 */
router.get('/:foodId', getNutritionByFoodId);

/**
 * PUT /api/nutritions/:foodId
 * Update nutrisi satu makanan (partial update)
 * Body: { calories?, protein?, fat?, carbohydrate?, fiber? }
 */
router.put('/:foodId', validateBody(updateNutritionSchema), updateNutrition);

export default router;
