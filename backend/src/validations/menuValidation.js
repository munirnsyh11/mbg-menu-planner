// src/validations/menuValidation.js
// Joi schema untuk validasi request Menus CRUD

import Joi from 'joi';
import { MENU_STATUS } from '../utils/constants.js';

const statusValues = Object.values(MENU_STATUS);

// ─── Item bahan makanan di dalam menu ─────────────────────────────
const menuItemSchema = Joi.object({
  food_id: Joi.string().hex().length(24).required().messages({
    'string.hex':    'food_id harus berupa MongoDB ObjectId yang valid',
    'string.length': 'food_id harus 24 karakter',
    'any.required':  'food_id wajib diisi',
  }),
  portion_gram: Joi.number().min(0.1).required().messages({
    'number.base':   'Porsi harus berupa angka',
    'number.min':    'Porsi minimal 0.1 gram',
    'any.required':  'Porsi (gram) wajib diisi',
  }),
});

// ─── Create Menu ──────────────────────────────────────────────────
export const createMenuSchema = Joi.object({
  menu_date: Joi.date().iso().required().messages({
    'date.base':     'Tanggal menu tidak valid',
    'date.format':   'Format tanggal harus ISO 8601 (contoh: 2026-06-09)',
    'any.required':  'Tanggal menu wajib diisi',
  }),

  menu_name: Joi.string().trim().min(3).max(150).required().messages({
    'string.min':    'Nama menu minimal 3 karakter',
    'string.max':    'Nama menu maksimal 150 karakter',
    'any.required':  'Nama menu wajib diisi',
  }),

  status: Joi.string()
    .valid(...statusValues)
    .default(MENU_STATUS.DRAFT)
    .messages({
      'any.only': `Status tidak valid. Pilihan: ${statusValues.join(', ')}`,
    }),

  // Minimal satu item makanan
  items: Joi.array()
    .items(menuItemSchema)
    .min(1)
    .required()
    .messages({
      'array.min':    'Menu harus memiliki minimal 1 bahan makanan',
      'any.required': 'Daftar bahan makanan (items) wajib diisi',
    }),
});

// ─── Update Menu ──────────────────────────────────────────────────
export const updateMenuSchema = Joi.object({
  menu_name: Joi.string().trim().min(3).max(150).optional().messages({
    'string.min': 'Nama menu minimal 3 karakter',
    'string.max': 'Nama menu maksimal 150 karakter',
  }),

  status: Joi.string().valid(...statusValues).optional().messages({
    'any.only': `Status tidak valid. Pilihan: ${statusValues.join(', ')}`,
  }),

  // Jika items dikirim, replace seluruh daftar bahan makanan
  items: Joi.array().items(menuItemSchema).min(1).optional().messages({
    'array.min': 'Menu harus memiliki minimal 1 bahan makanan',
  }),
}).min(1).messages({
  'object.min': 'Minimal satu field harus diisi untuk update',
});

// ─── Query Params: List Menus ─────────────────────────────────────
export const listMenuQuerySchema = Joi.object({
  page:  Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),

  status:     Joi.string().valid(...statusValues, '').optional(),
  meets_akg:  Joi.boolean().optional(),
  search:     Joi.string().trim().max(150).allow('').optional(),

  // Filter rentang tanggal
  date_from: Joi.date().iso().optional(),
  date_to:   Joi.date().iso().min(Joi.ref('date_from')).optional().messages({
    'date.min': 'date_to tidak boleh sebelum date_from',
  }),

  sort_order: Joi.string().valid('asc', 'desc').default('desc'),
});
