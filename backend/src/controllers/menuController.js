// src/controllers/menuController.js
// Controller Menus — Web Admin + Mobile App

import {
  getAllMenusService,
  getMenuByIdService,
  getTodayMenuService,
  getMenuHistoryService,
  createMenuService,
  updateMenuService,
} from '../services/menuService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── GET /api/menus ───────────────────────────────────────────────
/**
 * List semua menu dengan pagination + filter
 * Query: ?page=1&limit=10&status=published&meets_akg=true&date_from=2026-01-01
 */
export const getAllMenus = asyncHandler(async (req, res) => {
  const { menus, pagination } = await getAllMenusService(req.query);

  return res.status(200).json({
    success: true,
    message: 'Data menu berhasil diambil',
    data: menus,
    pagination,
  });
});

// ─── GET /api/menus/today ─────────────────────────────────────────
/**
 * Menu hari ini (published)
 * Digunakan oleh Mobile App
 */
export const getTodayMenu = asyncHandler(async (req, res) => {
  const menu = await getTodayMenuService();

  return ApiResponse.ok(res, 'Menu hari ini berhasil diambil', menu);
});

// ─── GET /api/menus/history ───────────────────────────────────────
/**
 * Riwayat menu published (terbaru lebih dulu)
 * Digunakan oleh Mobile App
 * Query: ?page=1&limit=10
 */
export const getMenuHistory = asyncHandler(async (req, res) => {
  const { menus, pagination } = await getMenuHistoryService(req.query);

  return res.status(200).json({
    success: true,
    message: 'Riwayat menu berhasil diambil',
    data: menus,
    pagination,
  });
});

// ─── GET /api/menus/:id ───────────────────────────────────────────
/**
 * Detail satu menu beserta daftar bahan makanan
 * Digunakan oleh Web Admin dan Mobile App
 */
export const getMenuById = asyncHandler(async (req, res) => {
  const menu = await getMenuByIdService(req.params.id);

  return ApiResponse.ok(res, 'Detail menu berhasil diambil', menu);
});

// ─── POST /api/menus ──────────────────────────────────────────────
/**
 * Buat menu baru
 * Body: { menu_date, menu_name, status?, items: [{ food_id, portion_gram }] }
 * Total nutrisi dan meets_akg dihitung otomatis
 */
export const createMenu = asyncHandler(async (req, res) => {
  const menu = await createMenuService(req.body, req.user.id);

  return ApiResponse.created(res, 'Menu berhasil dibuat', menu);
});

// ─── PUT /api/menus/:id ───────────────────────────────────────────
/**
 * Update menu (partial — nama, status, atau seluruh items)
 * Jika items dikirim: nutrisi dihitung ulang otomatis
 * Body: { menu_name?, status?, items?: [{ food_id, portion_gram }] }
 */
export const updateMenu = asyncHandler(async (req, res) => {
  const menu = await updateMenuService(req.params.id, req.body);

  return ApiResponse.ok(res, 'Menu berhasil diperbarui', menu);
});
