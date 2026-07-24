import mongoose from 'mongoose';

// ─── Schema ───────────────────────────────────────────────────────
const clusterSchema = new mongoose.Schema(
  {
    // ID unik per eksekusi K-Means (UUID) | NOT NULL
    run_id: {
      type: String,
      required: [true, 'run_id wajib diisi'],
      trim: true,
    },

    // Label numerik cluster: 0, 1, 2, ... | NOT NULL
    cluster_label: {
      type: Number,
      required: [true, 'Cluster label wajib diisi'],
      min: [0, 'Cluster label tidak boleh negatif'],
    },

    // Nama deskriptif cluster (mis: 'Tinggi Protein') | NOT NULL
    cluster_name: {
      type: String,
      required: [true, 'Nama cluster wajib diisi'],
      trim: true,
      maxlength: [100, 'Nama cluster maksimal 100 karakter'],
    },

    // Nilai centroid kalori | NOT NULL
    centroid_calories: {
      type: Number,
      required: [true, 'Centroid kalori wajib diisi'],
      min: [0, 'Centroid kalori tidak boleh negatif'],
    },

    // Nilai centroid protein | NOT NULL
    centroid_protein: {
      type: Number,
      required: [true, 'Centroid protein wajib diisi'],
      min: [0, 'Centroid protein tidak boleh negatif'],
    },

    // Nilai centroid lemak | NOT NULL
    centroid_fat: {
      type: Number,
      required: [true, 'Centroid lemak wajib diisi'],
      min: [0, 'Centroid lemak tidak boleh negatif'],
    },

    // Nilai centroid karbohidrat | NOT NULL
    centroid_carbo: {
      type: Number,
      required: [true, 'Centroid karbohidrat wajib diisi'],
      min: [0, 'Centroid karbohidrat tidak boleh negatif'],
    },

    // Jumlah K yang digunakan pada run ini | NOT NULL
    k_value: {
      type: Number,
      required: [true, 'Nilai K wajib diisi'],
      min: [2, 'Nilai K minimal 2'],
      max: [10, 'Nilai K maksimal 10'],
    },

    // Jumlah iterasi sampai konvergen | NOT NULL
    iterations: {
      type: Number,
      required: [true, 'Jumlah iterasi wajib diisi'],
      min: [1, 'Iterasi minimal 1'],
    },

    // True jika ini hasil clustering yang sedang aktif | default: false
    is_active: {
      type: Boolean,
      default: false,
    },
  },
  {
    // BRD hanya mendefinisikan created_at untuk clusters (tidak ada updated_at)
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
    collection: 'clusters',
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
// Composite index: satu run_id memiliki banyak cluster_label
clusterSchema.index({ run_id: 1, cluster_label: 1 });
clusterSchema.index({ is_active: 1 });
// Query untuk ambil semua cluster dari satu run
clusterSchema.index({ run_id: 1 });

const Cluster = mongoose.model('Cluster', clusterSchema);

export default Cluster;
