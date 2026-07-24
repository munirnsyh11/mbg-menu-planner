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

router.use(protect, adminOnly);

// ─── Collection Routes ────────────────────────────────────────────
router.get('/', validateQuery(listFoodQuerySchema), getAllFoods);
router.post('/', validateBody(createFoodSchema), createFood);
router.get('/:id', getFoodById);
router.put('/:id', validateBody(updateFoodSchema), updateFood);
router.delete('/:id', deleteFood);

export default router;
