// src/controllers/nutritionController.js
// Controller Nutritions CRUD

import {
  getAllNutritionsService,
  getNutritionByFoodIdService,
  createNutritionService,
  updateNutritionService,
} from '../services/nutritionService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── GET /api/nutritions ──────────────────────────────────────────
/**
 * List semua data nutrisi dengan pagination
 * Query: ?page=1&limit=10&min_calories=50&max_calories=300&sort_by=calories&sort_order=asc
 */
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
/**
 * Detail nutrisi satu makanan — diakses via food_id, bukan nutrition _id
 */
export const getNutritionByFoodId = asyncHandler(async (req, res) => {
  const nutrition = await getNutritionByFoodIdService(req.params.foodId);

  return ApiResponse.ok(res, 'Data nutrisi berhasil diambil', nutrition);
});

// ─── POST /api/nutritions ─────────────────────────────────────────
/**
 * Tambah data nutrisi untuk satu makanan
 * Body: { food_id, calories, protein, fat, carbohydrate, fiber? }
 */
export const createNutrition = asyncHandler(async (req, res) => {
  const nutrition = await createNutritionService(req.body);

  return ApiResponse.created(res, 'Data nutrisi berhasil ditambahkan', nutrition);
});

// ─── PUT /api/nutritions/:foodId ──────────────────────────────────
/**
 * Update data nutrisi satu makanan (partial update)
 * Body: { calories?, protein?, fat?, carbohydrate?, fiber? }
 */
export const updateNutrition = asyncHandler(async (req, res) => {
  const nutrition = await updateNutritionService(req.params.foodId, req.body);

  return ApiResponse.ok(res, 'Data nutrisi berhasil diperbarui', nutrition);
});
