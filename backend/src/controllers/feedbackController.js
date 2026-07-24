import {
  createFeedbackService,
  getAllFeedbacksService,
  getMyFeedbackStatusService,
  updateFeedbackStatusService,
} from '../services/feedbackService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── POST /api/feedback ───────────────────────────────────────────
export const createFeedback = asyncHandler(async (req, res) => {
  const feedback = await createFeedbackService(req.body, req.user.id);

  return ApiResponse.created(res, 'Feedback berhasil dikirim', feedback);
});

// ─── GET /api/feedback ────────────────────────────────────────────
export const getAllFeedbacks = asyncHandler(async (req, res) => {
  const { feedbacks, summary, pagination } = await getAllFeedbacksService(req.query);

  return res.status(200).json({
    success: true,
    message: 'Data feedback berhasil diambil',
    data: feedbacks,
    summary,
    pagination,
  });
});

// ─── GET /api/feedback/status ─────────────────────────────────────
export const getMyFeedbackStatus = asyncHandler(async (req, res) => {
  const { feedbacks, pagination } = await getMyFeedbackStatusService(
    req.user.id,
    req.query
  );

  return res.status(200).json({
    success: true,
    message: 'Status feedback berhasil diambil',
    data: feedbacks,
    pagination,
  });
});

// ─── PATCH /api/feedback/:id/status ──────────────────────────────
export const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const feedback = await updateFeedbackStatusService(
    req.params.id,
    req.body.status
  );

  return ApiResponse.ok(res, 'Status feedback berhasil diperbarui', feedback);
});
