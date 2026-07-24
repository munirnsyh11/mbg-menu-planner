import Nutrition from '../models/Nutrition.js';
import Food from '../models/Food.js';
import { ApiError } from '../utils/ApiError.js';

// ─── Helper: Populate food detail ────────────────────────────────
const withFood = (query) =>
  query.populate('food_id', 'name category unit description cluster_label');

// ─── GET ALL ──────────────────────────────────────────────────────
/**
 * Ambil semua data nutrisi dengan pagination dan join ke food.
 *
 * @param {object} queryParams - { page, limit, min_calories, max_calories, sort_by, sort_order }
 * @returns {{ nutritions: Array, pagination: object }}
 */
export const getAllNutritionsService = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    min_calories,
    max_calories,
    sort_by = 'created_at',
    sort_order = 'desc',
  } = queryParams;

  // Build filter
  const filter = {};
  if (min_calories !== undefined || max_calories !== undefined) {
    filter.calories = {};
    if (min_calories !== undefined) filter.calories.$gte = Number(min_calories);
    if (max_calories !== undefined) filter.calories.$lte = Number(max_calories);
  }

  const sort = { [sort_by]: sort_order === 'asc' ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [nutritions, total] = await Promise.all([
    withFood(Nutrition.find(filter)).sort(sort).skip(skip).limit(limit).lean(),
    Nutrition.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    nutritions,
    pagination: {
      total,
      page:       Number(page),
      limit:      Number(limit),
      totalPages,
      hasNext:    page < totalPages,
      hasPrev:    page > 1,
    },
  };
};

// ─── GET ONE by foodId ────────────────────────────────────────────
/**
 * Ambil data nutrisi berdasarkan food_id (bukan nutrition _id).
 * Endpoint: GET /api/nutritions/:foodId
 *
 * @param {string} foodId
 * @returns {object} nutrition document
 */
export const getNutritionByFoodIdService = async (foodId) => {
  // Pastikan food-nya ada dulu
  const food = await Food.findById(foodId).lean();
  if (!food) {
    throw ApiError.notFound('Data makanan tidak ditemukan');
  }

  const nutrition = await withFood(Nutrition.findOne({ food_id: foodId })).lean();
  if (!nutrition) {
    throw ApiError.notFound('Data nutrisi untuk makanan ini belum tersedia');
  }

  return nutrition;
};

// ─── CREATE ───────────────────────────────────────────────────────
/**
 * Buat data nutrisi baru.
 * Business rule: satu food hanya boleh punya satu dokumen nutrisi (unique food_id).
 *
 * @param {object} body - { food_id, calories, protein, fat, carbohydrate, fiber? }
 * @returns {object} nutrition document yang baru dibuat
 */
export const createNutritionService = async (body) => {
  const { food_id, calories, protein, fat, carbohydrate, fiber } = body;

  // Pastikan food-nya ada
  const food = await Food.findById(food_id).lean();
  if (!food) {
    throw ApiError.notFound('Data makanan tidak ditemukan');
  }

  // Cek duplikat — unique constraint ada di schema, tapi berikan pesan yang lebih baik
  const existing = await Nutrition.findOne({ food_id }).lean();
  if (existing) {
    throw ApiError.conflict(
      `Data nutrisi untuk makanan "${food.name}" sudah ada. Gunakan PUT untuk mengubahnya.`
    );
  }

  const nutrition = await Nutrition.create({
    food_id,
    calories,
    protein,
    fat,
    carbohydrate,
    fiber: fiber ?? null,
  });

  await nutrition.populate('food_id', 'name category unit');

  return nutrition.toObject();
};

// ─── UPDATE ───────────────────────────────────────────────────────
/**
 * Update data nutrisi berdasarkan food_id.
 * food_id tidak bisa diubah — diidentifikasi via URL param.
 *
 * @param {string} foodId
 * @param {object} body - Field yang diupdate (partial update)
 * @returns {object} nutrition document setelah update
 */
export const updateNutritionService = async (foodId, body) => {
  // Pastikan food-nya ada
  const food = await Food.findById(foodId).lean();
  if (!food) {
    throw ApiError.notFound('Data makanan tidak ditemukan');
  }

  const updated = await withFood(
    Nutrition.findOneAndUpdate(
      { food_id: foodId },
      { $set: body },
      { new: true, runValidators: true }
    )
  ).lean();

  if (!updated) {
    throw ApiError.notFound(
      `Data nutrisi untuk makanan "${food.name}" belum tersedia. Gunakan POST untuk menambahkan.`
    );
  }

  return updated;
};
