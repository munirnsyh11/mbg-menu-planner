// src/services/menuService.deleteMenu.js
// Tambahan: deleteMenuService
// File terpisah agar tidak mengubah menuService.js yang sudah ada.
// Di-import oleh menuController.js.

import Menu       from '../models/Menu.js';
import MenuDetail from '../models/MenuDetail.js';
import { ApiError } from '../utils/ApiError.js';

// ─── DELETE ──────────────────────────────────────────────────────
/**
 * Hapus menu beserta seluruh MenuDetail yang berelasi.
 * Urutan:
 *   1. Cek menu ada
 *   2. Hapus semua menu_details dengan menu_id ini (cegah orphan data)
 *   3. Hapus dokumen Menu
 *
 * Tidak menggunakan transaction (Atlas M0 Free Tier tidak mendukung).
 * Jika step 3 gagal setelah step 2 berhasil, details sudah terhapus.
 * Risiko ini dapat diterima karena menu yang detail-nya hilang tidak
 * lagi dapat digunakan secara fungsional.
 *
 * @param {string} menuId
 */
export const deleteMenuService = async (menuId) => {
  const menu = await Menu.findById(menuId);
  if (!menu) {
    throw ApiError.notFound('Menu tidak ditemukan');
  }

  // Step 1: Hapus semua menu_details untuk menu ini
  await MenuDetail.deleteMany({ menu_id: menuId });

  // Step 2: Hapus dokumen Menu
  await Menu.findByIdAndDelete(menuId);
};
