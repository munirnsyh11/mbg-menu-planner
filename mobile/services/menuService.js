// services/menuService.js
// Integrasi Menus Module — GET /api/menus/today, /api/menus/history, /api/menus/:id

import httpClient from "./httpClient";

// GET /api/menus/today
export const getTodayMenu = async () => {
  const res = await httpClient.get("/menus/today");
  return res.data.data;
};

// GET /api/menus/history?page=&limit=
export const getHistoryMenu = async (page = 1, limit = 10) => {
  const res = await httpClient.get("/menus/history", {
    params: { page, limit },
  });

  return {
    menus: res.data.data,
    pagination: res.data.pagination,
  };
};

// GET /api/menus/:id
export const getMenuDetail = async (id) => {
  const res = await httpClient.get(`/menus/${id}`);
  return res.data.data;
};
