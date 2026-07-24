import mongoose from 'mongoose';

// ─── Enum Values (sesuai BRD) ─────────────────────────────────────
export const FOOD_CATEGORIES = {
  KARBOHIDRAT: 'karbohidrat',
  PROTEIN: 'protein',
  SAYURAN: 'sayuran',
  BUAH: 'buah',
  LAINNYA: 'lainnya',
};

// ─── Schema ───────────────────────────────────────────────────────
const foodSchema = new mongoose.Schema(
  {
    // Nama bahan makanan | NOT NULL
    name: {
      type: String,
      required: [true, 'Nama makanan wajib diisi'],
      trim: true,
      minlength: [2, 'Nama makanan minimal 2 karakter'],
      maxlength: [100, 'Nama makanan maksimal 100 karakter'],
    },

    // Kategori makanan | NOT NULL | Enum
    category: {
      type: String,
      required: [true, 'Kategori wajib diisi'],
      enum: {
        values: Object.values(FOOD_CATEGORIES),
        message:
          'Kategori tidak valid. Gunakan: karbohidrat, protein, sayuran, buah, atau lainnya',
      },
    },

    // Satuan (gram, ml, butir, dsb.) | NOT NULL
    unit: {
      type: String,
      required: [true, 'Satuan wajib diisi'],
      trim: true,
      maxlength: [30, 'Satuan maksimal 30 karakter'],
    },

    // Deskripsi singkat | nullable
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Deskripsi maksimal 300 karakter'],
      default: null,
    },

    // FK → clusters._id | nullable | diisi setelah K-Means dijalankan
    cluster_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cluster',
      default: null,
    },

    // Label numerik cluster (0, 1, 2, ...) | nullable
    cluster_label: {
      type: Number,
      default: null,
      min: [0, 'Cluster label tidak boleh negatif'],
    },

    // FK → users._id | NOT NULL | admin yang menambahkan
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'created_by wajib diisi'],
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'foods',
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
foodSchema.index({ category: 1 });
foodSchema.index({ cluster_id: 1 });
foodSchema.index({ cluster_label: 1 });
foodSchema.index({ created_by: 1 });
// Index teks untuk pencarian nama makanan
foodSchema.index({ name: 'text' });

const Food = mongoose.model('Food', foodSchema);

export default Food;
