import {
  getAllFoodsService,
  getFoodByIdService,
  createFoodService,
  updateFoodService,
  deleteFoodService,
} from '../services/foodService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── GET /api/foods ────────────────────────────────────────────
export const getAllFoods = asyncHandler(async (req, res) => {
  const { foods, pagination } = await getAllFoodsService(req.query);

  return res.status(200).json({
    success: true,
    message: 'Data makanan berhasil diambil',
    data: foods,
    pagination,
  });
});

// ─── GET /api/foods/:id ────────────────────────────────────────
export const getFoodById = asyncHandler(async (req, res) => {
  const food = await getFoodByIdService(req.params.id);

  return ApiResponse.ok(res, 'Detail makanan berhasil diambil', food);
});

// ─── POST /api/foods ───────────────────────────────────────────
export const createFood = asyncHandler(async (req, res) => {
  const food = await createFoodService(req.body, req.user.id);

  return ApiResponse.created(res, 'Data makanan berhasil ditambahkan', food);
});

// ─── PUT /api/foods/:id ────────────────────────────────────────
export const updateFood = asyncHandler(async (req, res) => {
  const food = await updateFoodService(req.params.id, req.body);

  return ApiResponse.ok(res, 'Data makanan berhasil diperbarui', food);
});

// ─── DELETE /api/foods/:id ─────────────────────────────────────
export const deleteFood = asyncHandler(async (req, res) => {
  await deleteFoodService(req.params.id);

  return ApiResponse.ok(res, 'Data makanan berhasil dihapus');
});
