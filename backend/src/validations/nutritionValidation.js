import Joi from 'joi';

const nutrientField = (label) =>
  Joi.number().min(0).precision(2).messages({
    'number.base':  `${label} harus berupa angka`,
    'number.min':   `${label} tidak boleh negatif`,
  });

export const createNutritionSchema = Joi.object({
  food_id: Joi.string().hex().length(24).required().messages({
    'string.hex':     'food_id harus berupa MongoDB ObjectId yang valid',
    'string.length':  'food_id harus 24 karakter',
    'string.empty':   'food_id wajib diisi',
    'any.required':   'food_id wajib diisi',
  }),

  calories:     nutrientField('Kalori').required().messages({ 'any.required': 'Kalori wajib diisi' }),
  protein:      nutrientField('Protein').required().messages({ 'any.required': 'Protein wajib diisi' }),
  fat:          nutrientField('Lemak').required().messages({ 'any.required': 'Lemak wajib diisi' }),
  carbohydrate: nutrientField('Karbohidrat').required().messages({ 'any.required': 'Karbohidrat wajib diisi' }),
  fiber:        nutrientField('Serat').allow(null).optional(),
});

export const updateNutritionSchema = Joi.object({
  calories:     nutrientField('Kalori').optional(),
  protein:      nutrientField('Protein').optional(),
  fat:          nutrientField('Lemak').optional(),
  carbohydrate: nutrientField('Karbohidrat').optional(),
  fiber:        nutrientField('Serat').allow(null).optional(),
}).min(1).messages({
  'object.min': 'Minimal satu field nutrisi harus diisi untuk update',
});

// ─── Query Params: List Nutritions ────────────────────────────────
export const listNutritionQuerySchema = Joi.object({
  page:  Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),

  // Filter berdasarkan range kalori (berguna untuk K-Means preview)
  min_calories: Joi.number().min(0).optional(),
  max_calories: Joi.number().min(0).optional(),

  // Sorting
  sort_by:    Joi.string().valid('calories', 'protein', 'fat', 'carbohydrate', 'created_at').default('created_at'),
  sort_order: Joi.string().valid('asc', 'desc').default('desc'),
});
