import {
  runClusteringService,
  getActiveClusteringService,
  getClusteringHistoryService,
} from '../services/clusteringService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── POST /api/clustering/run ─────────────────────────────────────
export const runClustering = asyncHandler(async (req, res) => {
  const { k } = req.body;

  const result = await runClusteringService(k);

  return ApiResponse.created(
    res,
    `K-Means berhasil dijalankan. ${result.total_foods} makanan dikelompokkan ke ${result.k_value} cluster dalam ${result.iterations} iterasi.`,
    result
  );
});

// ─── GET /api/clustering/active ───────────────────────────────────
export const getActiveClustering = asyncHandler(async (req, res) => {
  const result = await getActiveClusteringService();

  return ApiResponse.ok(res, 'Hasil clustering aktif berhasil diambil', result);
});

// ─── GET /api/clustering/history ──────────────────────────────────
export const getClusteringHistory = asyncHandler(async (req, res) => {
  const { runs, pagination } = await getClusteringHistoryService(req.query);

  return res.status(200).json({
    success: true,
    message: 'Riwayat clustering berhasil diambil',
    data: runs,
    pagination,
  });
});
