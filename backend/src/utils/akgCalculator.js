// src/utils/akgCalculator.js
// Kalkulasi pemenuhan standar AKG untuk porsi makan siang MBG
// Sesuai BRD BAB 10.4 — bukan AKG harian penuh
//
// Standar per nutrisi (lihat constants.js AKG_STANDARDS):
//   - Kalori      : 600 - 800 kkal  (punya min DAN max)
//   - Protein     : minimal 15 gram (hanya min)
//   - Lemak       : maksimal 25 gram (hanya max)
//   - Karbohidrat : minimal 60 gram  (hanya min)

import { AKG_STANDARDS } from './constants.js';
import { roundToDecimal } from './helpers.js';

// ─── Helper: Cek satu nutrisi terhadap standar (min dan/atau max) ──
/**
 * Mengecek apakah sebuah nilai memenuhi range standar.
 * Jika standar hanya punya `min`, nilai harus >= min.
 * Jika standar hanya punya `max`, nilai harus <= max.
 * Jika punya keduanya, nilai harus berada di antara min dan max (inklusif).
 *
 * @param {number} value
 * @param {{min?: number, max?: number}} standard
 * @returns {boolean}
 */
const isWithinStandard = (value, standard) => {
  if (standard.min !== undefined && value < standard.min) return false;
  if (standard.max !== undefined && value > standard.max) return false;
  return true;
};

// ─── checkMeetsAKG ────────────────────────────────────────────────
/**
 * Cek apakah total nutrisi satu porsi menu memenuhi standar AKG
 * makan siang sesuai BRD BAB 10.4.
 *
 * Kriteria (SEMUA harus terpenuhi):
 *   - calories     : 600 <= x <= 800
 *   - protein      : x >= 15
 *   - fat          : x <= 25
 *   - carbohydrate : x >= 60
 *
 * @param {object} totals - { calories, protein, fat, carbohydrate }
 * @returns {boolean} true jika SEMUA kriteria terpenuhi
 */
export const checkMeetsAKG = ({ calories, protein, fat, carbohydrate }) => {
  return (
    isWithinStandard(calories,     AKG_STANDARDS.CALORIES) &&
    isWithinStandard(protein,      AKG_STANDARDS.PROTEIN) &&
    isWithinStandard(fat,          AKG_STANDARDS.FAT) &&
    isWithinStandard(carbohydrate, AKG_STANDARDS.CARBOHYDRATE)
  );
};

// ─── calculateAKGPercentage ────────────────────────────────────────
/**
 * Hitung persentase pemenuhan AKG untuk ditampilkan sebagai progress bar.
 *
 * Basis perhitungan persentase:
 *   - Kalori      : persentase terhadap MIN (600 kkal) — progress bar idealnya
 *                   penuh (100%) di titik bawah range, lalu "overflow" >100%
 *                   menandakan mendekati/melewati batas atas (800 kkal)
 *   - Protein     : persentase terhadap MIN (15 gram) — hanya ada batas bawah
 *   - Lemak       : persentase terhadap MAX (25 gram) — semakin rendah semakin baik,
 *                   100% berarti TEPAT di batas maksimal yang diperbolehkan
 *   - Karbohidrat : persentase terhadap MIN (60 gram) — hanya ada batas bawah
 *
 * @param {object} totals - { calories, protein, fat, carbohydrate }
 * @returns {object} Persentase pemenuhan per nutrisi (bisa >100%)
 */
export const calculateAKGPercentage = ({ calories, protein, fat, carbohydrate }) => {
  return {
    calories:     roundToDecimal((calories     / AKG_STANDARDS.CALORIES.min)     * 100),
    protein:      roundToDecimal((protein      / AKG_STANDARDS.PROTEIN.min)      * 100),
    fat:          roundToDecimal((fat          / AKG_STANDARDS.FAT.max)          * 100),
    carbohydrate: roundToDecimal((carbohydrate / AKG_STANDARDS.CARBOHYDRATE.min) * 100),
  };
};
