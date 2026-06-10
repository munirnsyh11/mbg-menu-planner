// src/routes/clusteringRoutes.js
// Route definitions untuk K-Means Clustering
// Base path: /api/clustering (di-mount dari routes/index.js)

import { Router } from 'express';
import {
  runClustering,
  getActiveClustering,
  getClusteringHistory,
} from '../controllers/clusteringController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleCheck.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  runKMeansSchema,
  clusteringHistoryQuerySchema,
} from '../validations/clusteringValidation.js';

const router = Router();

// Semua route clustering: autentikasi + role admin
router.use(protect, adminOnly);

/**
 * POST /api/clustering/run
 * Jalankan K-Means Clustering
 * Body: { k?: number }
 */
router.post('/run', validateBody(runKMeansSchema), runClustering);

/**
 * GET /api/clustering/active
 * Hasil clustering yang sedang aktif (run terakhir)
 */
router.get('/active', getActiveClustering);

/**
 * GET /api/clustering/history
 * Riwayat semua run K-Means
 * Query: ?page=1&limit=10
 */
router.get('/history', validateQuery(clusteringHistoryQuerySchema), getClusteringHistory);

export default router;
