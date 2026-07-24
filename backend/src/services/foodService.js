import Food from '../models/Food.js';
import Nutrition from '../models/Nutrition.js';
import MenuDetail from '../models/MenuDetail.js';
import { ApiError } from '../utils/ApiError.js';

// ─── Helper: Build Query Filter ───────────────────────────────────
/**
 * Membangun MongoDB query object dari query params yang sudah divalidasi.
 * @param {object} queryParams - Hasil validasi dari listFoodQuerySchema
 * @returns {object} MongoDB filter object
 */
const buildFilter = ({ search, category, cluster_label }) => {
  const filter = {};

  if (search && search.trim()) {
    // Gunakan $regex — aman untuk semua tier MongoDB Atlas (termasuk M0)
    // $text + $or tidak kompatibel: MongoDB melarang $text di dalam $or
    filter.name = { $regex: search.trim(), $options: 'i' };
  }

  if (category && category !== '') {
    filter.category = category;
  }

  if (cluster_label !== undefined && cluster_label !== null && cluster_label !== '') {
    filter.cluster_label = Number(cluster_label);
  }

  return filter;
};

// ─── Helper: Build Sort Object ────────────────────────────────────
const buildSort = (sort_by = 'created_at', sort_order = 'desc') => {
  return { [sort_by]: sort_order === 'asc' ? 1 : -1 };
};

// ─── GET ALL (dengan pagination, search, filter) ──────────────────
/**
 * Ambil list makanan dengan pagination, search by name, filter by category.
 *
 * @param {object} queryParams - { page, limit, search, category, cluster_label, sort_by, sort_order }
 * @returns {{ foods: Array, pagination: object }}
 */
export const getAllFoodsService = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sort_by = 'created_at',
    sort_order = 'desc',
  } = queryParams;

  const filter = buildFilter(queryParams);
  const sort   = buildSort(sort_by, sort_order);
  const skip   = (page - 1) * limit;

  // Jalankan query dan count secara paralel untuk efisiensi
  const [foods, total] = await Promise.all([
    Food.find(filter)
      .populate('created_by', 'name email')      // join data user pembuat
      .populate('cluster_id', 'cluster_name cluster_label') // join data cluster
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),                                    // lean() → plain JS object, lebih cepat
    Food.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    foods,
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

// ─── GET ONE ──────────────────────────────────────────────────────
/**
 * Ambil satu makanan berdasarkan ID.
 * Include data nutrisi jika ada.
 *
 * @param {string} foodId
 * @returns {object} food dengan nutrition (jika tersedia)
 */
export const getFoodByIdService = async (foodId) => {
  const food = await Food.findById(foodId)
    .populate('created_by', 'name email')
    .populate('cluster_id', 'cluster_name cluster_label centroid_calories centroid_protein centroid_fat centroid_carbo')
    .lean();

  if (!food) {
    throw ApiError.notFound('Data makanan tidak ditemukan');
  }

  // Ambil data nutrisi jika tersedia (relasi 1-to-1)
  const nutrition = await Nutrition.findOne({ food_id: foodId }).lean();

  return { ...food, nutrition: nutrition || null };
};

// ─── CREATE ───────────────────────────────────────────────────────
/**
 * Buat data makanan baru.
 *
 * @param {object} body    - { name, category, unit, description }
 * @param {string} userId  - ID admin yang membuat (dari req.user.id)
 * @returns {object} food document yang baru dibuat
 */
export const createFoodService = async (body, userId) => {
  const { name, category, unit, description } = body;

  const food = await Food.create({
    name,
    category,
    unit,
    description: description || null,
    created_by: userId,
  });

  // Populate created_by sebelum dikembalikan
  await food.populate('created_by', 'name email');

  return food.toObject();
};

// ─── UPDATE ───────────────────────────────────────────────────────
/**
 * Update data makanan.
 * Hanya field yang dikirim yang diupdate (partial update).
 *
 * @param {string} foodId
 * @param {object} body - Field yang diupdate
 * @returns {object} food document setelah update
 */
export const updateFoodService = async (foodId, body) => {
  // Cek keberadaan dokumen terlebih dahulu
  const existing = await Food.findById(foodId);

  if (!existing) {
    throw ApiError.notFound('Data makanan tidak ditemukan');
  }

  // new: true → return dokumen setelah update
  // runValidators: true → jalankan schema validation saat update
  const updated = await Food.findByIdAndUpdate(
    foodId,
    { $set: body },
    { new: true, runValidators: true }
  )
    .populate('created_by', 'name email')
    .populate('cluster_id', 'cluster_name cluster_label')
    .lean();

  return updated;
};

// ─── DELETE ───────────────────────────────────────────────────────
/**
 * Hapus data makanan.
 * Business rule: tidak bisa dihapus jika sedang digunakan di menu aktif.
 *
 * @param {string} foodId
 */
export const deleteFoodService = async (foodId) => {
  const existing = await Food.findById(foodId);

  if (!existing) {
    throw ApiError.notFound('Data makanan tidak ditemukan');
  }

  // Business rule: cek apakah makanan digunakan di menu_details
  const usageCount = await MenuDetail.countDocuments({ food_id: foodId });

  if (usageCount > 0) {
    throw ApiError.conflict(
      `Makanan tidak dapat dihapus karena digunakan di ${usageCount} menu. ` +
      'Hapus makanan dari menu terlebih dahulu.'
    );
  }

  // Hapus makanan dan data nutrisinya secara bersamaan
  await Promise.all([
    Food.findByIdAndDelete(foodId),
    Nutrition.findOneAndDelete({ food_id: foodId }),
  ]);
};

// ─── GET ALL (tanpa pagination) — untuk K-Means & dropdown ────────
/**
 * Ambil semua makanan tanpa paginasi.
 * Digunakan oleh K-Means service dan dropdown picker di frontend.
 * Hanya return field yang diperlukan untuk efisiensi.
 *
 * @param {object} filter - Optional MongoDB filter object
 * @returns {Array} array makanan
 */
export const getAllFoodsNoPaginationService = async (filter = {}) => {
  return Food.find(filter)
    .select('name category unit cluster_id cluster_label')
    .sort({ name: 1 })
    .lean();
};
