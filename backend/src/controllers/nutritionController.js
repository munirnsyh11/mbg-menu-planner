import {
  getAllNutritionsService,
  getNutritionByFoodIdService,
  createNutritionService,
  updateNutritionService,
} from '../services/nutritionService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── GET /api/nutritions ──────────────────────────────────────────
export const getAllNutritions = asyncHandler(async (req, res) => {
  const { nutritions, pagination } = await getAllNutritionsService(req.query);

  return res.status(200).json({
    success: true,
    message: 'Data nutrisi berhasil diambil',
    data: nutritions,
    pagination,
  });
});

// ─── GET /api/nutritions/:foodId ──────────────────────────────────
export const getNutritionByFoodId = asyncHandler(async (req, res) => {
  const nutrition = await getNutritionByFoodIdService(req.params.foodId);

  return ApiResponse.ok(res, 'Data nutrisi berhasil diambil', nutrition);
});

// ─── POST /api/nutritions ─────────────────────────────────────────
export const createNutrition = asyncHandler(async (req, res) => {
  const nutrition = await createNutritionService(req.body);

  return ApiResponse.created(res, 'Data nutrisi berhasil ditambahkan', nutrition);
});

// ─── PUT /api/nutritions/:foodId ──────────────────────────────────
export const updateNutrition = asyncHandler(async (req, res) => {
  const nutrition = await updateNutritionService(req.params.foodId, req.body);

  return ApiResponse.ok(res, 'Data nutrisi berhasil diperbarui', nutrition);
});
