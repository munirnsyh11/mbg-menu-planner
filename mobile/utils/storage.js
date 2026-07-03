// utils/storage.js
// Helper terpusat untuk menyimpan sesi login (token + data user) di device.

import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@mbg_auth_token";
const USER_KEY = "@mbg_auth_user";

export const saveSession = async (token, user) => {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token ?? ""],
    [USER_KEY, JSON.stringify(user ?? null)],
  ]);
};

export const getToken = async () => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = async () => {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveUser = async (user) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user ?? null));
};

export const clearSession = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
};
