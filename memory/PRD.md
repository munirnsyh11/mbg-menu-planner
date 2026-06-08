# MBG Wireframe Studio — PRD

## Original Problem Statement
User requested a web application that, as a first step, generates **mid-fidelity wireframes** for the
**MBG Menu Planner & Auto-Nutrient Balancing System** based on the supplied BRD (`Flow Project MBG.docx`),
and pushes those wireframes directly to Figma so they don't have to be re-drawn manually.

User choices (gathered via `ask_human`):
- Output: HTML/CSS wireframe **AND** a downloadable Figma Plugin (TypeScript/JS)
- Scope: **Web Admin + Mobile** (both)
- Fidelity: **Mid-fidelity**
- Palette: **Greyscale (abu-abu)**

## Architecture
- **Frontend** — React (CRA + craco). Single-page "Wireframe Studio" with sidebar (Web + Mobile lists),
  topbar (Copy HTML / Buka HTML / Semua HTML / Download Plugin Figma), live canvas preview, and an
  embedded Figma import guide. Wireframes are rendered from a JSON spec served by the backend.
- **Backend** — FastAPI. Endpoints under `/api`:
  - `GET /api/` — metadata
  - `GET /api/wireframes` — colors + all screen specs (blocks)
  - `GET /api/wireframes/all/html` — single HTML page with every screen (for html.to.design)
  - `GET /api/wireframes/{screen_id}/html` — standalone HTML per screen
  - `GET /api/figma-plugin/download` — ZIP containing `manifest.json`, `code.js`, `ui.html`, `README.md`
- **Wireframe spec** — `/app/backend/wireframe_spec.py` (8 web + 6 mobile screens). Each screen has
  `id`, `name`, `frame {w,h}` and a list of `blocks` (rect / text) consumed by both the React renderer
  and the Figma plugin.

## Wireframes Delivered (14 total)
**Web Admin (8):** Login · Dashboard · Kelola Makanan (List) · Form Makanan (Add/Edit) ·
Kelola Nutrisi · K-Means Clustering · Buat Menu Harian · Kelola Feedback.

**Mobile (6):** Login · Menu Hari Ini · Detail Nutrisi · Riwayat Menu · Kirim Feedback · Status Feedback.

## Two paths to Figma (no manual re-drawing)
1. **Figma Plugin (recommended)** — User downloads the plugin zip, imports the manifest in Figma
   Desktop (Plugins → Development → Import plugin from manifest), runs *MBG Wireframe Generator* and
   gets every frame auto-created on the canvas.
2. **html.to.design plugin** — User installs the free `html.to.design` plugin in Figma, copies the
   per-screen HTML (Copy HTML / Buka HTML) and pastes it into the plugin to import.

## Implementation Log
- **2026-01-08 (MVP)** — Full MBG Wireframe Studio built:
  - React App + flex layout (sidebar / topbar / canvas / howto panel)
  - FastAPI backend with 5 endpoints
  - Wireframe spec for 14 screens (~650 blocks total)
  - Figma plugin (vanilla JS, self-contained, embedded SPEC)
  - End-to-end testing: 20/20 backend, 100% frontend (iteration_1.json)

## Backlog / Future
- **P1** — Implement the actual MBG application after wireframes approved (CRUD makanan, CRUD nutrisi,
  K-Means clustering, menu generator, mobile feedback flow).
- **P2** — Add high-fidelity skin (brand colors / icons) once wireframes signed off.
- **P2** — Per-screen "Annotate" overlay (notes layer) for stakeholder review.
- **P3** — Auto-export PNG/PDF of all wireframes for offline review.

## Next Action Items
1. Validate wireframes with stakeholder (Admin Dapur MBG + Petugas Sekolah).
2. After sign-off, proceed to implementation of the MBG app (backend models, K-Means service,
   FastAPI CRUD endpoints, React admin UI, React Native mobile UI).
