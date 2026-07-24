import Feedback from '../models/Feedback.js';
import Menu     from '../models/Menu.js';
import { ApiError }         from '../utils/ApiError.js';
import { FEEDBACK_STATUS, MENU_STATUS } from '../utils/constants.js';

// ─── POST /api/feedback ───────────────────────────────────────────
/**
 * School officer mengirim feedback untuk sebuah menu.
 *
 * Business rules:
 *   1. Menu harus ada dan berstatus 'published'
 *   2. Satu school_officer hanya boleh memberi satu feedback per menu
 *
 * @param {object} body   - { menu_id, rating, comment? }
 * @param {string} userId - req.user.id (school_officer)
 */
export const createFeedbackService = async (body, userId) => {
  const { menu_id, rating, comment } = body;

  // Rule 1: Menu harus ada dan published
  const menu = await Menu.findById(menu_id).lean();
  if (!menu) {
    throw ApiError.notFound('Menu tidak ditemukan');
  }
  if (menu.status !== MENU_STATUS.PUBLISHED) {
    throw ApiError.unprocessable('Feedback hanya dapat diberikan untuk menu yang sudah dipublikasikan.');
  }

  // Rule 2: Satu feedback per user per menu
  const existing = await Feedback.findOne({ menu_id, user_id: userId }).lean();
  if (existing) {
    throw ApiError.conflict('Anda sudah memberikan feedback untuk menu ini.');
  }

  const feedback = await Feedback.create({
    menu_id,
    user_id: userId,
    rating,
    comment: comment || null,
    status:  FEEDBACK_STATUS.NEW,
  });

  await feedback.populate([
    { path: 'menu_id',  select: 'menu_name menu_date' },
    { path: 'user_id',  select: 'name school_name' },
  ]);

  return feedback.toObject();
};

// ─── GET /api/feedback (admin) ───────────────────────────────────
/**
 * Admin melihat semua feedback dengan filter status/menu dan pagination.
 *
 * @param {object} queryParams - { page, limit, status, menu_id, sort_order }
 */
export const getAllFeedbacksService = async (queryParams) => {
  const {
    page       = 1,
    limit      = 10,
    status,
    menu_id,
    sort_order = 'desc',
  } = queryParams;

  const filter = {};
  if (status)  filter.status  = status;
  if (menu_id) filter.menu_id = menu_id;

  const sort = { created_at: sort_order === 'asc' ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [feedbacks, total] = await Promise.all([
    Feedback.find(filter)
      .populate('menu_id',  'menu_name menu_date')
      .populate('user_id',  'name school_name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Feedback.countDocuments(filter),
  ]);

  // Summary counts per status (berguna untuk badge di dashboard admin)
  const [countNew, countReviewed, countResolved] = await Promise.all([
    Feedback.countDocuments({ status: FEEDBACK_STATUS.NEW }),
    Feedback.countDocuments({ status: FEEDBACK_STATUS.REVIEWED }),
    Feedback.countDocuments({ status: FEEDBACK_STATUS.RESOLVED }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    feedbacks,
    summary: {
      new:      countNew,
      reviewed: countReviewed,
      resolved: countResolved,
    },
    pagination: {
      total,
      page:      Number(page),
      limit:     Number(limit),
      totalPages,
      hasNext:   page < totalPages,
      hasPrev:   page > 1,
    },
  };
};

// ─── GET /api/feedback/status (school_officer) ───────────────────
/**
 * School officer melihat status feedback yang pernah mereka kirim.
 * Hanya menampilkan feedback milik user yang sedang login.
 *
 * @param {string} userId      - req.user.id
 * @param {object} queryParams - { page, limit }
 */
export const getMyFeedbackStatusService = async (userId, queryParams) => {
  const { page = 1, limit = 10 } = queryParams;
  const skip = (page - 1) * limit;

  const filter = { user_id: userId };

  const [feedbacks, total] = await Promise.all([
    Feedback.find(filter)
      .populate('menu_id', 'menu_name menu_date')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Feedback.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    feedbacks,
    pagination: {
      total,
      page:      Number(page),
      limit:     Number(limit),
      totalPages,
      hasNext:   page < totalPages,
      hasPrev:   page > 1,
    },
  };
};

// ─── PATCH /api/feedback/:id/status (admin) ──────────────────────
/**
 * Admin mengubah status feedback: new → reviewed → resolved.
 *
 * Business rule: transisi status harus berurutan:
 *   new → reviewed → resolved  (tidak bisa skip atau mundur)
 *
 * @param {string} feedbackId
 * @param {string} newStatus
 */
export const updateFeedbackStatusService = async (feedbackId, newStatus) => {
  const feedback = await Feedback.findById(feedbackId)
    .populate('menu_id', 'menu_name menu_date')
    .populate('user_id', 'name school_name');

  if (!feedback) {
    throw ApiError.notFound('Feedback tidak ditemukan');
  }

  // Validasi transisi status yang diperbolehkan
  const validTransitions = {
    [FEEDBACK_STATUS.NEW]:      [FEEDBACK_STATUS.REVIEWED],
    [FEEDBACK_STATUS.REVIEWED]: [FEEDBACK_STATUS.RESOLVED],
    [FEEDBACK_STATUS.RESOLVED]: [], // status final, tidak bisa diubah lagi
  };

  const allowed = validTransitions[feedback.status] || [];

  if (!allowed.includes(newStatus)) {
    if (feedback.status === FEEDBACK_STATUS.RESOLVED) {
      throw ApiError.unprocessable('Feedback yang sudah resolved tidak dapat diubah statusnya.');
    }
    throw ApiError.unprocessable(
      `Transisi status tidak valid. Status saat ini: "${feedback.status}". ` +
      `Status yang diizinkan: ${allowed.join(', ') || 'tidak ada'}.`
    );
  }

  feedback.status = newStatus;
  await feedback.save();

  return feedback.toObject();
};
