import axios from "axios";
import { MBG_API_URL, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/constants/mbg";

export const mbgApi = axios.create({
  baseURL: MBG_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

mbgApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

mbgApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      window.dispatchEvent(new Event("mbg:unauthorized"));
    }
    return Promise.reject(err);
  }
);
export const unwrap = (res) => res.data?.data;
export const unwrapList = (res) => ({
  data: res.data?.data ?? [],
  pagination: res.data?.pagination ?? null,
  summary: res.data?.summary ?? null,
});
