import { Router }        from 'express';
import { getDashboard }  from '../controllers/dashboardController.js';
import { protect }       from '../middleware/auth.js';
import { adminOnly }     from '../middleware/roleCheck.js';

const router = Router();
router.get('/', protect, adminOnly, getDashboard);

export default router;
