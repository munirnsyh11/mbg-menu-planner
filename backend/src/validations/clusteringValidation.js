import Joi from 'joi';
import { KMEANS_DEFAULTS } from '../utils/constants.js';

// ─── Run K-Means ──────────────────────────────────────────────────
export const runKMeansSchema = Joi.object({
  k: Joi.number()
    .integer()
    .min(2)
    .max(10)
    .default(KMEANS_DEFAULTS.K)
    .messages({
      'number.base':    'Nilai K harus berupa angka',
      'number.integer': 'Nilai K harus bilangan bulat',
      'number.min':     'Nilai K minimal 2',
      'number.max':     'Nilai K maksimal 10',
    }),
});

// ─── Query: History ───────────────────────────────────────────────
export const clusteringHistoryQuerySchema = Joi.object({
  page:  Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});
