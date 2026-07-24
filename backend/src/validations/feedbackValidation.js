import Joi from 'joi';
import { FEEDBACK_STATUS, FEEDBACK_RATING } from '../utils/constants.js';

const statusValues = Object.values(FEEDBACK_STATUS);

// ─── Create Feedback (school_officer) ────────────────────────────
export const createFeedbackSchema = Joi.object({
  menu_id: Joi.string().hex().length(24).required().messages({
    'string.hex':    'menu_id harus berupa MongoDB ObjectId yang valid',
    'string.length': 'menu_id harus 24 karakter',
    'any.required':  'menu_id wajib diisi',
  }),

  rating: Joi.number()
    .integer()
    .min(FEEDBACK_RATING.MIN)
    .max(FEEDBACK_RATING.MAX)
    .required()
    .messages({
      'number.base':    'Rating harus berupa angka',
      'number.integer': 'Rating harus bilangan bulat',
      'number.min':     `Rating minimal ${FEEDBACK_RATING.MIN} (Kurang)`,
      'number.max':     `Rating maksimal ${FEEDBACK_RATING.MAX} (Sangat Baik)`,
      'any.required':   'Rating wajib diisi',
    }),

  comment: Joi.string().trim().max(500).allow('', null).optional().messages({
    'string.max': 'Komentar maksimal 500 karakter',
  }),
});

// ─── Update Status (admin only) ───────────────────────────────────
export const updateFeedbackStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...statusValues)
    .required()
    .messages({
      'any.only':    `Status tidak valid. Pilihan: ${statusValues.join(', ')}`,
      'any.required': 'Status wajib diisi',
    }),
});

// ─── Query: List Feedbacks (admin) ────────────────────────────────
export const listFeedbackQuerySchema = Joi.object({
  page:    Joi.number().integer().min(1).default(1),
  limit:   Joi.number().integer().min(1).max(100).default(10),
  status:  Joi.string().valid(...statusValues, '').optional(),
  menu_id: Joi.string().hex().length(24).optional(),
  sort_order: Joi.string().valid('asc', 'desc').default('desc'),
});

// ─── Query: Status Feedback (school_officer) ──────────────────────
export const feedbackStatusQuerySchema = Joi.object({
  page:  Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});
