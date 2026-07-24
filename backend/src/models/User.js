import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

// ─── Enum Values (sesuai BRD) ─────────────────────────────────────
export const USER_ROLES = {
  ADMIN: 'admin',
  SCHOOL_OFFICER: 'school_officer',
};

// ─── Schema ───────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    // Nama lengkap pengguna | NOT NULL
    name: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true,
      minlength: [2, 'Nama minimal 2 karakter'],
      maxlength: [100, 'Nama maksimal 100 karakter'],
    },

    // Email untuk login | UNIQUE, NOT NULL
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Format email tidak valid',
      ],
    },

    // Password ter-hash (bcrypt) | NOT NULL
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
      minlength: [8, 'Password minimal 8 karakter'],
      select: false, // Tidak dikembalikan dalam query default
    },

    // Role pengguna | NOT NULL | Enum: 'admin' | 'school_officer'
    role: {
      type: String,
      required: [true, 'Role wajib diisi'],
      enum: {
        values: Object.values(USER_ROLES),
        message: 'Role tidak valid. Gunakan: admin atau school_officer',
      },
    },

    // Nama sekolah | nullable | hanya untuk school_officer
    school_name: {
      type: String,
      trim: true,
      maxlength: [150, 'Nama sekolah maksimal 150 karakter'],
      default: null,
    },

    // Status akun aktif/nonaktif | default: true
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    // created_at & updated_at otomatis dari timestamps
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    // Nama collection di MongoDB (sesuai BRD)
    collection: 'users',
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
// email sudah di-index otomatis karena unique: true
userSchema.index({ role: 1 });
userSchema.index({ is_active: 1 });

// ─── Pre-save Hook: Hash password sebelum disimpan ─────────────────
userSchema.pre('save', async function (next) {
  // Hanya hash jika field password diubah
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, env.BCRYPT_SALT_ROUNDS);
  next();
});

// ─── Instance Method: Verifikasi password ─────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance Method: Sembunyikan field sensitif ──────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
