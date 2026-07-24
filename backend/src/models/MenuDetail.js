import mongoose from 'mongoose';

// ─── Schema ───────────────────────────────────────────────────────
const menuDetailSchema = new mongoose.Schema(
  {
    // FK → menus._id | NOT NULL
    menu_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: [true, 'menu_id wajib diisi'],
    },

    // FK → foods._id | NOT NULL
    food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'food_id wajib diisi'],
    },

    // Berat porsi bahan makanan dalam gram | NOT NULL | > 0
    portion_gram: {
      type: Number,
      required: [true, 'Porsi (gram) wajib diisi'],
      min: [0.1, 'Porsi harus lebih dari 0 gram'],
    },

    // Kontribusi kalori berdasarkan porsi | NOT NULL
    calories_contrib: {
      type: Number,
      required: [true, 'Kontribusi kalori wajib diisi'],
      min: [0, 'Kontribusi kalori tidak boleh negatif'],
    },

    // Kontribusi protein berdasarkan porsi | NOT NULL
    protein_contrib: {
      type: Number,
      required: [true, 'Kontribusi protein wajib diisi'],
      min: [0, 'Kontribusi protein tidak boleh negatif'],
    },

    // Kontribusi lemak berdasarkan porsi | NOT NULL
    fat_contrib: {
      type: Number,
      required: [true, 'Kontribusi lemak wajib diisi'],
      min: [0, 'Kontribusi lemak tidak boleh negatif'],
    },

    // Kontribusi karbohidrat berdasarkan porsi | NOT NULL
    carbo_contrib: {
      type: Number,
      required: [true, 'Kontribusi karbohidrat wajib diisi'],
      min: [0, 'Kontribusi karbohidrat tidak boleh negatif'],
    },
  },
  {
    // BRD tidak mendefinisikan timestamps untuk menu_details
    timestamps: false,
    collection: 'menu_details',
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
// Composite index utama: ambil semua detail untuk satu menu
menuDetailSchema.index({ menu_id: 1 });
menuDetailSchema.index({ food_id: 1 });
// Compound: cegah duplikat item yang sama dalam satu menu
menuDetailSchema.index({ menu_id: 1, food_id: 1 }, { unique: true });

const MenuDetail = mongoose.model('MenuDetail', menuDetailSchema);

export default MenuDetail;
