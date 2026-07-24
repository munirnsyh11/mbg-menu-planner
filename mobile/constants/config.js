// constants/config.js
// Konfigurasi koneksi ke Backend API (Express + MongoDB)
//
// PENTING: Ganti IP di bawah dengan IP lokal komputer yang menjalankan backend
// (bukan localhost/127.0.0.1, karena HP/emulator tidak bisa mengakses localhost komputer).
// Cara cek IP: `ipconfig` (Windows) atau `ifconfig` (Mac/Linux) -> cari IPv4 address.
// Pastikan backend berjalan di port yang sama (default: 5000) dan HP/emulator
// berada di jaringan WiFi yang sama dengan komputer.

export const CONFIG = {
  API_URL: "http://10.2.9.134:5000/api",

  // Timeout request (ms)
  TIMEOUT: 15000,
};
