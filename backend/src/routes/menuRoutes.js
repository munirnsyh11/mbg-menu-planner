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
router.get('/today', getTodayMenu);
router.get('/history', validateQuery(listMenuQuerySchema), getMenuHistory);
router.get('/', adminOnly, validateQuery(listMenuQuerySchema), getAllMenus);
router.post('/', adminOnly, validateBody(createMenuSchema), createMenu);
router.get('/:id', getMenuById);
router.put('/:id', adminOnly, validateBody(updateMenuSchema), updateMenu);
router.delete('/:id', adminOnly, deleteMenu);

export default router;
