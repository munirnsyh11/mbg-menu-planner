// src/utils/akgCalculator.js
// Kalkulasi pemenuhan standar AKG Nasional
// Sesuai aturan bisnis di BRD: field meets_akg di collection menus

import { AKG_STANDARDS } from './constants.js';
import { roundToDecimal } from './helpers.js';

/**
 * Cek apakah total nutrisi menu memenuhi standar AKG
 * @param {object} totals - { calories, protein, fat, carbohydrate }
 * @returns {boolean} true jika memenuhi semua standar minimum AKG
 */
export const checkMeetsAKG = ({ calories, protein, fat, carbohydrate }) => {
  return (
    calories >= AKG_STANDARDS.CALORIES.min &&
    protein >= AKG_STANDARDS.PROTEIN.min &&
    fat >= AKG_STANDARDS.FAT.min &&
    carbohydrate >= AKG_STANDARDS.CARBOHYDRATE.min
  );
};

/**
 * Hitung persentase pemenuhan AKG
 * @param {object} totals - { calories, protein, fat, carbohydrate }
 * @returns {object} Persentase pemenuhan per nutrisi
 */
export const calculateAKGPercentage = ({ calories, protein, fat, carbohydrate }) => {
  return {
    calories: roundToDecimal((calories / AKG_STANDARDS.CALORIES.min) * 100),
    protein: roundToDecimal((protein / AKG_STANDARDS.PROTEIN.min) * 100),
    fat: roundToDecimal((fat / AKG_STANDARDS.FAT.min) * 100),
    carbohydrate: roundToDecimal((carbohydrate / AKG_STANDARDS.CARBOHYDRATE.min) * 100),
  };
};
