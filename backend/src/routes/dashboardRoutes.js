// src/routes/dashboardRoutes.js
// Route definitions untuk Dashboard
// Base path: /api/dashboard (di-mount dari routes/index.js)

import { Router }        from 'express';
import { getDashboard }  from '../controllers/dashboardController.js';
import { protect }       from '../middleware/auth.js';
import { adminOnly }     from '../middleware/roleCheck.js';

const router = Router();

/**
 * GET /api/dashboard
 * Ringkasan statistik sistem — admin only
 */
router.get('/', protect, adminOnly, getDashboard);

export default router;
