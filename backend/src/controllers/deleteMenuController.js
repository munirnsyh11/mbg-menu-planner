import { deleteMenuService } from '../services/deleteMenuService.js';
import { ApiResponse }       from '../utils/ApiResponse.js';
import asyncHandler          from '../utils/asyncHandler.js';

export const deleteMenu = asyncHandler(async (req, res) => {
  await deleteMenuService(req.params.id);

  return ApiResponse.ok(res, 'Menu berhasil dihapus');
});
