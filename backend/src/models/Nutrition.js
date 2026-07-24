import mongoose from 'mongoose';

// ─── Schema ───────────────────────────────────────────────────────
const nutritionSchema = new mongoose.Schema(
  {
    // FK → foods._id | NOT NULL | UNIQUE (relasi 1-to-1)
    food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'food_id wajib diisi'],
      unique: true, // BRD: 1-to-1 relationship
    },

    // Kalori per 100 gram (kkal) | NOT NULL | ≥ 0
    calories: {
      type: Number,
      required: [true, 'Kalori wajib diisi'],
      min: [0, 'Kalori tidak boleh negatif'],
    },

    // Protein per 100 gram (gram) | NOT NULL | ≥ 0
    protein: {
      type: Number,
      required: [true, 'Protein wajib diisi'],
      min: [0, 'Protein tidak boleh negatif'],
    },

    // Lemak per 100 gram (gram) | NOT NULL | ≥ 0
    fat: {
      type: Number,
      required: [true, 'Lemak wajib diisi'],
      min: [0, 'Lemak tidak boleh negatif'],
    },

    // Karbohidrat per 100 gram (gram) | NOT NULL | ≥ 0
    carbohydrate: {
      type: Number,
      required: [true, 'Karbohidrat wajib diisi'],
      min: [0, 'Karbohidrat tidak boleh negatif'],
    },

    // Serat per 100 gram (gram) | nullable | ≥ 0
    fiber: {
      type: Number,
      min: [0, 'Serat tidak boleh negatif'],
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'nutritions',
  }
);

nutritionSchema.index({ calories: 1, protein: 1, fat: 1, carbohydrate: 1 });

const Nutrition = mongoose.model('Nutrition', nutritionSchema);

export default Nutrition;
