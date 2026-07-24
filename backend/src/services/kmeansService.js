import { KMEANS_DEFAULTS } from '../utils/constants.js';
import { roundToDecimal } from '../utils/helpers.js';

// ─── Step 1: Min-Max Normalization ────────────────────────────────
/**
 * Normalisasi semua data point ke range [0, 1] per fitur.
 * Formula: x_norm = (x - min) / (max - min)
 * Jika max === min (semua nilai sama), hasil = 0 untuk menghindari division by zero.
 *
 * @param {Array} dataPoints - Array { id, calories, protein, fat, carbohydrate }
 * @returns {{ normalized: NormalizedPoint[], minMax: object }}
 */
export const normalize = (dataPoints) => {
  const features = ['calories', 'protein', 'fat', 'carbohydrate'];
  const minMax = {};

  // Hitung min dan max tiap fitur
  for (const feat of features) {
    const values = dataPoints.map((p) => p[feat]);
    minMax[feat] = {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  // Normalisasi
  const normalized = dataPoints.map((p) => ({
    id: p.id,
    features: features.map((feat) => {
      const { min, max } = minMax[feat];
      return max === min ? 0 : (p[feat] - min) / (max - min);
    }),
  }));

  return { normalized, minMax };
};

/**
 * Denormalisasi centroid kembali ke skala asli.
 * Formula: x = x_norm * (max - min) + min
 *
 * @param {Centroid} centroid - [c0, c1, c2, c3] (normalized)
 * @param {object} minMax - { calories: {min, max}, protein: {min,max}, ... }
 * @returns {object} { centroid_calories, centroid_protein, centroid_fat, centroid_carbo }
 */
export const denormalizeCentroid = (centroid, minMax) => {
  const features = ['calories', 'protein', 'fat', 'carbohydrate'];
  const keys     = ['centroid_calories', 'centroid_protein', 'centroid_fat', 'centroid_carbo'];

  return keys.reduce((acc, key, i) => {
    const feat = features[i];
    const { min, max } = minMax[feat];
    acc[key] = roundToDecimal(centroid[i] * (max - min) + min);
    return acc;
  }, {});
};

// ─── Step 2: Euclidean Distance ───────────────────────────────────
/**
 * Hitung Euclidean Distance antara dua vektor fitur.
 * d = sqrt(Σ(a_i - b_i)²)
 *
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
export const euclideanDistance = (a, b) => {
  const sumOfSquares = a.reduce((acc, val, i) => acc + (val - b[i]) ** 2, 0);
  return Math.sqrt(sumOfSquares);
};

// ─── Step 3: Inisialisasi Centroid (K-Means++) ────────────────────
/**
 * Pilih K centroid awal menggunakan strategi K-Means++:
 * Centroid pertama = titik data pertama (deterministik).
 * Centroid berikutnya dipilih berdasarkan probabilitas proporsional
 * terhadap kuadrat jarak ke centroid terdekat yang sudah dipilih.
 * Ini mengurangi risiko konvergensi ke local minimum.
 *
 * @param {NormalizedPoint[]} normalized
 * @param {number} k
 * @returns {Centroid[]}
 */
export const initializeCentroids = (normalized, k) => {
  const centroids = [normalized[0].features.slice()];

  while (centroids.length < k) {
    // Hitung jarak kuadrat ke centroid terdekat untuk setiap titik
    const distances = normalized.map((p) => {
      const minDist = Math.min(
        ...centroids.map((c) => euclideanDistance(p.features, c))
      );
      return minDist ** 2;
    });

    // Pilih titik berikutnya secara proporsional terhadap jarak (pseudo-random deterministik)
    const total = distances.reduce((a, b) => a + b, 0);
    let cumulative = 0;
    const threshold = total * 0.5; // deterministik: selalu ambil titik di tengah distribusi

    let chosen = normalized.length - 1;
    for (let i = 0; i < distances.length; i++) {
      cumulative += distances[i];
      if (cumulative >= threshold) {
        chosen = i;
        break;
      }
    }

    centroids.push(normalized[chosen].features.slice());
  }

  return centroids;
};

// ─── Step 4: Assignment ───────────────────────────────────────────
/**
 * Tetapkan setiap titik ke centroid terdekat.
 *
 * @param {NormalizedPoint[]} normalized
 * @param {Centroid[]} centroids
 * @returns {Map<string, number>} id → cluster_label
 */
export const assignClusters = (normalized, centroids) => {
  const assignments = new Map();

  for (const point of normalized) {
    let minDist  = Infinity;
    let minLabel = 0;

    centroids.forEach((centroid, label) => {
      const dist = euclideanDistance(point.features, centroid);
      if (dist < minDist) {
        minDist  = dist;
        minLabel = label;
      }
    });

    assignments.set(point.id, minLabel);
  }

  return assignments;
};

// ─── Step 5: Update Centroids ─────────────────────────────────────
/**
 * Hitung centroid baru sebagai mean semua titik di tiap cluster.
 * Jika ada cluster kosong (tidak ada titik yang ter-assign),
 * centroid lama dipertahankan untuk menghindari NaN.
 *
 * @param {NormalizedPoint[]} normalized
 * @param {Map<string, number>} assignments
 * @param {Centroid[]} oldCentroids
 * @param {number} k
 * @returns {Centroid[]}
 */
export const updateCentroids = (normalized, assignments, oldCentroids, k) => {
  const featureLen = oldCentroids[0].length;
  const sums   = Array.from({ length: k }, () => new Array(featureLen).fill(0));
  const counts = new Array(k).fill(0);

  for (const point of normalized) {
    const label = assignments.get(point.id);
    counts[label]++;
    point.features.forEach((val, i) => { sums[label][i] += val; });
  }

  return sums.map((sum, label) => {
    if (counts[label] === 0) return oldCentroids[label]; // cluster kosong: pertahankan
    return sum.map((s) => s / counts[label]);
  });
};

// ─── Step 6: Cek Konvergensi ──────────────────────────────────────
/**
 * Periksa apakah assignment berubah dibanding iterasi sebelumnya.
 *
 * @param {Map<string, number>} prev
 * @param {Map<string, number>} curr
 * @returns {boolean} true jika tidak ada perubahan (konvergen)
 */
const hasConverged = (prev, curr) => {
  for (const [id, label] of curr) {
    if (prev.get(id) !== label) return false;
  }
  return true;
};

// ─── Main: runKMeans ──────────────────────────────────────────────
/**
 * Jalankan algoritma K-Means sampai konvergen.
 *
 * @param {Array} dataPoints   - [{ id, calories, protein, fat, carbohydrate }]
 * @param {number} k           - Jumlah cluster
 * @param {number} maxIter     - Batas iterasi maksimum
 * @returns {{
 *   assignments: Map<string, number>,  // food_id → cluster_label
 *   centroids:   Centroid[],           // centroid akhir (normalized)
 *   minMax:      object,               // untuk denormalisasi
 *   iterations:  number                // iterasi yang dibutuhkan
 * }}
 */
export const runKMeans = (
  dataPoints,
  k,
  maxIter = KMEANS_DEFAULTS.MAX_ITERATIONS
) => {
  const { normalized, minMax } = normalize(dataPoints);
  let centroids   = initializeCentroids(normalized, k);
  let assignments = new Map();
  let iterations  = 0;

  for (let iter = 0; iter < maxIter; iter++) {
    iterations++;
    const newAssignments = assignClusters(normalized, centroids);

    if (iter > 0 && hasConverged(assignments, newAssignments)) break;

    assignments = newAssignments;
    centroids   = updateCentroids(normalized, assignments, centroids, k);
  }

  return { assignments, centroids, minMax, iterations };
};

// ─── Naming: Auto-label cluster berdasarkan centroid ──────────────
/**
 * Beri nama deskriptif pada tiap cluster berdasarkan nilai centroid tertinggi.
 * Centroid sudah di-denormalisasi saat fungsi ini dipanggil.
 *
 * Logika:
 *   - Tinggi Kalori   jika centroid_calories paling tinggi di antara cluster
 *   - Tinggi Protein  jika centroid_protein paling tinggi
 *   - Tinggi Lemak    jika centroid_fat paling tinggi
 *   - Tinggi Karbo    jika centroid_carbohydrate paling tinggi
 *   - Seimbang        jika tidak ada fitur yang dominan
 *
 * @param {object[]} clusterData - [{ cluster_label, centroid_calories, centroid_protein, centroid_fat, centroid_carbo }]
 * @returns {Map<number, string>} cluster_label → cluster_name
 */
export const generateClusterNames = (clusterData) => {
  const featureMap = [
    { key: 'centroid_calories',  label: 'Tinggi Kalori' },
    { key: 'centroid_protein',   label: 'Tinggi Protein' },
    { key: 'centroid_fat',       label: 'Tinggi Lemak' },
    { key: 'centroid_carbo',     label: 'Tinggi Karbo' },
  ];

  // Untuk setiap fitur, cari cluster dengan nilai tertinggi
  const dominanceMap = new Map(); // cluster_label → nama

  for (const { key, label } of featureMap) {
    const maxVal   = Math.max(...clusterData.map((c) => c[key]));
    const dominant = clusterData.find((c) => c[key] === maxVal);

    if (dominant && !dominanceMap.has(dominant.cluster_label)) {
      dominanceMap.set(dominant.cluster_label, label);
    }
  }

  // Cluster yang tidak dominan di fitur manapun → 'Seimbang'
  for (const { cluster_label } of clusterData) {
    if (!dominanceMap.has(cluster_label)) {
      dominanceMap.set(cluster_label, 'Seimbang');
    }
  }

  return dominanceMap;
};
