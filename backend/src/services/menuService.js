// src/services/menuService.js
// Business logic untuk Menus CRUD
// Mengelola relasi Menu ↔ MenuDetails dan kalkulasi nutrisi otomatis

import Menu       from '../models/Menu.js';
import MenuDetail from '../models/MenuDetail.js';
import Food       from '../models/Food.js';
import Nutrition  from '../models/Nutrition.js';

import { ApiError }                    from '../utils/ApiError.js';
import { calculateNutrientContribution, roundToDecimal } from '../utils/helpers.js';
import { checkMeetsAKG, calculateAKGPercentage }        from '../utils/akgCalculator.js';
import { MENU_STATUS }                 from '../utils/constants.js';

// ─── Helper: Normalisasi tanggal ke midnight UTC ──────────────────
/**
 * Mengubah tanggal menjadi range [startOfDay, endOfDay] untuk query.
 * Menghindari timezone mismatch saat membandingkan Date di MongoDB.
 */
const dayRange = (date) => {
  const d = new Date(date);
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const end   = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { $gte: start, $lt: end };
};

// ─── Helper: Kalkulasi nutrisi dari items ─────────────────────────
/**
 * Ambil data nutrisi semua food dalam items, hitung kontribusi per porsi,
 * dan return detail + total + meets_akg.
 *
 * @param {Array} items - [{ food_id, portion_gram }]
 * @returns {{ details: Array, totals: object, meets_akg: boolean, akg_pct: object }}
 */
const calculateMenuNutrition = async (items) => {
  // Ambil semua food dan nutrition yang dibutuhkan secara paralel
  const foodIds = items.map((i) => i.food_id);

  const [foods, nutritions] = await Promise.all([
    Food.find({ _id: { $in: foodIds } }).lean(),
    Nutrition.find({ food_id: { $in: foodIds } }).lean(),
  ]);

  // Map untuk lookup O(1)
  const foodMap      = new Map(foods.map((f) => [f._id.toString(), f]));
  const nutritionMap = new Map(nutritions.map((n) => [n.food_id.toString(), n]));

  // Validasi: semua food harus ada dan punya data nutrisi
  for (const item of items) {
    const fid = item.food_id.toString();
    if (!foodMap.has(fid)) {
      throw ApiError.notFound(`Makanan dengan ID ${item.food_id} tidak ditemukan`);
    }
    if (!nutritionMap.has(fid)) {
      throw ApiError.unprocessable(
        `Makanan "${foodMap.get(fid).name}" belum memiliki data nutrisi. ` +
        'Tambahkan data nutrisi terlebih dahulu.'
      );
    }
  }

  // Hitung kontribusi per item
  const details = items.map((item) => {
    const fid  = item.food_id.toString();
    const nutr = nutritionMap.get(fid);
    const pg   = item.portion_gram;

    return {
      food_id:          item.food_id,
      portion_gram:     pg,
      calories_contrib: calculateNutrientContribution(nutr.calories,     pg),
      protein_contrib:  calculateNutrientContribution(nutr.protein,      pg),
      fat_contrib:      calculateNutrientContribution(nutr.fat,          pg),
      carbo_contrib:    calculateNutrientContribution(nutr.carbohydrate, pg),
    };
  });

  // Sum totals
  const totals = details.reduce(
    (acc, d) => {
      acc.total_calories     += d.calories_contrib;
      acc.total_protein      += d.protein_contrib;
      acc.total_fat          += d.fat_contrib;
      acc.total_carbohydrate += d.carbo_contrib;
      return acc;
    },
    { total_calories: 0, total_protein: 0, total_fat: 0, total_carbohydrate: 0 }
  );

  // Bulatkan total
  totals.total_calories     = roundToDecimal(totals.total_calories);
  totals.total_protein      = roundToDecimal(totals.total_protein);
  totals.total_fat          = roundToDecimal(totals.total_fat);
  totals.total_carbohydrate = roundToDecimal(totals.total_carbohydrate);

  const meets_akg = checkMeetsAKG({
    calories:     totals.total_calories,
    protein:      totals.total_protein,
    fat:          totals.total_fat,
    carbohydrate: totals.total_carbohydrate,
  });

  const akg_pct = calculateAKGPercentage({
    calories:     totals.total_calories,
    protein:      totals.total_protein,
    fat:          totals.total_fat,
    carbohydrate: totals.total_carbohydrate,
  });

  return { details, totals, meets_akg, akg_pct };
};

