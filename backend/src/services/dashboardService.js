import Food      from '../models/Food.js';
import Nutrition from '../models/Nutrition.js';
import Menu      from '../models/Menu.js';
import Feedback  from '../models/Feedback.js';
import Cluster   from '../models/Cluster.js';

import { FEEDBACK_STATUS, MENU_STATUS } from '../utils/constants.js';

// ─── GET /api/dashboard ───────────────────────────────────────────
/**
 * Kumpulkan semua statistik dashboard dalam satu call.
 * Seluruh query dijalankan paralel via Promise.all untuk performa optimal.
 *
 * @returns {object} Ringkasan lengkap dashboard
 */
export const getDashboardService = async () => {

  // ─── Jalankan semua query secara paralel ──────────────────────
  const [
    total_foods,
    total_nutritions,
    total_menus,
    total_feedbacks,

    total_feedback_new,
    total_feedback_reviewed,
    total_feedback_resolved,

    total_menus_published,
    total_menus_draft,

    active_cluster_count,
    latestRunDoc,
  ] = await Promise.all([
    // Counts dasar
    Food.countDocuments(),
    Nutrition.countDocuments(),
    Menu.countDocuments(),
    Feedback.countDocuments(),

    // Feedback per status
    Feedback.countDocuments({ status: FEEDBACK_STATUS.NEW }),
    Feedback.countDocuments({ status: FEEDBACK_STATUS.REVIEWED }),
    Feedback.countDocuments({ status: FEEDBACK_STATUS.RESOLVED }),

    // Menu per status
    Menu.countDocuments({ status: MENU_STATUS.PUBLISHED }),
    Menu.countDocuments({ status: MENU_STATUS.DRAFT }),

    // Clustering aktif: count total + ambil metadata run terbaru
    Cluster.countDocuments({ is_active: true }),
    Cluster.findOne({ is_active: true })
      .select('run_id created_at')
      .sort({ created_at: -1 })
      .lean(),
  ]);

  // ─── Susun clustering summary ─────────────────────────────────
  const clusteringSummary = {
    active_cluster_count,
    latest_run_id:         latestRunDoc?.run_id    || null,
    latest_run_date:       latestRunDoc?.created_at || null,
    has_active_clustering: active_cluster_count > 0,
  };

  // ─── Return payload dashboard ─────────────────────────────────
  return {
    totals: {
      total_foods,
      total_nutritions,
      total_menus,
      total_feedbacks,
    },
    feedback_summary: {
      new:      total_feedback_new,
      reviewed: total_feedback_reviewed,
      resolved: total_feedback_resolved,
    },
    menu_summary: {
      total_published: total_menus_published,
      total_draft:     total_menus_draft,
    },
    clustering_summary: clusteringSummary,
  };
};
