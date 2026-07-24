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
router.post('/run', validateBody(runKMeansSchema), runClustering);
router.get('/active', getActiveClustering);
router.get('/history', validateQuery(clusteringHistoryQuerySchema), getClusteringHistory);

export default router;
