

// Roles pengguna
export const ROLES = {
  ADMIN: 'admin',
  SCHOOL_OFFICER: 'school_officer',
};

// Kategori makanan (sesuai BRD field: category di collection foods)
export const FOOD_CATEGORIES = {
  KARBOHIDRAT: 'karbohidrat',
  PROTEIN: 'protein',
  SAYURAN: 'sayuran',
  BUAH: 'buah',
  LAINNYA: 'lainnya',
};

// Status menu (sesuai BRD field: status di collection menus)
export const MENU_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

// Status feedback (sesuai BRD field: status di collection feedbacks)
export const FEEDBACK_STATUS = {
  NEW: 'new',
  REVIEWED: 'reviewed',
  RESOLVED: 'resolved',
};

// Rating feedback (sesuai BRD: 1-4)
export const FEEDBACK_RATING = {
  MIN: 1,
  MAX: 4,
};

// K-Means default
export const KMEANS_DEFAULTS = {
  K: 3,
  MAX_ITERATIONS: 100,
  MIN_DATA_POINTS: 5,
};

// Standar AKG untuk porsi makan siang anak usia sekolah (BRD BAB 10.4)
// Acuan: ±30% dari AKG harian — BUKAN AKG harian penuh
export const AKG_STANDARDS = {
  CALORIES:     { min: 600, max: 800 },  // kkal/porsi
  PROTEIN:      { min: 15 },             // gram/porsi 
  FAT:          { max: 25 },             // gram/porsi 
  CARBOHYDRATE: { min: 60 },             // gram/porsi 
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};
