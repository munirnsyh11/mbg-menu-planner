// src/utils/helpers.js
// Helper functions umum

/**
 * Hitung kontribusi nutrisi berdasarkan porsi
 * @param {number} valuesPer100g - Nilai nutrisi per 100g
 * @param {number} portionGram - Berat porsi dalam gram
 * @returns {number} Nilai nutrisi untuk porsi tersebut
 */
export const calculateNutrientContribution = (valuesPer100g, portionGram) => {
  return parseFloat(((valuesPer100g * portionGram) / 100).toFixed(2));
};

/**
 * Bulatkan angka ke desimal tertentu
 */
export const roundToDecimal = (num, decimals = 2) => {
  return parseFloat(num.toFixed(decimals));
};

/**
 * Konversi array of objects menjadi object dengan key tertentu
 */
export const arrayToMap = (arr, key) => {
  return arr.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {});
};
