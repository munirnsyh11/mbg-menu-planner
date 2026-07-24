// MBG admin app constants
export const MBG_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const FOOD_CATEGORIES = [
  { value: "karbohidrat", label: "Karbohidrat" },
  { value: "protein",     label: "Protein" },
  { value: "sayuran",     label: "Sayuran" },
  { value: "buah",        label: "Buah" },
  { value: "lainnya",     label: "Lainnya" },
];

export const FEEDBACK_STATUSES = [
  { value: "new",       label: "Baru",      tone: "amber" },
  { value: "reviewed",  label: "Direview",  tone: "blue" },
  { value: "resolved",  label: "Selesai",   tone: "green" },
];

export const RATING_LABELS = {
  1: "Kurang",
  2: "Cukup",
  3: "Baik",
  4: "Sangat Baik",
};

export const TOKEN_STORAGE_KEY = "mbg_admin_token";
export const USER_STORAGE_KEY  = "mbg_admin_user";
