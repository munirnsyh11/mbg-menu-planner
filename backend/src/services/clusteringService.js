import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import Food      from '../models/Food.js';
import Nutrition from '../models/Nutrition.js';
import Cluster   from '../models/Cluster.js';

import { runKMeans, denormalizeCentroid, generateClusterNames } from './kmeansService.js';
import { ApiError } from '../utils/ApiError.js';
import { KMEANS_DEFAULTS } from '../utils/constants.js';

// ─── POST /api/clustering/run ─────────────────────────────────────
/**
 * Orkestrasi lengkap satu siklus K-Means:
 *
 *  1. Ambil semua foods yang punya data nutrisi lengkap
 *  2. Validasi jumlah data ≥ k
 *  3. Jalankan kmeansService.runKMeans()
 *  4. Nonaktifkan semua cluster lama (is_active = false)
 *  5. Simpan K dokumen Cluster baru (is_active = true)
 *  6. Update food.cluster_id & food.cluster_label untuk semua food
 *  7. Return ringkasan hasil
 *
 * @param {number} k - Jumlah cluster
 * @returns {object} Hasil clustering
 */
export const runClusteringService = async (k = KMEANS_DEFAULTS.K) => {
  // ─── 1. Ambil semua foods dengan data nutrisi ─────────────────
  const nutritions = await Nutrition.find({})
    .populate('food_id', 'name category')
    .lean();

  if (!nutritions.length) {
    throw ApiError.unprocessable(
      'Belum ada data nutrisi. Tambahkan data nutrisi makanan sebelum menjalankan clustering.'
    );
  }

  // ─── 2. Validasi jumlah data ──────────────────────────────────
  if (nutritions.length < KMEANS_DEFAULTS.MIN_DATA_POINTS) {
    throw ApiError.unprocessable(
      `Data nutrisi tidak mencukupi. Dibutuhkan minimal ${KMEANS_DEFAULTS.MIN_DATA_POINTS} data, tersedia ${nutritions.length}.`
    );
  }

  if (nutritions.length < k) {
    throw ApiError.unprocessable(
      `Nilai K (${k}) tidak boleh lebih besar dari jumlah data (${nutritions.length}).`
    );
  }

  // ─── 3. Siapkan data untuk K-Means ───────────────────────────
  const dataPoints = nutritions.map((n) => ({
    id:           n.food_id._id.toString(),
    calories:     n.calories,
    protein:      n.protein,
    fat:          n.fat,
    carbohydrate: n.carbohydrate,
  }));

  // ─── 4. Jalankan K-Means ──────────────────────────────────────
  const { assignments, centroids, minMax, iterations } = runKMeans(dataPoints, k);

  // ─── 5. Denormalisasi centroid & generate nama ────────────────
  const run_id = uuidv4();

  const clusterData = centroids.map((centroid, label) => ({
    cluster_label: label,
    ...denormalizeCentroid(centroid, minMax),
  }));

  const clusterNames = generateClusterNames(clusterData);

  // ─── 6. Simpan ke DB — sequential dengan manual rollback ──────
  // M0 tidak mendukung transactions. Jika step 6b/6c gagal,
  // kita rollback step 6a (aktifkan kembali cluster lama).
  let previouslyActiveClusters = [];
  let savedClusters = [];

  try {
    // 6a. Catat cluster aktif lama untuk keperluan rollback
    previouslyActiveClusters = await Cluster.find({ is_active: true })
      .select('_id')
      .lean();

    // Nonaktifkan semua cluster lama
    await Cluster.updateMany({}, { $set: { is_active: false } });

    // 6b. Buat K dokumen Cluster baru
    const clusterDocs = clusterData.map((cd) => ({
      run_id,
      cluster_label:     cd.cluster_label,
      cluster_name:      clusterNames.get(cd.cluster_label),
      centroid_calories: cd.centroid_calories,
      centroid_protein:  cd.centroid_protein,
      centroid_fat:      cd.centroid_fat,
      centroid_carbo:    cd.centroid_carbo,
      k_value:           k,
      iterations,
      is_active:         true,
    }));

    savedClusters = await Cluster.insertMany(clusterDocs);

    // Map cluster_label → cluster _id untuk update foods
    const labelToClusterId = new Map(
      savedClusters.map((c) => [c.cluster_label, c._id])
    );

    // 6c. Update cluster_id & cluster_label di setiap food
    const bulkOps = [];
    for (const [foodIdStr, label] of assignments) {
      bulkOps.push({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(foodIdStr) },
          update: {
            $set: {
              cluster_id:    labelToClusterId.get(label),
              cluster_label: label,
            },
          },
        },
      });
    }

    if (bulkOps.length > 0) {
      await Food.bulkWrite(bulkOps);
    }

  } catch (error) {
    // ─── Manual rollback ──────────────────────────────────────
    // Hapus cluster baru yang mungkin sudah tersimpan
    if (savedClusters.length > 0) {
      const newIds = savedClusters.map((c) => c._id);
      await Cluster.deleteMany({ _id: { $in: newIds } }).catch(() => {});
    }

    // Aktifkan kembali cluster lama
    if (previouslyActiveClusters.length > 0) {
      const oldIds = previouslyActiveClusters.map((c) => c._id);
      await Cluster.updateMany(
        { _id: { $in: oldIds } },
        { $set: { is_active: true } }
      ).catch(() => {});
    }

    throw ApiError.internal(
      'Gagal menyimpan hasil clustering. Perubahan telah dibatalkan.'
    );
  }

  // ─── 7. Return ringkasan ──────────────────────────────────────
  const clusterSizes = new Map();
  for (const label of assignments.values()) {
    clusterSizes.set(label, (clusterSizes.get(label) || 0) + 1);
  }

  return {
    run_id,
    k_value:     k,
    iterations,
    total_foods: assignments.size,
    clusters: savedClusters.map((c) => ({
      _id:               c._id,
      cluster_label:     c.cluster_label,
      cluster_name:      c.cluster_name,
      centroid_calories: c.centroid_calories,
      centroid_protein:  c.centroid_protein,
      centroid_fat:      c.centroid_fat,
      centroid_carbo:    c.centroid_carbo,
      food_count:        clusterSizes.get(c.cluster_label) || 0,
    })),
  };
};

