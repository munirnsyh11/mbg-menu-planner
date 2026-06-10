// src/controllers/foodController.js
// Controller Foods CRUD
// Thin controller — hanya handle HTTP, semua logika di foodService

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
/**
 * List semua makanan
 * Query params: page, limit, search, category, cluster_label, sort_by, sort_order
 * Middleware: protect → adminOnly → validateQuery(listFoodQuerySchema)
 */
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
/**
 * Detail satu makanan (include data nutrisi jika ada)
 * Middleware: protect → adminOnly
 */
export const getFoodById = asyncHandler(async (req, res) => {
  const food = await getFoodByIdService(req.params.id);

  return ApiResponse.ok(res, 'Detail makanan berhasil diambil', food);
});

// ─── POST /api/foods ───────────────────────────────────────────
/**
 * Buat data makanan baru
 * Body: { name, category, unit, description? }
 * Middleware: protect → adminOnly → validateBody(createFoodSchema)
 */
export const createFood = asyncHandler(async (req, res) => {
  const food = await createFoodService(req.body, req.user.id);

  return ApiResponse.created(res, 'Data makanan berhasil ditambahkan', food);
});

// ─── PUT /api/foods/:id ────────────────────────────────────────
/**
 * Update data makanan (partial update — hanya field yang dikirim)
 * Body: { name?, category?, unit?, description? }
 * Middleware: protect → adminOnly → validateBody(updateFoodSchema)
 */
export const updateFood = asyncHandler(async (req, res) => {
  const food = await updateFoodService(req.params.id, req.body);

  return ApiResponse.ok(res, 'Data makanan berhasil diperbarui', food);
});

// ─── DELETE /api/foods/:id ─────────────────────────────────────
/**
 * Hapus data makanan
 * Business rule: gagal jika makanan digunakan di menu aktif
 * Middleware: protect → adminOnly
 */
export const deleteFood = asyncHandler(async (req, res) => {
  await deleteFoodService(req.params.id);

  return ApiResponse.ok(res, 'Data makanan berhasil dihapus');
});
