import { FOOD_CATEGORIES } from '../utils/constants.js';

const categoryValues = Object.values(FOOD_CATEGORIES);

// ─── Create Food ───────────────────────────────────────────────────
export const createFoodSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.min':    'Nama makanan minimal 2 karakter',
    'string.max':    'Nama makanan maksimal 100 karakter',
    'string.empty':  'Nama makanan wajib diisi',
    'any.required':  'Nama makanan wajib diisi',
  }),

  category: Joi.string()
    .valid(...categoryValues)
    .required()
    .messages({
      'any.only':    `Kategori tidak valid. Pilihan: ${categoryValues.join(', ')}`,
      'string.empty': 'Kategori wajib diisi',
      'any.required': 'Kategori wajib diisi',
    }),

  unit: Joi.string().trim().min(1).max(30).required().messages({
    'string.min':    'Satuan minimal 1 karakter',
    'string.max':    'Satuan maksimal 30 karakter',
    'string.empty':  'Satuan wajib diisi',
    'any.required':  'Satuan wajib diisi',
  }),

  description: Joi.string().trim().max(300).allow('', null).optional().messages({
    'string.max': 'Deskripsi maksimal 300 karakter',
  }),
});

// ─── Update Food ───────────────────────────────────────────────────
// Semua field opsional — hanya field yang dikirim yang diupdate
export const updateFoodSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    'string.min': 'Nama makanan minimal 2 karakter',
    'string.max': 'Nama makanan maksimal 100 karakter',
  }),

  category: Joi.string()
    .valid(...categoryValues)
    .optional()
    .messages({
      'any.only': `Kategori tidak valid. Pilihan: ${categoryValues.join(', ')}`,
    }),

  unit: Joi.string().trim().min(1).max(30).optional().messages({
    'string.min': 'Satuan minimal 1 karakter',
    'string.max': 'Satuan maksimal 30 karakter',
  }),

  description: Joi.string().trim().max(300).allow('', null).optional().messages({
    'string.max': 'Deskripsi maksimal 300 karakter',
  }),
}).min(1).messages({
  'object.min': 'Minimal satu field harus diisi untuk update',
});

// ─── Query Params: List Foods ──────────────────────────────────────
export const listFoodQuerySchema = Joi.object({
  // Pagination
  page:  Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Halaman minimal 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.min': 'Limit minimal 1',
    'number.max': 'Limit maksimal 100',
  }),

  // Search by name (text search)
  search: Joi.string().trim().max(100).allow('').optional(),

  // Filter by category
  category: Joi.string().valid(...categoryValues, '').optional().messages({
    'any.only': `Kategori tidak valid. Pilihan: ${categoryValues.join(', ')}`,
  }),

  // Filter by cluster (untuk K-Means result)
  cluster_label: Joi.number().integer().min(0).optional(),

  // Sorting
  sort_by: Joi.string()
    .valid('name', 'category', 'created_at', 'updated_at')
    .default('created_at'),
  sort_order: Joi.string().valid('asc', 'desc').default('desc'),
});
