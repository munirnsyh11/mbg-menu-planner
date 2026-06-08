"""
Wireframe specification for MBG Menu Planner & Auto-Nutrient Balancing System.
Used by the Figma Plugin and the HTML exporter.
"""

# Greyscale tokens (mid-fidelity wireframe palette)
COLORS = {
    "bg":            "#F4F4F5",  # canvas background
    "surface":       "#FFFFFF",
    "border":        "#D4D4D8",
    "border_strong": "#A1A1AA",
    "placeholder":   "#E4E4E7",
    "placeholder_d": "#D4D4D8",
    "text_strong":   "#18181B",
    "text":          "#3F3F46",
    "text_muted":    "#71717A",
    "accent":        "#52525B",
}

WEB_FRAME = {"w": 1440, "h": 900}
MOBILE_FRAME = {"w": 390, "h": 844}

# Each screen has a list of "blocks" describing rectangles/text used by both
# the React renderer and the Figma Plugin to materialize geometry.
# Block schema:
#   type: rect | text
#   x, y, w, h
#   fill: COLORS key (rect only)
#   stroke: COLORS key (rect only, optional)
#   radius: corner radius (rect only, optional)
#   text: string
#   size: font size (text only)
#   weight: "regular" | "medium" | "bold"
#   color: COLORS key (text only)
#   align: "left" | "center" | "right" (text only)

