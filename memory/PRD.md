# MBG Wireframe Studio + Admin Dashboard — PRD

## Original Problem Statement
Bangun aplikasi MBG Menu Planner & Auto-Nutrient Balancing System dalam 3 fase:
1. **Wireframe Studio** — 14 wireframe mid-fi (Web + Mobile) yang bisa diekspor ke Figma.
2. **Mobile v2** — redesign polished mid-fi sesuai referensi user (status bar realistis, 3-tab bottom nav, profil screen).
3. **Admin Dashboard high-fidelity** — modern SaaS admin UI dengan green theme (#16A34A), 7 halaman, terhubung ke API MBG backend yang sudah ready.

## Architecture
- **Frontend** — React 19 + React Router v7 + Tailwind. Dua route group: `/wireframes` (Wireframe Studio) dan `/admin/*` (Admin Dashboard).
- **Wireframe backend** — FastAPI internal di `/api/*` (port 8001) untuk serve wireframe spec & Figma plugin zip.
- **MBG backend** — Eksternal (Node.js), URL via `REACT_APP_MBG_API_URL` (default `http://localhost:5000`). Axios client di `lib/mbg-api.js` dengan JWT bearer interceptor. AuthContext store token di localStorage.

## Admin Dashboard Pages (7)
1. **Login** — Email/password, green theme, eye-toggle password, demo credentials.
2. **Dashboard** — 4 stat cards (Foods/Nutritions/Menus/Feedbacks) + clustering summary + feedback split + menu split + recent menus table.
3. **Foods** — CRUD makanan (search, filter kategori, add/edit/delete modal).
4. **Nutrition** — CRUD nutrisi per 100g, dropdown food selector, locked food selector when editing.
5. **Clustering** — Run K-Means (input K 2-10), cluster cards dengan centroid + food chips.
6. **Menu Planner** — Buat menu harian (multi-food + portion gram), live AKG summary bars, simpan draft / publish menu, detail modal.
7. **Feedback** — Stat cards by status, kartu feedback grid dengan star rating, transitions (new→reviewed→resolved).

## Tech Decisions
- Routing: React Router v7 dengan `RequireAuth` guard untuk semua route `/admin/*` kecuali login.
- State: AuthContext (token + user) + local useState/SWR-ish patterns per page.
- API: `mbgApi` axios instance + interceptor inject bearer token + auto-clear on 401.
- UI: Custom admin design system di `components/admin/ui.js` (Card, StatCard, Button, Badge, Input, Select, Textarea, Label, EmptyState) + `Modal` dengan ESC/backdrop close.
- Style: Tailwind utility-first, green #16A34A primary (emerald-600), slate-50 background, white surfaces, rounded-xl cards.
- Icons: lucide-react.

## Implementation Log
- **2026-01-08 (MVP wireframe)** — 14 wireframe mid-fi + Figma plugin generator.
- **2026-01-08 (Mobile v2)** — Mobile redesign polished mid-fi style (Login/Home/Detail/Feedback/History/Profil).
- **2026-01-10 (Admin Dashboard)** — Full high-fi admin dashboard dengan 7 halaman, AuthContext, mbgApi client, React Router, modal forms.
  - **Lint cleanup** — Refactor useEffect+setState pattern menggunakan `setTimeout(load, 0)` untuk satisfy strict React Compiler `set-state-in-effect` rule. Renamed `ref` prop → `target` di AkgBar.

## Backlog / Future
- **P1** — Pagination UI komponen (data sudah disediakan oleh API).
- **P2** — Skeleton loaders alih-alih "Memuat..." text.
- **P2** — Search debounce yang lebih smart di Foods (currently 250ms).
- **P2** — Charts (recharts) untuk distribusi nutrisi & trend feedback.
- **P3** — Dark mode.

## Next Action Items
1. Jalankan MBG backend di localhost:5000 ATAU deploy ke URL publik, lalu update `REACT_APP_MBG_API_URL` di `/app/frontend/.env`.
2. Seed admin user dengan bcrypt-hash dari password `password123`.
3. Login via `/admin/login` → eksplor semua 7 halaman.
4. Optional: Integrate dengan mobile app (PWA atau React Native) menggunakan API yang sama.

## Test Credentials (perlu di-seed di MBG backend)
- Admin:           `admin@mbg.id` / `password123`
- School Officer:  `officer@sekolah.sch.id` / `password123`

## Routes
- `/` → redirect ke `/admin` (jika logged in) atau `/admin/login`
- `/wireframes` → Wireframe Studio
- `/admin/login` → Login page
- `/admin` → Dashboard (protected)
- `/admin/foods` · `/admin/nutritions` · `/admin/clustering` · `/admin/menus` · `/admin/feedback`
