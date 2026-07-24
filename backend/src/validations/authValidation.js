import Joi from 'joi';

// ─── Login Validation ─────────────────────────────────────────────
export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Format email tidak valid',
      'string.empty': 'Email wajib diisi',
      'any.required': 'Email wajib diisi',
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password minimal 8 karakter',
      'string.empty': 'Password wajib diisi',
      'any.required': 'Password wajib diisi',
    }),
});
