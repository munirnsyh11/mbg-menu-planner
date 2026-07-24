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
router.get('/', validateQuery(listNutritionQuerySchema), getAllNutritions);
router.post('/', validateBody(createNutritionSchema), createNutrition);
router.get('/:foodId', getNutritionByFoodId);
router.put('/:foodId', validateBody(updateNutritionSchema), updateNutrition);

export default router;