WEB_SCREENS = [
    {
        "id": "web-login",
        "name": "Web · Login",
        "frame": WEB_FRAME,
        "blocks": [
            # Page background already from frame.fill
            # Centered card
            {"type": "rect", "x": 520, "y": 220, "w": 400, "h": 460, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "rect", "x": 660, "y": 260, "w": 120, "h": 40, "fill": "placeholder", "radius": 6},
            {"type": "text", "x": 540, "y": 326, "w": 360, "h": 28, "text": "MBG Menu Planner", "size": 22, "weight": "bold", "color": "text_strong", "align": "center"},
            {"type": "text", "x": 540, "y": 358, "w": 360, "h": 20, "text": "Admin Dapur · Masuk ke akun Anda", "size": 14, "weight": "regular", "color": "text_muted", "align": "center"},
            {"type": "text", "x": 560, "y": 410, "w": 320, "h": 16, "text": "Email", "size": 12, "weight": "medium", "color": "text"},
            {"type": "rect", "x": 560, "y": 432, "w": 320, "h": 44, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 560, "y": 498, "w": 320, "h": 16, "text": "Password", "size": 12, "weight": "medium", "color": "text"},
            {"type": "rect", "x": 560, "y": 520, "w": 320, "h": 44, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "rect", "x": 560, "y": 596, "w": 320, "h": 44, "fill": "text_strong", "radius": 8},
            {"type": "text", "x": 560, "y": 608, "w": 320, "h": 20, "text": "Masuk", "size": 14, "weight": "medium", "color": "surface", "align": "center"},
            {"type": "text", "x": 540, "y": 652, "w": 360, "h": 16, "text": "Lupa password?", "size": 12, "weight": "regular", "color": "text_muted", "align": "center"},
        ],
    },
    {
        "id": "web-dashboard",
        "name": "Web · Dashboard",
        "frame": WEB_FRAME,
        "blocks": [
            # Sidebar
            {"type": "rect", "x": 0, "y": 0, "w": 240, "h": 900, "fill": "surface", "stroke": "border"},
            {"type": "rect", "x": 24, "y": 24, "w": 120, "h": 32, "fill": "placeholder", "radius": 6},
            {"type": "rect", "x": 16, "y": 88, "w": 208, "h": 40, "fill": "placeholder_d", "radius": 8},
            {"type": "text", "x": 36, "y": 100, "w": 180, "h": 16, "text": "Dashboard", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 16, "y": 136, "w": 208, "h": 40, "fill": "surface", "radius": 8},
            {"type": "text", "x": 36, "y": 148, "w": 180, "h": 16, "text": "Kelola Makanan", "size": 13, "color": "text"},
            {"type": "rect", "x": 16, "y": 184, "w": 208, "h": 40, "fill": "surface", "radius": 8},
            {"type": "text", "x": 36, "y": 196, "w": 180, "h": 16, "text": "Kelola Nutrisi", "size": 13, "color": "text"},
            {"type": "rect", "x": 16, "y": 232, "w": 208, "h": 40, "fill": "surface", "radius": 8},
            {"type": "text", "x": 36, "y": 244, "w": 180, "h": 16, "text": "K-Means Clustering", "size": 13, "color": "text"},
            {"type": "rect", "x": 16, "y": 280, "w": 208, "h": 40, "fill": "surface", "radius": 8},
            {"type": "text", "x": 36, "y": 292, "w": 180, "h": 16, "text": "Menu Harian", "size": 13, "color": "text"},
            {"type": "rect", "x": 16, "y": 328, "w": 208, "h": 40, "fill": "surface", "radius": 8},
            {"type": "text", "x": 36, "y": 340, "w": 180, "h": 16, "text": "Feedback", "size": 13, "color": "text"},
            # Topbar
            {"type": "rect", "x": 240, "y": 0, "w": 1200, "h": 64, "fill": "surface", "stroke": "border"},
            {"type": "text", "x": 272, "y": 22, "w": 400, "h": 20, "text": "Dashboard", "size": 16, "weight": "bold", "color": "text_strong"},
            {"type": "rect", "x": 1336, "y": 16, "w": 88, "h": 32, "fill": "placeholder", "radius": 16},
            # Stat cards
            {"type": "rect", "x": 272, "y": 96, "w": 280, "h": 120, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 288, "y": 116, "w": 248, "h": 16, "text": "Total Makanan", "size": 12, "color": "text_muted"},
            {"type": "text", "x": 288, "y": 144, "w": 248, "h": 32, "text": "128", "size": 28, "weight": "bold", "color": "text_strong"},
            {"type": "rect", "x": 568, "y": 96, "w": 280, "h": 120, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 584, "y": 116, "w": 248, "h": 16, "text": "Cluster Aktif", "size": 12, "color": "text_muted"},
            {"type": "text", "x": 584, "y": 144, "w": 248, "h": 32, "text": "5", "size": 28, "weight": "bold", "color": "text_strong"},
            {"type": "rect", "x": 864, "y": 96, "w": 280, "h": 120, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 880, "y": 116, "w": 248, "h": 16, "text": "Menu Tersusun", "size": 12, "color": "text_muted"},
            {"type": "text", "x": 880, "y": 144, "w": 248, "h": 32, "text": "42", "size": 28, "weight": "bold", "color": "text_strong"},
            {"type": "rect", "x": 1160, "y": 96, "w": 264, "h": 120, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 1176, "y": 116, "w": 232, "h": 16, "text": "Feedback Baru", "size": 12, "color": "text_muted"},
            {"type": "text", "x": 1176, "y": 144, "w": 232, "h": 32, "text": "12", "size": 28, "weight": "bold", "color": "text_strong"},
            # Chart placeholder
            {"type": "rect", "x": 272, "y": 240, "w": 720, "h": 320, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 288, "y": 260, "w": 400, "h": 20, "text": "Distribusi Nutrisi Bulanan", "size": 14, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 288, "y": 296, "w": 688, "h": 244, "fill": "placeholder", "radius": 8},
            # Recent menus
            {"type": "rect", "x": 1008, "y": 240, "w": 416, "h": 320, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 1024, "y": 260, "w": 400, "h": 20, "text": "Menu Terbaru", "size": 14, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 1024, "y": 296, "w": 384, "h": 56, "fill": "placeholder", "radius": 8},
            {"type": "rect", "x": 1024, "y": 364, "w": 384, "h": 56, "fill": "placeholder", "radius": 8},
            {"type": "rect", "x": 1024, "y": 432, "w": 384, "h": 56, "fill": "placeholder", "radius": 8},
            {"type": "rect", "x": 1024, "y": 500, "w": 384, "h": 40, "fill": "placeholder", "radius": 8},
        ],
    },
    {
        "id": "web-foods-list",
        "name": "Web · Kelola Makanan (List)",
        "frame": WEB_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 240, "h": 900, "fill": "surface", "stroke": "border"},
            {"type": "rect", "x": 16, "y": 136, "w": 208, "h": 40, "fill": "placeholder_d", "radius": 8},
            {"type": "text", "x": 36, "y": 148, "w": 180, "h": 16, "text": "Kelola Makanan", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 240, "y": 0, "w": 1200, "h": 64, "fill": "surface", "stroke": "border"},
            {"type": "text", "x": 272, "y": 22, "w": 400, "h": 20, "text": "Kelola Makanan", "size": 16, "weight": "bold", "color": "text_strong"},
            {"type": "rect", "x": 272, "y": 96, "w": 720, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 288, "y": 108, "w": 400, "h": 16, "text": "Cari makanan...", "size": 13, "color": "text_muted"},
            {"type": "rect", "x": 1008, "y": 96, "w": 160, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 1024, "y": 108, "w": 140, "h": 16, "text": "Kategori ▾", "size": 13, "color": "text"},
            {"type": "rect", "x": 1284, "y": 96, "w": 140, "h": 40, "fill": "text_strong", "radius": 8},
            {"type": "text", "x": 1284, "y": 108, "w": 140, "h": 16, "text": "+ Tambah", "size": 13, "weight": "medium", "color": "surface", "align": "center"},
            # Table
            {"type": "rect", "x": 272, "y": 160, "w": 1152, "h": 56, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 288, "y": 180, "w": 240, "h": 16, "text": "Nama Makanan", "size": 12, "weight": "medium", "color": "text"},
            {"type": "text", "x": 568, "y": 180, "w": 160, "h": 16, "text": "Kategori", "size": 12, "weight": "medium", "color": "text"},
            {"type": "text", "x": 768, "y": 180, "w": 120, "h": 16, "text": "Kalori", "size": 12, "weight": "medium", "color": "text"},
            {"type": "text", "x": 928, "y": 180, "w": 120, "h": 16, "text": "Protein", "size": 12, "weight": "medium", "color": "text"},
            {"type": "text", "x": 1088, "y": 180, "w": 120, "h": 16, "text": "Cluster", "size": 12, "weight": "medium", "color": "text"},
            {"type": "text", "x": 1280, "y": 180, "w": 120, "h": 16, "text": "Aksi", "size": 12, "weight": "medium", "color": "text"},
        ]
        + [
            block
            for i in range(8)
            for block in [
                {"type": "rect", "x": 272, "y": 232 + i * 56, "w": 1152, "h": 1, "fill": "border"},
                {"type": "rect", "x": 288, "y": 248 + i * 56, "w": 200, "h": 16, "fill": "placeholder", "radius": 4},
                {"type": "rect", "x": 568, "y": 248 + i * 56, "w": 120, "h": 16, "fill": "placeholder", "radius": 4},
                {"type": "rect", "x": 768, "y": 248 + i * 56, "w": 80, "h": 16, "fill": "placeholder", "radius": 4},
                {"type": "rect", "x": 928, "y": 248 + i * 56, "w": 80, "h": 16, "fill": "placeholder", "radius": 4},
                {"type": "rect", "x": 1088, "y": 248 + i * 56, "w": 80, "h": 20, "fill": "placeholder_d", "radius": 10},
                {"type": "rect", "x": 1280, "y": 248 + i * 56, "w": 60, "h": 16, "fill": "placeholder", "radius": 4},
                {"type": "rect", "x": 1348, "y": 248 + i * 56, "w": 60, "h": 16, "fill": "placeholder", "radius": 4},
            ]
        ]
        + [
            {"type": "rect", "x": 272, "y": 720, "w": 280, "h": 36, "fill": "surface", "stroke": "border", "radius": 6},
            {"type": "text", "x": 272, "y": 730, "w": 280, "h": 16, "text": "Menampilkan 1–8 dari 128", "size": 12, "color": "text_muted", "align": "center"},
            {"type": "rect", "x": 1224, "y": 720, "w": 200, "h": 36, "fill": "surface", "stroke": "border", "radius": 6},
            {"type": "text", "x": 1224, "y": 730, "w": 200, "h": 16, "text": "‹  1  2  3  4  ›", "size": 12, "color": "text", "align": "center"},
        ],
    },
    {
        "id": "web-foods-form",
        "name": "Web · Form Makanan (Add/Edit)",
        "frame": WEB_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 240, "h": 900, "fill": "surface", "stroke": "border"},
            {"type": "rect", "x": 16, "y": 136, "w": 208, "h": 40, "fill": "placeholder_d", "radius": 8},
            {"type": "text", "x": 36, "y": 148, "w": 180, "h": 16, "text": "Kelola Makanan", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 240, "y": 0, "w": 1200, "h": 64, "fill": "surface", "stroke": "border"},
            {"type": "text", "x": 272, "y": 22, "w": 500, "h": 20, "text": "Tambah Makanan Baru", "size": 16, "weight": "bold", "color": "text_strong"},
            # Form card
            {"type": "rect", "x": 272, "y": 96, "w": 800, "h": 600, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 304, "y": 128, "w": 400, "h": 20, "text": "Informasi Dasar", "size": 14, "weight": "medium", "color": "text_strong"},
            {"type": "text", "x": 304, "y": 168, "w": 360, "h": 14, "text": "Nama Makanan", "size": 12, "color": "text"},
            {"type": "rect", "x": 304, "y": 188, "w": 360, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 680, "y": 168, "w": 360, "h": 14, "text": "Kategori", "size": 12, "color": "text"},
            {"type": "rect", "x": 680, "y": 188, "w": 360, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 304, "y": 248, "w": 736, "h": 14, "text": "Deskripsi", "size": 12, "color": "text"},
            {"type": "rect", "x": 304, "y": 268, "w": 736, "h": 80, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "rect", "x": 304, "y": 368, "w": 736, "h": 1, "fill": "border"},
            {"type": "text", "x": 304, "y": 388, "w": 400, "h": 20, "text": "Kandungan Nutrisi (per 100g)", "size": 14, "weight": "medium", "color": "text_strong"},
            {"type": "text", "x": 304, "y": 428, "w": 160, "h": 14, "text": "Kalori (kcal)", "size": 12, "color": "text"},
            {"type": "rect", "x": 304, "y": 448, "w": 160, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 488, "y": 428, "w": 160, "h": 14, "text": "Protein (g)", "size": 12, "color": "text"},
            {"type": "rect", "x": 488, "y": 448, "w": 160, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 672, "y": 428, "w": 160, "h": 14, "text": "Lemak (g)", "size": 12, "color": "text"},
            {"type": "rect", "x": 672, "y": 448, "w": 160, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 856, "y": 428, "w": 184, "h": 14, "text": "Karbohidrat (g)", "size": 12, "color": "text"},
            {"type": "rect", "x": 856, "y": 448, "w": 184, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            # Actions
            {"type": "rect", "x": 800, "y": 632, "w": 120, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 800, "y": 644, "w": 120, "h": 16, "text": "Batal", "size": 13, "color": "text", "align": "center"},
            {"type": "rect", "x": 936, "y": 632, "w": 120, "h": 40, "fill": "text_strong", "radius": 8},
            {"type": "text", "x": 936, "y": 644, "w": 120, "h": 16, "text": "Simpan", "size": 13, "weight": "medium", "color": "surface", "align": "center"},
            # Side preview
            {"type": "rect", "x": 1104, "y": 96, "w": 320, "h": 320, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 1120, "y": 116, "w": 280, "h": 16, "text": "Preview", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 1120, "y": 144, "w": 288, "h": 160, "fill": "placeholder", "radius": 8},
            {"type": "rect", "x": 1120, "y": 320, "w": 200, "h": 16, "fill": "placeholder", "radius": 4},
            {"type": "rect", "x": 1120, "y": 348, "w": 280, "h": 12, "fill": "placeholder", "radius": 4},
            {"type": "rect", "x": 1120, "y": 372, "w": 240, "h": 12, "fill": "placeholder", "radius": 4},
        ],
    },
    {
        "id": "web-nutrition",
        "name": "Web · Kelola Nutrisi",
        "frame": WEB_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 240, "h": 900, "fill": "surface", "stroke": "border"},
            {"type": "rect", "x": 16, "y": 184, "w": 208, "h": 40, "fill": "placeholder_d", "radius": 8},
            {"type": "text", "x": 36, "y": 196, "w": 180, "h": 16, "text": "Kelola Nutrisi", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 240, "y": 0, "w": 1200, "h": 64, "fill": "surface", "stroke": "border"},
            {"type": "text", "x": 272, "y": 22, "w": 500, "h": 20, "text": "Kelola Data Nutrisi", "size": 16, "weight": "bold", "color": "text_strong"},
            # Left panel - food list
            {"type": "rect", "x": 272, "y": 96, "w": 360, "h": 720, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "rect", "x": 288, "y": 112, "w": 328, "h": 36, "fill": "surface", "stroke": "border", "radius": 6},
            {"type": "text", "x": 304, "y": 122, "w": 312, "h": 16, "text": "Cari makanan...", "size": 12, "color": "text_muted"},
        ]
        + [
            block
            for i in range(10)
            for block in [
                {"type": "rect", "x": 288, "y": 164 + i * 56, "w": 328, "h": 48, "fill": "placeholder" if i == 2 else "surface", "stroke": "border", "radius": 8},
                {"type": "rect", "x": 304, "y": 180 + i * 56, "w": 160, "h": 14, "fill": "placeholder_d", "radius": 4},
                {"type": "rect", "x": 304, "y": 202 + i * 56, "w": 120, "h": 10, "fill": "placeholder_d", "radius": 4},
            ]
        ]
        + [
            # Right panel - nutrition editor
            {"type": "rect", "x": 656, "y": 96, "w": 768, "h": 720, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 688, "y": 128, "w": 400, "h": 20, "text": "Nasi Goreng Telur", "size": 18, "weight": "bold", "color": "text_strong"},
            {"type": "text", "x": 688, "y": 156, "w": 400, "h": 14, "text": "Kategori: Makanan Pokok", "size": 12, "color": "text_muted"},
            {"type": "rect", "x": 688, "y": 192, "w": 704, "h": 1, "fill": "border"},
            {"type": "text", "x": 688, "y": 216, "w": 400, "h": 20, "text": "Komposisi Nutrisi (per porsi)", "size": 14, "weight": "medium", "color": "text_strong"},
            # 4 input rows
            {"type": "text", "x": 688, "y": 260, "w": 320, "h": 14, "text": "Kalori (kcal)", "size": 12, "color": "text"},
            {"type": "rect", "x": 688, "y": 280, "w": 320, "h": 44, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "rect", "x": 1024, "y": 280, "w": 368, "h": 44, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 688, "y": 344, "w": 320, "h": 14, "text": "Protein (g)", "size": 12, "color": "text"},
            {"type": "rect", "x": 688, "y": 364, "w": 320, "h": 44, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "rect", "x": 1024, "y": 364, "w": 368, "h": 44, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 688, "y": 428, "w": 320, "h": 14, "text": "Lemak (g)", "size": 12, "color": "text"},
            {"type": "rect", "x": 688, "y": 448, "w": 320, "h": 44, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "rect", "x": 1024, "y": 448, "w": 368, "h": 44, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 688, "y": 512, "w": 320, "h": 14, "text": "Karbohidrat (g)", "size": 12, "color": "text"},
            {"type": "rect", "x": 688, "y": 532, "w": 320, "h": 44, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "rect", "x": 1024, "y": 532, "w": 368, "h": 44, "fill": "placeholder", "radius": 8},
            # actions
            {"type": "rect", "x": 1152, "y": 752, "w": 120, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 1152, "y": 764, "w": 120, "h": 16, "text": "Reset", "size": 13, "color": "text", "align": "center"},
            {"type": "rect", "x": 1280, "y": 752, "w": 120, "h": 40, "fill": "text_strong", "radius": 8},
            {"type": "text", "x": 1280, "y": 764, "w": 120, "h": 16, "text": "Simpan", "size": 13, "weight": "medium", "color": "surface", "align": "center"},
        ],
    },
    {
        "id": "web-kmeans",
        "name": "Web · K-Means Clustering",
        "frame": WEB_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 240, "h": 900, "fill": "surface", "stroke": "border"},
            {"type": "rect", "x": 16, "y": 232, "w": 208, "h": 40, "fill": "placeholder_d", "radius": 8},
            {"type": "text", "x": 36, "y": 244, "w": 180, "h": 16, "text": "K-Means Clustering", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 240, "y": 0, "w": 1200, "h": 64, "fill": "surface", "stroke": "border"},
            {"type": "text", "x": 272, "y": 22, "w": 500, "h": 20, "text": "Clustering Makanan", "size": 16, "weight": "bold", "color": "text_strong"},
            # Parameters card
            {"type": "rect", "x": 272, "y": 96, "w": 1152, "h": 120, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 304, "y": 120, "w": 400, "h": 16, "text": "Parameter Clustering", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "text", "x": 304, "y": 148, "w": 200, "h": 12, "text": "Jumlah Cluster (k)", "size": 11, "color": "text_muted"},
            {"type": "rect", "x": 304, "y": 164, "w": 160, "h": 36, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 488, "y": 148, "w": 200, "h": 12, "text": "Fitur", "size": 11, "color": "text_muted"},
            {"type": "rect", "x": 488, "y": 164, "w": 280, "h": 36, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 504, "y": 174, "w": 240, "h": 16, "text": "Kalori, Protein, Lemak, Karbo", "size": 12, "color": "text"},
            {"type": "rect", "x": 1264, "y": 160, "w": 160, "h": 44, "fill": "text_strong", "radius": 8},
            {"type": "text", "x": 1264, "y": 172, "w": 160, "h": 20, "text": "Jalankan", "size": 13, "weight": "medium", "color": "surface", "align": "center"},
            # Scatter chart
            {"type": "rect", "x": 272, "y": 240, "w": 720, "h": 440, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 288, "y": 260, "w": 400, "h": 18, "text": "Visualisasi Cluster (2D PCA)", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 288, "y": 296, "w": 688, "h": 368, "fill": "placeholder", "radius": 8},
        ]
        + [
            # Cluster list right
            {"type": "rect", "x": 1008, "y": 240, "w": 416, "h": 440, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 1024, "y": 260, "w": 400, "h": 18, "text": "Hasil Cluster", "size": 13, "weight": "medium", "color": "text_strong"},
        ]
        + [
            block
            for i in range(5)
            for block in [
                {"type": "rect", "x": 1024, "y": 292 + i * 72, "w": 384, "h": 60, "fill": "placeholder", "radius": 8},
                {"type": "rect", "x": 1040, "y": 308 + i * 72, "w": 24, "h": 24, "fill": "placeholder_d", "radius": 12},
                {"type": "rect", "x": 1076, "y": 310 + i * 72, "w": 180, "h": 12, "fill": "placeholder_d", "radius": 4},
                {"type": "rect", "x": 1076, "y": 328 + i * 72, "w": 240, "h": 10, "fill": "placeholder_d", "radius": 4},
            ]
        ]
        + [
            # Bottom: table of items
            {"type": "rect", "x": 272, "y": 704, "w": 1152, "h": 168, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 288, "y": 724, "w": 400, "h": 16, "text": "Daftar Makanan per Cluster", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 288, "y": 756, "w": 1120, "h": 36, "fill": "placeholder", "radius": 6},
            {"type": "rect", "x": 288, "y": 800, "w": 1120, "h": 24, "fill": "placeholder", "radius": 6},
            {"type": "rect", "x": 288, "y": 832, "w": 1120, "h": 24, "fill": "placeholder", "radius": 6},
        ],
    },
    {
        "id": "web-menu",
        "name": "Web · Buat Menu Harian",
        "frame": WEB_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 240, "h": 900, "fill": "surface", "stroke": "border"},
            {"type": "rect", "x": 16, "y": 280, "w": 208, "h": 40, "fill": "placeholder_d", "radius": 8},
            {"type": "text", "x": 36, "y": 292, "w": 180, "h": 16, "text": "Menu Harian", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 240, "y": 0, "w": 1200, "h": 64, "fill": "surface", "stroke": "border"},
            {"type": "text", "x": 272, "y": 22, "w": 500, "h": 20, "text": "Buat Menu Harian", "size": 16, "weight": "bold", "color": "text_strong"},
            # Date picker / target row
            {"type": "rect", "x": 272, "y": 96, "w": 1152, "h": 72, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 304, "y": 116, "w": 200, "h": 12, "text": "Tanggal Menu", "size": 11, "color": "text_muted"},
            {"type": "rect", "x": 304, "y": 132, "w": 200, "h": 32, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 528, "y": 116, "w": 200, "h": 12, "text": "Target Demografi", "size": 11, "color": "text_muted"},
            {"type": "rect", "x": 528, "y": 132, "w": 200, "h": 32, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "rect", "x": 1224, "y": 116, "w": 200, "h": 40, "fill": "text_strong", "radius": 8},
            {"type": "text", "x": 1224, "y": 128, "w": 200, "h": 16, "text": "Generate Otomatis", "size": 13, "weight": "medium", "color": "surface", "align": "center"},
            # Left: cluster picker
            {"type": "rect", "x": 272, "y": 192, "w": 460, "h": 624, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 288, "y": 212, "w": 400, "h": 18, "text": "Pilih dari Cluster", "size": 13, "weight": "medium", "color": "text_strong"},
        ]
        + [
            block
            for i in range(5)
            for block in [
                {"type": "rect", "x": 288, "y": 248 + i * 100, "w": 428, "h": 88, "fill": "placeholder", "radius": 8},
                {"type": "rect", "x": 304, "y": 264 + i * 100, "w": 24, "h": 24, "fill": "placeholder_d", "radius": 12},
                {"type": "rect", "x": 340, "y": 268 + i * 100, "w": 180, "h": 14, "fill": "placeholder_d", "radius": 4},
                {"type": "rect", "x": 340, "y": 290 + i * 100, "w": 260, "h": 10, "fill": "placeholder_d", "radius": 4},
                {"type": "rect", "x": 340, "y": 308 + i * 100, "w": 260, "h": 10, "fill": "placeholder_d", "radius": 4},
                {"type": "rect", "x": 644, "y": 280 + i * 100, "w": 56, "h": 28, "fill": "surface", "stroke": "border_strong", "radius": 14},
            ]
        ]
        + [
            # Middle: composed menu
            {"type": "rect", "x": 748, "y": 192, "w": 380, "h": 624, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 764, "y": 212, "w": 400, "h": 18, "text": "Menu Tersusun", "size": 13, "weight": "medium", "color": "text_strong"},
        ]
        + [
            block
            for i in range(4)
            for block in [
                {"type": "rect", "x": 764, "y": 248 + i * 84, "w": 348, "h": 72, "fill": "placeholder", "radius": 8},
                {"type": "rect", "x": 780, "y": 264 + i * 84, "w": 40, "h": 40, "fill": "placeholder_d", "radius": 8},
                {"type": "rect", "x": 832, "y": 268 + i * 84, "w": 180, "h": 12, "fill": "placeholder_d", "radius": 4},
                {"type": "rect", "x": 832, "y": 288 + i * 84, "w": 140, "h": 10, "fill": "placeholder_d", "radius": 4},
                {"type": "rect", "x": 1064, "y": 280 + i * 84, "w": 28, "h": 16, "fill": "border_strong", "radius": 4},
            ]
        ]
        + [
            # Right: nutrition summary
            {"type": "rect", "x": 1144, "y": 192, "w": 280, "h": 624, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "text", "x": 1160, "y": 212, "w": 240, "h": 18, "text": "Ringkasan AKG", "size": 13, "weight": "medium", "color": "text_strong"},
            # bars
            {"type": "text", "x": 1160, "y": 256, "w": 240, "h": 14, "text": "Kalori", "size": 12, "color": "text"},
            {"type": "rect", "x": 1160, "y": 276, "w": 248, "h": 8, "fill": "placeholder", "radius": 4},
            {"type": "rect", "x": 1160, "y": 276, "w": 200, "h": 8, "fill": "text_strong", "radius": 4},
            {"type": "text", "x": 1160, "y": 290, "w": 240, "h": 12, "text": "1600 / 2000 kcal (80%)", "size": 11, "color": "text_muted"},

            {"type": "text", "x": 1160, "y": 324, "w": 240, "h": 14, "text": "Protein", "size": 12, "color": "text"},
            {"type": "rect", "x": 1160, "y": 344, "w": 248, "h": 8, "fill": "placeholder", "radius": 4},
            {"type": "rect", "x": 1160, "y": 344, "w": 220, "h": 8, "fill": "text_strong", "radius": 4},
            {"type": "text", "x": 1160, "y": 358, "w": 240, "h": 12, "text": "55 / 60 g (92%)", "size": 11, "color": "text_muted"},

            {"type": "text", "x": 1160, "y": 392, "w": 240, "h": 14, "text": "Lemak", "size": 12, "color": "text"},
            {"type": "rect", "x": 1160, "y": 412, "w": 248, "h": 8, "fill": "placeholder", "radius": 4},
            {"type": "rect", "x": 1160, "y": 412, "w": 160, "h": 8, "fill": "text_strong", "radius": 4},
            {"type": "text", "x": 1160, "y": 426, "w": 240, "h": 12, "text": "48 / 70 g (68%)", "size": 11, "color": "text_muted"},

            {"type": "text", "x": 1160, "y": 460, "w": 240, "h": 14, "text": "Karbohidrat", "size": 12, "color": "text"},
            {"type": "rect", "x": 1160, "y": 480, "w": 248, "h": 8, "fill": "placeholder", "radius": 4},
            {"type": "rect", "x": 1160, "y": 480, "w": 210, "h": 8, "fill": "text_strong", "radius": 4},
            {"type": "text", "x": 1160, "y": 494, "w": 240, "h": 12, "text": "270 / 300 g (90%)", "size": 11, "color": "text_muted"},

            # AKG status
            {"type": "rect", "x": 1160, "y": 540, "w": 248, "h": 68, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 1160, "y": 558, "w": 248, "h": 16, "text": "Sesuai AKG ✓", "size": 14, "weight": "bold", "color": "text_strong", "align": "center"},
            {"type": "text", "x": 1160, "y": 580, "w": 248, "h": 12, "text": "Komposisi memenuhi target", "size": 11, "color": "text_muted", "align": "center"},

            {"type": "rect", "x": 1160, "y": 740, "w": 248, "h": 44, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 1160, "y": 753, "w": 248, "h": 18, "text": "Atur Ulang", "size": 13, "color": "text", "align": "center"},
            {"type": "rect", "x": 1160, "y": 770, "w": 248, "h": 1, "fill": "surface"},  # spacer
            {"type": "rect", "x": 1160, "y": 760, "w": 248, "h": 44, "fill": "text_strong", "radius": 8},
            {"type": "text", "x": 1160, "y": 773, "w": 248, "h": 18, "text": "Simpan Menu", "size": 13, "weight": "medium", "color": "surface", "align": "center"},
        ],
    },
    {
        "id": "web-feedback",
        "name": "Web · Kelola Feedback",
        "frame": WEB_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 240, "h": 900, "fill": "surface", "stroke": "border"},
            {"type": "rect", "x": 16, "y": 328, "w": 208, "h": 40, "fill": "placeholder_d", "radius": 8},
            {"type": "text", "x": 36, "y": 340, "w": 180, "h": 16, "text": "Feedback", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 240, "y": 0, "w": 1200, "h": 64, "fill": "surface", "stroke": "border"},
            {"type": "text", "x": 272, "y": 22, "w": 500, "h": 20, "text": "Kelola Feedback", "size": 16, "weight": "bold", "color": "text_strong"},
            # Filter row
            {"type": "rect", "x": 272, "y": 96, "w": 220, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 288, "y": 108, "w": 200, "h": 16, "text": "Status: Semua ▾", "size": 13, "color": "text"},
            {"type": "rect", "x": 504, "y": 96, "w": 220, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 520, "y": 108, "w": 200, "h": 16, "text": "Rating: Semua ▾", "size": 13, "color": "text"},
            {"type": "rect", "x": 736, "y": 96, "w": 320, "h": 40, "fill": "surface", "stroke": "border", "radius": 8},
            {"type": "text", "x": 752, "y": 108, "w": 280, "h": 16, "text": "Cari sekolah / komentar...", "size": 13, "color": "text_muted"},
            # Cards grid
        ]
        + [
            block
            for i in range(6)
            for block in [
                {"type": "rect", "x": 272 + (i % 3) * 392, "y": 168 + (i // 3) * 240, "w": 376, "h": 220, "fill": "surface", "stroke": "border", "radius": 12},
                {"type": "rect", "x": 288 + (i % 3) * 392, "y": 184 + (i // 3) * 240, "w": 40, "h": 40, "fill": "placeholder", "radius": 20},
                {"type": "rect", "x": 340 + (i % 3) * 392, "y": 188 + (i // 3) * 240, "w": 160, "h": 14, "fill": "placeholder", "radius": 4},
                {"type": "rect", "x": 340 + (i % 3) * 392, "y": 208 + (i // 3) * 240, "w": 100, "h": 10, "fill": "placeholder", "radius": 4},
                {"type": "rect", "x": 568 + (i % 3) * 392, "y": 188 + (i // 3) * 240, "w": 60, "h": 24, "fill": "placeholder_d", "radius": 12},
                {"type": "rect", "x": 288 + (i % 3) * 392, "y": 244 + (i // 3) * 240, "w": 344, "h": 10, "fill": "placeholder", "radius": 4},
                {"type": "rect", "x": 288 + (i % 3) * 392, "y": 260 + (i // 3) * 240, "w": 344, "h": 10, "fill": "placeholder", "radius": 4},
                {"type": "rect", "x": 288 + (i % 3) * 392, "y": 276 + (i // 3) * 240, "w": 240, "h": 10, "fill": "placeholder", "radius": 4},
                {"type": "rect", "x": 288 + (i % 3) * 392, "y": 308 + (i // 3) * 240, "w": 120, "h": 28, "fill": "placeholder_d", "radius": 14},
                {"type": "rect", "x": 540 + (i % 3) * 392, "y": 308 + (i // 3) * 240, "w": 88, "h": 28, "fill": "text_strong", "radius": 14},
            ]
        ],
    },
]

MOBILE_SCREENS = [
    {
        "id": "mobile-login",
        "name": "Mobile · Login",
        "frame": MOBILE_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 390, "h": 44, "fill": "surface"},
            {"type": "rect", "x": 16, "y": 14, "w": 60, "h": 16, "fill": "placeholder", "radius": 4},
            {"type": "rect", "x": 314, "y": 14, "w": 60, "h": 16, "fill": "placeholder", "radius": 4},
            {"type": "rect", "x": 135, "y": 140, "w": 120, "h": 120, "fill": "placeholder", "radius": 24},
            {"type": "text", "x": 32, "y": 296, "w": 326, "h": 24, "text": "Selamat Datang", "size": 22, "weight": "bold", "color": "text_strong", "align": "center"},
            {"type": "text", "x": 32, "y": 324, "w": 326, "h": 18, "text": "Masuk untuk melihat menu MBG hari ini", "size": 13, "color": "text_muted", "align": "center"},
            {"type": "text", "x": 32, "y": 384, "w": 326, "h": 14, "text": "Email / NIP", "size": 12, "weight": "medium", "color": "text"},
            {"type": "rect", "x": 32, "y": 404, "w": 326, "h": 48, "fill": "surface", "stroke": "border", "radius": 10},
            {"type": "text", "x": 32, "y": 472, "w": 326, "h": 14, "text": "Password", "size": 12, "weight": "medium", "color": "text"},
            {"type": "rect", "x": 32, "y": 492, "w": 326, "h": 48, "fill": "surface", "stroke": "border", "radius": 10},
            {"type": "rect", "x": 32, "y": 568, "w": 326, "h": 50, "fill": "text_strong", "radius": 12},
            {"type": "text", "x": 32, "y": 582, "w": 326, "h": 20, "text": "Masuk", "size": 15, "weight": "medium", "color": "surface", "align": "center"},
            {"type": "text", "x": 32, "y": 640, "w": 326, "h": 16, "text": "Lupa Password?", "size": 13, "color": "text_muted", "align": "center"},
            {"type": "rect", "x": 145, "y": 824, "w": 100, "h": 5, "fill": "border_strong", "radius": 3},
        ],
    },
    {
        "id": "mobile-home",
        "name": "Mobile · Menu Hari Ini",
        "frame": MOBILE_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 390, "h": 44, "fill": "surface"},
            {"type": "rect", "x": 16, "y": 14, "w": 60, "h": 16, "fill": "placeholder", "radius": 4},
            {"type": "rect", "x": 314, "y": 14, "w": 60, "h": 16, "fill": "placeholder", "radius": 4},
            # Header
            {"type": "rect", "x": 0, "y": 44, "w": 390, "h": 100, "fill": "surface", "stroke": "border"},
            {"type": "text", "x": 24, "y": 64, "w": 200, "h": 14, "text": "Selamat pagi,", "size": 13, "color": "text_muted"},
            {"type": "text", "x": 24, "y": 84, "w": 240, "h": 22, "text": "Bu Sari", "size": 18, "weight": "bold", "color": "text_strong"},
            {"type": "text", "x": 24, "y": 114, "w": 240, "h": 14, "text": "SDN 01 Senayan · Senin, 12 Jan", "size": 12, "color": "text_muted"},
            {"type": "rect", "x": 326, "y": 76, "w": 40, "h": 40, "fill": "placeholder", "radius": 20},
            # Today's menu card
            {"type": "rect", "x": 16, "y": 164, "w": 358, "h": 200, "fill": "surface", "stroke": "border", "radius": 16},
            {"type": "rect", "x": 16, "y": 164, "w": 358, "h": 120, "fill": "placeholder", "radius": 16},
            {"type": "text", "x": 32, "y": 300, "w": 200, "h": 12, "text": "MENU HARI INI", "size": 10, "weight": "medium", "color": "text_muted"},
            {"type": "text", "x": 32, "y": 318, "w": 320, "h": 22, "text": "Nasi + Ayam Goreng + Sayur", "size": 16, "weight": "bold", "color": "text_strong"},
            {"type": "rect", "x": 32, "y": 348, "w": 60, "h": 10, "fill": "placeholder", "radius": 4},
            # Nutrition mini cards
            {"type": "text", "x": 24, "y": 388, "w": 200, "h": 18, "text": "Ringkasan Nutrisi", "size": 14, "weight": "medium", "color": "text_strong"},
        ]
        + [
            block
            for i, (label, val) in enumerate([("Kalori", "650"), ("Protein", "28g"), ("Lemak", "18g"), ("Karbo", "82g")])
            for block in [
                {"type": "rect", "x": 16 + (i % 2) * 184, "y": 416 + (i // 2) * 76, "w": 174, "h": 68, "fill": "surface", "stroke": "border", "radius": 12},
                {"type": "text", "x": 32 + (i % 2) * 184, "y": 428 + (i // 2) * 76, "w": 100, "h": 12, "text": label, "size": 11, "color": "text_muted"},
                {"type": "text", "x": 32 + (i % 2) * 184, "y": 446 + (i // 2) * 76, "w": 140, "h": 24, "text": val, "size": 18, "weight": "bold", "color": "text_strong"},
            ]
        ]
        + [
            # Action buttons
            {"type": "rect", "x": 16, "y": 580, "w": 358, "h": 56, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "rect", "x": 32, "y": 596, "w": 24, "h": 24, "fill": "placeholder", "radius": 12},
            {"type": "text", "x": 68, "y": 600, "w": 200, "h": 16, "text": "Lihat Detail Nutrisi", "size": 14, "weight": "medium", "color": "text_strong"},
            {"type": "text", "x": 340, "y": 600, "w": 20, "h": 16, "text": "›", "size": 18, "color": "text_muted"},
            {"type": "rect", "x": 16, "y": 648, "w": 358, "h": 56, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "rect", "x": 32, "y": 664, "w": 24, "h": 24, "fill": "placeholder", "radius": 12},
            {"type": "text", "x": 68, "y": 668, "w": 200, "h": 16, "text": "Kirim Feedback", "size": 14, "weight": "medium", "color": "text_strong"},
            {"type": "text", "x": 340, "y": 668, "w": 20, "h": 16, "text": "›", "size": 18, "color": "text_muted"},
            # Tab bar
            {"type": "rect", "x": 0, "y": 760, "w": 390, "h": 84, "fill": "surface", "stroke": "border"},
            {"type": "rect", "x": 32, "y": 780, "w": 28, "h": 28, "fill": "text_strong", "radius": 8},
            {"type": "text", "x": 16, "y": 812, "w": 60, "h": 12, "text": "Beranda", "size": 10, "weight": "medium", "color": "text_strong", "align": "center"},
            {"type": "rect", "x": 132, "y": 780, "w": 28, "h": 28, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 116, "y": 812, "w": 60, "h": 12, "text": "Riwayat", "size": 10, "color": "text_muted", "align": "center"},
            {"type": "rect", "x": 232, "y": 780, "w": 28, "h": 28, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 216, "y": 812, "w": 60, "h": 12, "text": "Feedback", "size": 10, "color": "text_muted", "align": "center"},
            {"type": "rect", "x": 332, "y": 780, "w": 28, "h": 28, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 316, "y": 812, "w": 60, "h": 12, "text": "Profil", "size": 10, "color": "text_muted", "align": "center"},
        ],
    },
    {
        "id": "mobile-detail",
        "name": "Mobile · Detail Nutrisi",
        "frame": MOBILE_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 390, "h": 44, "fill": "surface"},
            # Header / back
            {"type": "rect", "x": 0, "y": 44, "w": 390, "h": 56, "fill": "surface", "stroke": "border"},
            {"type": "rect", "x": 16, "y": 60, "w": 32, "h": 32, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 64, "y": 66, "w": 260, "h": 20, "text": "Detail Nutrisi", "size": 16, "weight": "bold", "color": "text_strong"},
            # Hero image
            {"type": "rect", "x": 0, "y": 100, "w": 390, "h": 220, "fill": "placeholder"},
            # Title
            {"type": "text", "x": 24, "y": 340, "w": 200, "h": 12, "text": "MENU UTAMA", "size": 10, "weight": "medium", "color": "text_muted"},
            {"type": "text", "x": 24, "y": 360, "w": 342, "h": 26, "text": "Nasi + Ayam Goreng + Sayur Bayam", "size": 18, "weight": "bold", "color": "text_strong"},
            {"type": "text", "x": 24, "y": 394, "w": 342, "h": 16, "text": "Porsi: 1 paket (350g)", "size": 12, "color": "text_muted"},
            # Nutrition rows
            {"type": "rect", "x": 16, "y": 432, "w": 358, "h": 1, "fill": "border"},
            {"type": "text", "x": 24, "y": 448, "w": 200, "h": 16, "text": "Komposisi Nutrisi", "size": 14, "weight": "medium", "color": "text_strong"},
        ]
        + [
            block
            for i, (label, val, pct) in enumerate([
                ("Kalori", "650 kcal", 0.82),
                ("Protein", "28 g", 0.93),
                ("Lemak", "18 g", 0.68),
                ("Karbohidrat", "82 g", 0.88),
            ])
            for block in [
                {"type": "rect", "x": 16, "y": 484 + i * 64, "w": 358, "h": 56, "fill": "surface", "stroke": "border", "radius": 10},
                {"type": "text", "x": 32, "y": 496 + i * 64, "w": 200, "h": 14, "text": label, "size": 12, "color": "text_muted"},
                {"type": "text", "x": 32, "y": 514 + i * 64, "w": 200, "h": 18, "text": val, "size": 15, "weight": "bold", "color": "text_strong"},
                {"type": "rect", "x": 220, "y": 512 + i * 64, "w": 138, "h": 6, "fill": "placeholder", "radius": 3},
                {"type": "rect", "x": 220, "y": 512 + i * 64, "w": int(138 * pct), "h": 6, "fill": "text_strong", "radius": 3},
                {"type": "text", "x": 220, "y": 522 + i * 64, "w": 138, "h": 12, "text": f"{int(pct*100)}% AKG", "size": 10, "color": "text_muted", "align": "right"},
            ]
        ]
        + [
            {"type": "rect", "x": 16, "y": 748, "w": 358, "h": 50, "fill": "text_strong", "radius": 12},
            {"type": "text", "x": 16, "y": 762, "w": 358, "h": 20, "text": "Beri Feedback Menu", "size": 14, "weight": "medium", "color": "surface", "align": "center"},
            {"type": "rect", "x": 145, "y": 824, "w": 100, "h": 5, "fill": "border_strong", "radius": 3},
        ],
    },
    {
        "id": "mobile-history",
        "name": "Mobile · Riwayat Menu",
        "frame": MOBILE_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 390, "h": 44, "fill": "surface"},
            {"type": "rect", "x": 0, "y": 44, "w": 390, "h": 56, "fill": "surface", "stroke": "border"},
            {"type": "text", "x": 24, "y": 66, "w": 260, "h": 20, "text": "Riwayat Menu", "size": 16, "weight": "bold", "color": "text_strong"},
            {"type": "rect", "x": 326, "y": 60, "w": 32, "h": 32, "fill": "placeholder", "radius": 8},
            # Search
            {"type": "rect", "x": 16, "y": 116, "w": 358, "h": 44, "fill": "surface", "stroke": "border", "radius": 10},
            {"type": "text", "x": 32, "y": 130, "w": 200, "h": 16, "text": "🔍  Cari menu...", "size": 13, "color": "text_muted"},
            # Filter chips
            {"type": "rect", "x": 16, "y": 176, "w": 80, "h": 32, "fill": "text_strong", "radius": 16},
            {"type": "text", "x": 16, "y": 184, "w": 80, "h": 16, "text": "Semua", "size": 12, "weight": "medium", "color": "surface", "align": "center"},
            {"type": "rect", "x": 104, "y": 176, "w": 96, "h": 32, "fill": "surface", "stroke": "border", "radius": 16},
            {"type": "text", "x": 104, "y": 184, "w": 96, "h": 16, "text": "Minggu Ini", "size": 12, "color": "text", "align": "center"},
            {"type": "rect", "x": 208, "y": 176, "w": 80, "h": 32, "fill": "surface", "stroke": "border", "radius": 16},
            {"type": "text", "x": 208, "y": 184, "w": 80, "h": 16, "text": "Bulan Ini", "size": 12, "color": "text", "align": "center"},
        ]
        + [
            block
            for i in range(5)
            for block in [
                {"type": "rect", "x": 16, "y": 232 + i * 100, "w": 358, "h": 88, "fill": "surface", "stroke": "border", "radius": 12},
                {"type": "rect", "x": 32, "y": 248 + i * 100, "w": 56, "h": 56, "fill": "placeholder", "radius": 8},
                {"type": "text", "x": 104, "y": 252 + i * 100, "w": 240, "h": 12, "text": "12 Jan 2026 · Senin", "size": 10, "color": "text_muted"},
                {"type": "text", "x": 104, "y": 270 + i * 100, "w": 240, "h": 16, "text": "Nasi + Ayam Goreng + Sayur", "size": 13, "weight": "medium", "color": "text_strong"},
                {"type": "rect", "x": 104, "y": 292 + i * 100, "w": 60, "h": 18, "fill": "placeholder_d", "radius": 9},
                {"type": "rect", "x": 172, "y": 292 + i * 100, "w": 60, "h": 18, "fill": "placeholder_d", "radius": 9},
                {"type": "text", "x": 344, "y": 270 + i * 100, "w": 20, "h": 16, "text": "›", "size": 18, "color": "text_muted"},
            ]
        ]
        + [
            {"type": "rect", "x": 145, "y": 824, "w": 100, "h": 5, "fill": "border_strong", "radius": 3},
        ],
    },
    {
        "id": "mobile-feedback",
        "name": "Mobile · Kirim Feedback",
        "frame": MOBILE_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 390, "h": 44, "fill": "surface"},
            {"type": "rect", "x": 0, "y": 44, "w": 390, "h": 56, "fill": "surface", "stroke": "border"},
            {"type": "rect", "x": 16, "y": 60, "w": 32, "h": 32, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 64, "y": 66, "w": 260, "h": 20, "text": "Kirim Feedback", "size": 16, "weight": "bold", "color": "text_strong"},
            # Menu being reviewed
            {"type": "rect", "x": 16, "y": 116, "w": 358, "h": 80, "fill": "surface", "stroke": "border", "radius": 12},
            {"type": "rect", "x": 32, "y": 132, "w": 48, "h": 48, "fill": "placeholder", "radius": 8},
            {"type": "text", "x": 96, "y": 138, "w": 240, "h": 12, "text": "MENU HARI INI", "size": 10, "color": "text_muted"},
            {"type": "text", "x": 96, "y": 156, "w": 240, "h": 16, "text": "Nasi + Ayam + Sayur", "size": 13, "weight": "medium", "color": "text_strong"},
            # Rating
            {"type": "text", "x": 24, "y": 224, "w": 200, "h": 16, "text": "Bagaimana menu hari ini?", "size": 14, "weight": "medium", "color": "text_strong"},
        ]
        + [
            block
            for i, label in enumerate(["Sangat Baik", "Baik", "Cukup", "Kurang"])
            for block in [
                {"type": "rect", "x": 16, "y": 256 + i * 64, "w": 358, "h": 52, "fill": "placeholder" if i == 1 else "surface", "stroke": "border", "radius": 10},
                {"type": "rect", "x": 32, "y": 274 + i * 64, "w": 20, "h": 20, "fill": "text_strong" if i == 1 else "placeholder", "radius": 10},
                {"type": "text", "x": 68, "y": 274 + i * 64, "w": 240, "h": 16, "text": label, "size": 14, "weight": "medium" if i == 1 else "regular", "color": "text_strong"},
            ]
        ]
        + [
            # Comment box
            {"type": "text", "x": 24, "y": 532, "w": 280, "h": 16, "text": "Komentar (opsional)", "size": 13, "weight": "medium", "color": "text_strong"},
            {"type": "rect", "x": 16, "y": 556, "w": 358, "h": 120, "fill": "surface", "stroke": "border", "radius": 10},
            {"type": "text", "x": 32, "y": 572, "w": 320, "h": 14, "text": "Tulis pendapat Anda di sini...", "size": 12, "color": "text_muted"},
            # Submit
            {"type": "rect", "x": 16, "y": 712, "w": 358, "h": 52, "fill": "text_strong", "radius": 12},
            {"type": "text", "x": 16, "y": 726, "w": 358, "h": 20, "text": "Kirim Feedback", "size": 15, "weight": "medium", "color": "surface", "align": "center"},
            {"type": "rect", "x": 145, "y": 824, "w": 100, "h": 5, "fill": "border_strong", "radius": 3},
        ],
    },
    {
        "id": "mobile-feedback-status",
        "name": "Mobile · Status Feedback",
        "frame": MOBILE_FRAME,
        "blocks": [
            {"type": "rect", "x": 0, "y": 0, "w": 390, "h": 44, "fill": "surface"},
            {"type": "rect", "x": 0, "y": 44, "w": 390, "h": 56, "fill": "surface", "stroke": "border"},
            {"type": "text", "x": 24, "y": 66, "w": 260, "h": 20, "text": "Status Feedback", "size": 16, "weight": "bold", "color": "text_strong"},
            # Tabs
            {"type": "rect", "x": 16, "y": 116, "w": 358, "h": 40, "fill": "placeholder", "radius": 10},
            {"type": "rect", "x": 20, "y": 120, "w": 175, "h": 32, "fill": "surface", "radius": 8},
            {"type": "text", "x": 20, "y": 128, "w": 175, "h": 16, "text": "Saya", "size": 13, "weight": "medium", "color": "text_strong", "align": "center"},
            {"type": "text", "x": 195, "y": 128, "w": 175, "h": 16, "text": "Sekolah", "size": 13, "color": "text_muted", "align": "center"},
        ]
        + [
            block
            for i, (status, color) in enumerate([
                ("Diterima", "text_strong"),
                ("Direview", "border_strong"),
                ("Diterima", "text_strong"),
                ("Selesai", "text_muted"),
                ("Direview", "border_strong"),
            ])
            for block in [
                {"type": "rect", "x": 16, "y": 180 + i * 116, "w": 358, "h": 100, "fill": "surface", "stroke": "border", "radius": 12},
                {"type": "rect", "x": 32, "y": 196 + i * 116, "w": 60, "h": 18, "fill": color, "radius": 9},
                {"type": "text", "x": 32, "y": 198 + i * 116, "w": 60, "h": 14, "text": status, "size": 10, "weight": "medium", "color": "surface", "align": "center"},
                {"type": "text", "x": 100, "y": 198 + i * 116, "w": 200, "h": 14, "text": "12 Jan 2026 · 14:30", "size": 11, "color": "text_muted"},
                {"type": "text", "x": 32, "y": 226 + i * 116, "w": 320, "h": 16, "text": "Nasi + Ayam Goreng + Sayur", "size": 13, "weight": "medium", "color": "text_strong"},
                {"type": "rect", "x": 32, "y": 250 + i * 116, "w": 60, "h": 12, "fill": "placeholder_d", "radius": 3},
                {"type": "text", "x": 100, "y": 248 + i * 116, "w": 240, "h": 14, "text": "Rating: Baik", "size": 11, "color": "text_muted"},
            ]
        ]
        + [
            {"type": "rect", "x": 145, "y": 824, "w": 100, "h": 5, "fill": "border_strong", "radius": 3},
        ],
    },
]

ALL_SCREENS = WEB_SCREENS + MOBILE_SCREENS
