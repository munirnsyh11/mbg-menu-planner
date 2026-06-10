// src/controllers/feedbackController.js
// Controller Feedback Module

import {
  createFeedbackService,
  getAllFeedbacksService,
  getMyFeedbackStatusService,
  updateFeedbackStatusService,
} from '../services/feedbackService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── POST /api/feedback ───────────────────────────────────────────
/**
 * Kirim feedback — school_officer only
 * Body: { menu_id, rating, comment? }
 */
export const createFeedback = asyncHandler(async (req, res) => {
  const feedback = await createFeedbackService(req.body, req.user.id);

  return ApiResponse.created(res, 'Feedback berhasil dikirim', feedback);
});

// ─── GET /api/feedback ────────────────────────────────────────────
/**
 * List semua feedback — admin only
 * Query: ?page=1&limit=10&status=new&menu_id=<id>&sort_order=desc
 */
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
/**
 * Status feedback milik school_officer yang sedang login
 * Query: ?page=1&limit=10
 */
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
/**
 * Update status feedback — admin only
 * Body: { status: 'reviewed' | 'resolved' }
 */
export const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const feedback = await updateFeedbackStatusService(
    req.params.id,
    req.body.status
  );

  return ApiResponse.ok(res, 'Status feedback berhasil diperbarui', feedback);
});
