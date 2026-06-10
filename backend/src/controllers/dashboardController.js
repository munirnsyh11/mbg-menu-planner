// src/controllers/dashboardController.js
// Controller Dashboard — admin only

import { getDashboardService } from '../services/dashboardService.js';
import { ApiResponse }         from '../utils/ApiResponse.js';
import asyncHandler            from '../utils/asyncHandler.js';

// ─── GET /api/dashboard ───────────────────────────────────────────
/**
 * Ringkasan statistik sistem untuk Admin Dapur MBG
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const data = await getDashboardService();

  return ApiResponse.ok(res, 'Data dashboard berhasil diambil', data);
});
