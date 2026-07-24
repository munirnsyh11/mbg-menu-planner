import mongoose from 'mongoose';

// ─── Enum Values (sesuai BRD) ─────────────────────────────────────
export const FEEDBACK_STATUS = {
  NEW: 'new',
  REVIEWED: 'reviewed',
  RESOLVED: 'resolved',
};

// ─── Schema ───────────────────────────────────────────────────────
const feedbackSchema = new mongoose.Schema(
  {
    // FK → menus._id | NOT NULL
    menu_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: [true, 'menu_id wajib diisi'],
    },

    // FK → users._id | NOT NULL | pengirim (school_officer)
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user_id wajib diisi'],
    },

    // Rating 1–4 | NOT NULL | BRD: 1=Kurang, 2=Cukup, 3=Baik, 4=Sangat Baik
    rating: {
      type: Number,
      required: [true, 'Rating wajib diisi'],
      min: [1, 'Rating minimal 1 (Kurang)'],
      max: [4, 'Rating maksimal 4 (Sangat Baik)'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating harus berupa bilangan bulat (1–4)',
      },
    },

    // Komentar teks | nullable | maksimal 500 karakter
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Komentar maksimal 500 karakter'],
      default: null,
    },

    // Status feedback | NOT NULL | default: 'new'
    status: {
      type: String,
      required: [true, 'Status wajib diisi'],
      enum: {
        values: Object.values(FEEDBACK_STATUS),
        message: 'Status tidak valid. Gunakan: new, reviewed, atau resolved',
      },
      default: FEEDBACK_STATUS.NEW,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'feedbacks',
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
feedbackSchema.index({ menu_id: 1 });
feedbackSchema.index({ user_id: 1 });
feedbackSchema.index({ status: 1 });
// Composite: filter feedback by status untuk admin
feedbackSchema.index({ status: 1, created_at: -1 });
// Composite: ambil semua feedback milik satu user
feedbackSchema.index({ user_id: 1, created_at: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
