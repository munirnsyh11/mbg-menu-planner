// src/controllers/deleteMenuController.js
// Controller untuk DELETE /api/menus/:id
// Tambahan tanpa mengubah menuController.js yang sudah ada.

import { deleteMenuService } from '../services/deleteMenuService.js';
import { ApiResponse }       from '../utils/ApiResponse.js';
import asyncHandler          from '../utils/asyncHandler.js';

/**
 * DELETE /api/menus/:id
 * Hapus menu dan seluruh MenuDetail yang berelasi.
 * Middleware: protect → adminOnly
 */
export const deleteMenu = asyncHandler(async (req, res) => {
  await deleteMenuService(req.params.id);

  return ApiResponse.ok(res, 'Menu berhasil dihapus');
});
