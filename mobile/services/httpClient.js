// services/httpClient.js
// Axios instance terpusat untuk komunikasi dengan Backend API.
// - Menyisipkan Authorization: Bearer <token> otomatis di setiap request.
// - Menormalkan pesan error dari format ApiResponse backend:
//   { success: false, message: "...", errors?: [...] }

import axios from "axios";
import { CONFIG } from "../constants/config";
import { clearSession, getToken } from "../utils/storage";

export const httpClient = axios.create({
  baseURL: CONFIG.API_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Sesi kadaluarsa / token tidak valid → bersihkan sesi lokal
    if (error?.response?.status === 401) {
      await clearSession();
    }

    const message =
      error?.response?.data?.message ||
      (error?.code === "ECONNABORTED"
        ? "Koneksi ke server timeout. Periksa jaringan Anda."
        : null) ||
      (!error?.response
        ? "Tidak dapat terhubung ke server. Periksa koneksi dan alamat API."
        : "Terjadi kesalahan. Silakan coba lagi.");

    return Promise.reject({
      message,
      status: error?.response?.status ?? null,
      original: error,
    });
  }
);

export default httpClient;
