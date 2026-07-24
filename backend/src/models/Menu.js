import mongoose from 'mongoose';

// ─── Enum Values (sesuai BRD) ─────────────────────────────────────
export const MENU_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

// ─── Schema ───────────────────────────────────────────────────────
const menuSchema = new mongoose.Schema(
  {
    // Tanggal menu | NOT NULL | UNIQUE (satu menu per hari)
    menu_date: {
      type: Date,
      required: [true, 'Tanggal menu wajib diisi'],
      unique: true,
    },

    // Nama menu (mis: 'Menu Senin 9 Juni 2026') | NOT NULL
    menu_name: {
      type: String,
      required: [true, 'Nama menu wajib diisi'],
      trim: true,
      maxlength: [150, 'Nama menu maksimal 150 karakter'],
    },

    // Status menu | NOT NULL | Enum: 'draft' | 'published'
    status: {
      type: String,
      required: [true, 'Status wajib diisi'],
      enum: {
        values: Object.values(MENU_STATUS),
        message: 'Status tidak valid. Gunakan: draft atau published',
      },
      default: MENU_STATUS.DRAFT,
    },

    // Total kalori menu (dihitung otomatis) | NOT NULL
    total_calories: {
      type: Number,
      required: [true, 'Total kalori wajib diisi'],
      min: [0, 'Total kalori tidak boleh negatif'],
      default: 0,
    },

    // Total protein menu (dihitung otomatis) | NOT NULL
    total_protein: {
      type: Number,
      required: [true, 'Total protein wajib diisi'],
      min: [0, 'Total protein tidak boleh negatif'],
      default: 0,
    },

    // Total lemak menu (dihitung otomatis) | NOT NULL
    total_fat: {
      type: Number,
      required: [true, 'Total lemak wajib diisi'],
      min: [0, 'Total lemak tidak boleh negatif'],
      default: 0,
    },

    // Total karbohidrat menu (dihitung otomatis) | NOT NULL
    total_carbohydrate: {
      type: Number,
      required: [true, 'Total karbohidrat wajib diisi'],
      min: [0, 'Total karbohidrat tidak boleh negatif'],
      default: 0,
    },

    // True jika total nutrisi memenuhi standar AKG | NOT NULL
    meets_akg: {
      type: Boolean,
      required: [true, 'meets_akg wajib diisi'],
      default: false,
    },

    // FK → users._id | NOT NULL | admin pembuat menu
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
    collection: 'menus',
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
// menu_date sudah di-index karena unique: true
menuSchema.index({ status: 1 });
menuSchema.index({ status: 1, menu_date: -1 }); // Query menu published terbaru
menuSchema.index({ created_by: 1 });
menuSchema.index({ menu_date: -1 }); // Sorting riwayat menu

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
