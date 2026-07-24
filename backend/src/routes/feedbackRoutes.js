import { Router } from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  getMyFeedbackStatus,
  updateFeedbackStatus,
} from '../controllers/feedbackController.js';
import { protect }         from '../middleware/auth.js';
import { adminOnly, schoolOfficerOnly } from '../middleware/roleCheck.js';
import { validateBody, validateQuery }  from '../middleware/validate.js';
import {
  createFeedbackSchema,
  updateFeedbackStatusSchema,
  listFeedbackQuerySchema,
  feedbackStatusQuerySchema,
} from '../validations/feedbackValidation.js';

const router = Router();

// Semua route feedback memerlukan autentikasi
router.use(protect);

// ─── school_officer routes ────────────────────────────────────────
router.post(
  '/',
  schoolOfficerOnly,
  validateBody(createFeedbackSchema),
  createFeedback
);

router.get(
  '/status',
  schoolOfficerOnly,
  validateQuery(feedbackStatusQuerySchema),
  getMyFeedbackStatus
);

// ─── admin routes ─────────────────────────────────────────────────
router.get(
  '/',
  adminOnly,
  validateQuery(listFeedbackQuerySchema),
  getAllFeedbacks
);

router.patch(
  '/:id/status',
  adminOnly,
  validateBody(updateFeedbackStatusSchema),
  updateFeedbackStatus
);

export default router;