// ─── Helper: Populate menu dengan details + food info ────────────
const populateMenuDetails = async (menuId) => {
  return MenuDetail.find({ menu_id: menuId })
    .populate('food_id', 'name category unit cluster_label')
    .lean();
};

// ─── GET ALL ─────────────────────────────────────────────────────
/**
 * List menu dengan pagination, filter status, filter tanggal, filter AKG.
 */
export const getAllMenusService = async (queryParams) => {
  const {
    page       = 1,
    limit      = 10,
    status,
    meets_akg,
    date_from,
    date_to,
    search,
    sort_order = 'desc',
  } = queryParams;

  const filter = {};
  if (status)    filter.status    = status;
  if (meets_akg !== undefined) filter.meets_akg = meets_akg;
  if (search && search.trim()) {
    filter.menu_name = { $regex: search.trim(), $options: 'i' };
  }

  if (date_from || date_to) {
    filter.menu_date = {};
    if (date_from) filter.menu_date.$gte = new Date(date_from);
    if (date_to)   filter.menu_date.$lte = new Date(date_to);
  }

  const sort = { menu_date: sort_order === 'asc' ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [menus, total] = await Promise.all([
    Menu.find(filter)
      .populate('created_by', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Menu.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    menus,
    pagination: {
      total,
      page:      Number(page),
      limit:     Number(limit),
      totalPages,
      hasNext:   page < totalPages,
      hasPrev:   page > 1,
    },
  };
};

// ─── GET ONE ─────────────────────────────────────────────────────
/**
 * Detail satu menu beserta daftar bahan makanan (menu_details).
 */
export const getMenuByIdService = async (menuId) => {
  const menu = await Menu.findById(menuId)
    .populate('created_by', 'name email')
    .lean();

  if (!menu) throw ApiError.notFound('Menu tidak ditemukan');

  const details = await populateMenuDetails(menuId);
  const akg_pct = calculateAKGPercentage({
    calories:     menu.total_calories,
    protein:      menu.total_protein,
    fat:          menu.total_fat,
    carbohydrate: menu.total_carbohydrate,
  });

  return { ...menu, items: details, akg_percentage: akg_pct };
};

// ─── GET TODAY ───────────────────────────────────────────────────
/**
 * Ambil menu untuk hari ini (status: published).
 * Endpoint mobile: GET /api/menus/today
 */
export const getTodayMenuService = async () => {
  const menu = await Menu.findOne({
    menu_date: dayRange(new Date()),
    status:    MENU_STATUS.PUBLISHED,
  })
    .populate('created_by', 'name')
    .lean();

  if (!menu) {
    throw ApiError.notFound('Menu hari ini belum tersedia atau belum dipublikasikan.');
  }

  const details = await populateMenuDetails(menu._id);
  const akg_pct = calculateAKGPercentage({
    calories:     menu.total_calories,
    protein:      menu.total_protein,
    fat:          menu.total_fat,
    carbohydrate: menu.total_carbohydrate,
  });

  return { ...menu, items: details, akg_percentage: akg_pct };
};

// ─── GET HISTORY ─────────────────────────────────────────────────
/**
 * Riwayat menu yang sudah published, diurutkan dari terbaru.
 * Endpoint mobile: GET /api/menus/history
 */
export const getMenuHistoryService = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const filter = { status: MENU_STATUS.PUBLISHED };

  const [menus, total] = await Promise.all([
    Menu.find(filter)
      .select('menu_date menu_name total_calories total_protein total_fat total_carbohydrate meets_akg')
      .sort({ menu_date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Menu.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    menus,
    pagination: {
      total,
      page:      Number(page),
      limit:     Number(limit),
      totalPages,
      hasNext:   page < totalPages,
      hasPrev:   page > 1,
    },
  };
};

// ─── CREATE ──────────────────────────────────────────────────────
/**
 * Buat menu baru beserta detail bahan makanan.
 * Kalkulasi total nutrisi dan meets_akg dilakukan otomatis.
 * Seluruh operasi dalam satu MongoDB transaction.
 *
 * @param {object} body   - { menu_date, menu_name, status?, items }
 * @param {string} userId - ID admin pembuat (dari req.user.id)
 */
export const createMenuService = async (body, userId) => {
  const { menu_date, menu_name, status, items } = body;

  // Cek duplikat tanggal
  const existing = await Menu.findOne({ menu_date: dayRange(new Date(menu_date)) });
  if (existing) {
    throw ApiError.conflict(
      `Menu untuk tanggal ${new Date(menu_date).toLocaleDateString('id-ID')} sudah ada.`
    );
  }

  // Kalkulasi nutrisi
  const { details, totals, meets_akg, akg_pct } = await calculateMenuNutrition(items);

  // ─── Simpan ke DB — sequential (kompatibel dengan Atlas M0) ────
  // Buat Menu terlebih dahulu, lalu MenuDetails.
  // Jika insertMany details gagal, hapus menu yang sudah tersimpan (manual rollback).
  let menu;
  try {
    menu = await Menu.create({
      menu_date,
      menu_name,
      status:     status || MENU_STATUS.DRAFT,
      created_by: userId,
      ...totals,
      meets_akg,
    });

    const detailDocs = details.map((d) => ({ ...d, menu_id: menu._id }));
    await MenuDetail.insertMany(detailDocs);

  } catch (error) {
    // Manual rollback: hapus menu jika details gagal disimpan
    if (menu?._id) {
      await Menu.findByIdAndDelete(menu._id).catch(() => {});
    }
    throw ApiError.internal('Gagal menyimpan menu. Perubahan telah dibatalkan.');
  }

  const savedDetails = await populateMenuDetails(menu._id);
  return { ...menu.toObject(), items: savedDetails, akg_percentage: akg_pct };
};

// ─── UPDATE ──────────────────────────────────────────────────────
/**
 * Update menu. Jika items dikirim, hapus semua menu_details lama
 * dan buat ulang dengan kalkulasi nutrisi yang baru.
 *
 * @param {string} menuId
 * @param {object} body   - { menu_name?, status?, items? }
 */
export const updateMenuService = async (menuId, body) => {
  const { menu_name, status, items } = body;

  const menu = await Menu.findById(menuId);
  if (!menu) throw ApiError.notFound('Menu tidak ditemukan');

  const updateFields = {};
  if (menu_name) updateFields.menu_name = menu_name;
  if (status)    updateFields.status    = status;

  // Jika items dikirim: recalculate semua nutrisi
  let akg_pct;
  if (items && items.length > 0) {
    const { details, totals, meets_akg, akg_pct: pct } = await calculateMenuNutrition(items);
    Object.assign(updateFields, { ...totals, meets_akg });
    akg_pct = pct;

    // Sequential ops — kompatibel dengan Atlas M0
    // Simpan menu_details lama untuk rollback jika diperlukan
    const oldDetails = await MenuDetail.find({ menu_id: menuId }).lean();

    try {
      await MenuDetail.deleteMany({ menu_id: menuId });
      const detailDocs = details.map((d) => ({ ...d, menu_id: menuId }));
      await MenuDetail.insertMany(detailDocs);
      await Menu.findByIdAndUpdate(menuId, { $set: updateFields });

    } catch (error) {
      // Manual rollback: kembalikan menu_details lama
      await MenuDetail.deleteMany({ menu_id: menuId }).catch(() => {});
      if (oldDetails.length > 0) {
        await MenuDetail.insertMany(oldDetails).catch(() => {});
      }
      throw ApiError.internal('Gagal memperbarui menu. Perubahan telah dibatalkan.');
    }

  } else {
    // Hanya update field non-items
    await Menu.findByIdAndUpdate(menuId, { $set: updateFields });

    akg_pct = calculateAKGPercentage({
      calories:     menu.total_calories,
      protein:      menu.total_protein,
      fat:          menu.total_fat,
      carbohydrate: menu.total_carbohydrate,
    });
  }

  // Return state terbaru
  const updated = await Menu.findById(menuId).populate('created_by', 'name email').lean();
  const savedDetails = await populateMenuDetails(menuId);

  return { ...updated, items: savedDetails, akg_percentage: akg_pct };
};

