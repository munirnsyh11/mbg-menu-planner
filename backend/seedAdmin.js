

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── Minimal env check (tanpa import env.js agar script berdiri sendiri) ──
const MONGODB_URI     = process.env.MONGODB_URI;
const SALT_ROUNDS     = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
const FORCE_OVERWRITE = process.argv.includes('--force');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI tidak ditemukan di environment variables.');
  console.error('   Pastikan file .env sudah ada dan berisi MONGODB_URI.');
  process.exit(1);
}

// ─── Inline User Schema (agar tidak bergantung pada module path) ──
const userSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true },
    password:    { type: String, required: true },
    role:        { type: String, required: true, enum: ['admin', 'school_officer'] },
    school_name: { type: String, default: null },
    is_active:   { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'users',
  }
);

const User = mongoose.model('User', userSchema);

// ─── Daftar akun yang akan di-seed ────────────────────────────────
const SEED_USERS = [
  {
    name:        'Admin Dapur MBG',
    email:       'admin@mbg.id',
    password:    'admin123',
    role:        'admin',
    school_name: null,
    is_active:   true,
  },
  {
    name:        'Petugas SDN 01 Jakarta',
    email:       'officer@sekolah.sch.id',
    password:    'Officer@2026',
    role:        'school_officer',
    school_name: 'SDN 01 Jakarta',
    is_active:   true,
  },
];

// ─── Main ─────────────────────────────────────────────────────────
const seed = async () => {
  console.log('\n🌱 MBG Menu Planner — Admin Seed Script');
  console.log('═'.repeat(50));

  // Koneksi ke MongoDB
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Terhubung ke MongoDB Atlas\n');
  } catch (err) {
    console.error('❌ Gagal terhubung ke MongoDB:', err.message);
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;
  let updated = 0;

  for (const userData of SEED_USERS) {
    try {
      const existing = await User.findOne({ email: userData.email });

      if (existing && !FORCE_OVERWRITE) {
        console.log(`⏭️  Dilewati   : ${userData.email} (sudah ada, gunakan --force untuk timpa)`);
        skipped++;
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

      if (existing && FORCE_OVERWRITE) {
        // Update akun yang sudah ada
        await User.findByIdAndUpdate(existing._id, {
          name:        userData.name,
          password:    hashedPassword,
          role:        userData.role,
          school_name: userData.school_name,
          is_active:   userData.is_active,
        });
        console.log(`🔄 Diperbarui  : ${userData.email} [${userData.role}]`);
        updated++;
      } else {
        // Buat akun baru
        const user = await User.create({
          ...userData,
          password: hashedPassword,
        });
        console.log(`✅ Dibuat      : ${userData.email} [${userData.role}] — ID: ${user._id}`);
        created++;
      }

    } catch (err) {
      if (err.code === 11000) {
        console.error(`❌ Duplikat    : ${userData.email} — email sudah digunakan`);
      } else {
        console.error(`❌ Error pada  : ${userData.email} —`, err.message);
      }
    }
  }

  // ─── Summary ────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(50));
  console.log(`📊 Summary:`);
  console.log(`   ✅ Dibuat    : ${created} akun`);
  console.log(`   🔄 Diperbarui: ${updated} akun`);
  console.log(`   ⏭️  Dilewati  : ${skipped} akun`);
  console.log('─'.repeat(50));

  if (created > 0 || updated > 0) {
    console.log('\n📋 Kredensial Login:');
    console.log('─'.repeat(50));
    for (const u of SEED_USERS) {
      console.log(`  Role  : ${u.role}`);
      console.log(`  Email : ${u.email}`);
      console.log(`  Pass  : ${u.password}`);
      console.log('');
    }
    console.log('⚠️  Segera ganti password setelah login pertama!');
  }

  console.log('\n✅ Seed selesai.\n');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed gagal:', err);
  process.exit(1);
});
