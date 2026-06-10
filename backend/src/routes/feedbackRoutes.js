// src/routes/feedbackRoutes.js
// Route definitions untuk Feedback Module
// Base path: /api/feedback (di-mount dari routes/index.js)
//
// Akses per role:
//   school_officer : POST /feedback, GET /feedback/status
//   admin          : GET /feedback, PATCH /feedback/:id/status

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

/**
 * POST /api/feedback
 * Kirim feedback untuk menu published
 * Body: { menu_id, rating, comment? }
 */
router.post(
  '/',
  schoolOfficerOnly,
  validateBody(createFeedbackSchema),
  createFeedback
);

/**
 * GET /api/feedback/status
 * Lihat status feedback milik sendiri
 * ⚠️  HARUS didefinisikan SEBELUM /:id agar tidak diinterpretasikan sebagai ObjectId
 * Query: ?page=1&limit=10
 */
router.get(
  '/status',
  schoolOfficerOnly,
  validateQuery(feedbackStatusQuerySchema),
  getMyFeedbackStatus
);

// ─── admin routes ─────────────────────────────────────────────────

/**
 * GET /api/feedback
 * List semua feedback + summary per status
 * Query: ?page=1&limit=10&status=new&menu_id=<id>
 */
router.get(
  '/',
  adminOnly,
  validateQuery(listFeedbackQuerySchema),
  getAllFeedbacks
);

/**
 * PATCH /api/feedback/:id/status
 * Update status feedback (new → reviewed → resolved)
 * Body: { status: 'reviewed' | 'resolved' }
 */
router.patch(
  '/:id/status',
  adminOnly,
  validateBody(updateFeedbackStatusSchema),
  updateFeedbackStatus
);

export default router;
