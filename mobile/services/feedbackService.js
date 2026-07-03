// services/feedbackService.js
// Integrasi Feedback Module — POST /api/feedback, GET /api/feedback/status

import httpClient from "./httpClient";

// Rating sesuai BRD: 1=Kurang, 2=Cukup, 3=Baik, 4=Sangat Baik
export const RATING_OPTIONS = [
  { label: "Sangat Baik", value: 4 },
  { label: "Baik", value: 3 },
  { label: "Cukup", value: 2 },
  { label: "Kurang", value: 1 },
];

// POST /api/feedback  Body: { menu_id, rating, comment? }
export const submitFeedback = async ({ menu_id, rating, comment }) => {
  const res = await httpClient.post("/feedback", {
    menu_id,
    rating,
    comment: comment?.trim() ? comment.trim() : undefined,
  });

  return res.data.data;
};

// GET /api/feedback/status?page=&limit=
export const getFeedbackStatus = async (page = 1, limit = 10) => {
  const res = await httpClient.get("/feedback/status", {
    params: { page, limit },
  });

  return {
    feedbacks: res.data.data,
    pagination: res.data.pagination,
  };
};