// ─── GET /api/clustering/active ───────────────────────────────────
/**
 * Ambil hasil clustering yang sedang aktif (run terakhir).
 * Include daftar foods di setiap cluster.
 *
 * @returns {object} { run_id, clusters: [{ ...clusterData, foods: [] }] }
 */
export const getActiveClusteringService = async () => {
  const activeClusters = await Cluster.find({ is_active: true })
    .sort({ cluster_label: 1 })
    .lean();

  if (!activeClusters.length) {
    throw ApiError.notFound(
      'Belum ada hasil clustering. Jalankan K-Means terlebih dahulu.'
    );
  }

  const run_id = activeClusters[0].run_id;

  // Ambil foods beserta data nutrisinya per cluster
  const clusterIds = activeClusters.map((c) => c._id);

  const foods = await Food.find({ cluster_id: { $in: clusterIds } })
    .select('name category unit cluster_label')
    .lean();

  // Group foods by cluster_label
  const foodsByLabel = new Map();
  for (const food of foods) {
    const label = food.cluster_label;
    if (!foodsByLabel.has(label)) foodsByLabel.set(label, []);
    foodsByLabel.get(label).push(food);
  }

  const clusters = activeClusters.map((c) => ({
    ...c,
    foods:      foodsByLabel.get(c.cluster_label) || [],
    food_count: (foodsByLabel.get(c.cluster_label) || []).length,
  }));

  return { run_id, k_value: activeClusters[0].k_value, clusters };
};

// ─── GET /api/clustering/history ──────────────────────────────────
/**
 * Riwayat semua run K-Means yang pernah dilakukan.
 * Dikelompokkan per run_id dengan pagination.
 *
 * @param {object} queryParams - { page, limit }
 * @returns {{ runs: Array, pagination: object }}
 */
export const getClusteringHistoryService = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  // Aggregate: group by run_id, ambil metadata dari document pertama di tiap run
  const pipeline = [
    {
      $group: {
        _id:        '$run_id',
        run_id:     { $first: '$run_id' },
        k_value:    { $first: '$k_value' },
        iterations: { $first: '$iterations' },
        is_active:  { $first: '$is_active' },
        created_at: { $first: '$created_at' },
        cluster_count: { $sum: 1 },
      },
    },
    { $sort: { created_at: -1 } },
    {
      $facet: {
        data:  [{ $skip: skip }, { $limit: Number(limit) }],
        total: [{ $count: 'count' }],
      },
    },
  ];

  const [result] = await Cluster.aggregate(pipeline);

  const total      = result.total[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    runs: result.data,
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
