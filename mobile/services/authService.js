// services/authService.js
// Integrasi Auth Module — POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout

import httpClient from "./httpClient";
import { clearSession, getStoredUser, saveSession } from "../utils/storage";

// POST /api/auth/login
export const login = async (email, password) => {
  const res = await httpClient.post("/auth/login", { email, password });
  const { user, token } = res.data.data;

  await saveSession(token, user);

  return user;
};

// GET /api/auth/me
export const getMe = async () => {
  const res = await httpClient.get("/auth/me");
  const { user } = res.data.data;

  return user;
};

// POST /api/auth/logout
export const logout = async () => {
  try {
    await httpClient.post("/auth/logout");
  } catch (error) {
    // Tetap lanjut hapus sesi lokal walau request logout gagal (mis. tidak ada koneksi)
    console.log("Logout API gagal, sesi lokal tetap dihapus:", error?.message);
  } finally {
    await clearSession();
  }
};

// Ambil user tersimpan di device (dipakai untuk render cepat sebelum refetch)
export const getCachedUser = async () => {
  return getStoredUser();
};
