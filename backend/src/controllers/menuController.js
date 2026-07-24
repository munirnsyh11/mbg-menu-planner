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
export const getTodayMenu = asyncHandler(async (req, res) => {
  const menu = await getTodayMenuService();

  return ApiResponse.ok(res, 'Menu hari ini berhasil diambil', menu);
});

// ─── GET /api/menus/history ───────────────────────────────────────
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
export const getMenuById = asyncHandler(async (req, res) => {
  const menu = await getMenuByIdService(req.params.id);

  return ApiResponse.ok(res, 'Detail menu berhasil diambil', menu);
});

// ─── POST /api/menus ──────────────────────────────────────────────
export const createMenu = asyncHandler(async (req, res) => {
  const menu = await createMenuService(req.body, req.user.id);

  return ApiResponse.created(res, 'Menu berhasil dibuat', menu);
});

// ─── PUT /api/menus/:id ───────────────────────────────────────────
export const updateMenu = asyncHandler(async (req, res) => {
  const menu = await updateMenuService(req.params.id, req.body);

  return ApiResponse.ok(res, 'Menu berhasil diperbarui', menu);
});
