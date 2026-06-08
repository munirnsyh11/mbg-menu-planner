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
        "id": 'mobile-login',
        "name": 'Mobile · Login',
        "frame": MOBILE_FRAME,
        "blocks": [
            {'type': 'rect', 'x': 0, 'y': 0, 'w': 390, 'h': 44, 'fill': 'surface'},
            {'type': 'text', 'x': 24, 'y': 14, 'w': 60, 'h': 18, 'text': '9:41', 'size': 15, 'weight': 'bold', 'color': 'text_strong'},
            {'type': 'rect', 'x': 296, 'y': 22, 'w': 3, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 302, 'y': 20, 'w': 3, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 308, 'y': 18, 'w': 3, 'h': 9, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 314, 'y': 16, 'w': 3, 'h': 11, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 325, 'y': 16, 'w': 13, 'h': 11, 'fill': 'text_strong', 'radius': 2},
            {'type': 'rect', 'x': 346, 'y': 17, 'w': 26, 'h': 11, 'fill': 'surface', 'stroke': 'text_strong', 'radius': 3},
            {'type': 'rect', 'x': 349, 'y': 19, 'w': 17, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 372, 'y': 20, 'w': 2, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 151, 'y': 132, 'w': 88, 'h': 88, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 8},
            {'type': 'rect', 'x': 158, 'y': 175, 'w': 74, 'h': 2, 'fill': 'border_strong'},
            {'type': 'rect', 'x': 194, 'y': 139, 'w': 2, 'h': 74, 'fill': 'border_strong'},
            {'type': 'text', 'x': 0, 'y': 236, 'w': 390, 'h': 14, 'text': 'LOGO MBG', 'size': 11, 'weight': 'medium', 'color': 'text_muted', 'align': 'center'},
            {'type': 'text', 'x': 32, 'y': 282, 'w': 326, 'h': 30, 'text': 'Welcome Back!', 'size': 24, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'text', 'x': 32, 'y': 318, 'w': 326, 'h': 18, 'text': 'Silakan login untuk melanjutkan', 'size': 13, 'color': 'text_muted', 'align': 'center'},
            {'type': 'text', 'x': 32, 'y': 380, 'w': 326, 'h': 14, 'text': 'Email', 'size': 12, 'weight': 'medium', 'color': 'text'},
            {'type': 'rect', 'x': 32, 'y': 400, 'w': 326, 'h': 48, 'fill': 'surface', 'stroke': 'border', 'radius': 10},
            {'type': 'text', 'x': 48, 'y': 414, 'w': 280, 'h': 20, 'text': 'Masukkan email', 'size': 13, 'color': 'text_muted'},
            {'type': 'text', 'x': 32, 'y': 468, 'w': 326, 'h': 14, 'text': 'Password', 'size': 12, 'weight': 'medium', 'color': 'text'},
            {'type': 'rect', 'x': 32, 'y': 488, 'w': 326, 'h': 48, 'fill': 'surface', 'stroke': 'border', 'radius': 10},
            {'type': 'text', 'x': 48, 'y': 502, 'w': 240, 'h': 20, 'text': 'Masukkan password', 'size': 13, 'color': 'text_muted'},
            {'type': 'rect', 'x': 320, 'y': 502, 'w': 22, 'h': 20, 'fill': 'placeholder', 'radius': 4},
            {'type': 'rect', 'x': 32, 'y': 580, 'w': 326, 'h': 52, 'fill': 'text_strong', 'radius': 12},
            {'type': 'text', 'x': 32, 'y': 596, 'w': 326, 'h': 20, 'text': 'LOGIN', 'size': 15, 'weight': 'bold', 'color': 'surface', 'align': 'center'},
            {'type': 'text', 'x': 32, 'y': 652, 'w': 326, 'h': 16, 'text': 'Lupa password?', 'size': 13, 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 0, 'y': 759, 'w': 390, 'h': 1, 'fill': 'border'},
            {'type': 'rect', 'x': 0, 'y': 760, 'w': 390, 'h': 84, 'fill': 'surface'},
            {'type': 'rect', 'x': 51, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 15, 'y': 812, 'w': 100, 'h': 14, 'text': 'Home', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 181, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 145, 'y': 812, 'w': 100, 'h': 14, 'text': 'Riwayat', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 311, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 275, 'y': 812, 'w': 100, 'h': 14, 'text': 'Profil', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 137, 'y': 826, 'w': 116, 'h': 5, 'fill': 'text_strong', 'radius': 3},
        ],
    },
    {
        "id": 'mobile-home',
        "name": 'Mobile · Menu Hari Ini',
        "frame": MOBILE_FRAME,
        "blocks": [
            {'type': 'rect', 'x': 0, 'y': 0, 'w': 390, 'h': 44, 'fill': 'surface'},
            {'type': 'text', 'x': 24, 'y': 14, 'w': 60, 'h': 18, 'text': '9:41', 'size': 15, 'weight': 'bold', 'color': 'text_strong'},
            {'type': 'rect', 'x': 296, 'y': 22, 'w': 3, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 302, 'y': 20, 'w': 3, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 308, 'y': 18, 'w': 3, 'h': 9, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 314, 'y': 16, 'w': 3, 'h': 11, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 325, 'y': 16, 'w': 13, 'h': 11, 'fill': 'text_strong', 'radius': 2},
            {'type': 'rect', 'x': 346, 'y': 17, 'w': 26, 'h': 11, 'fill': 'surface', 'stroke': 'text_strong', 'radius': 3},
            {'type': 'rect', 'x': 349, 'y': 19, 'w': 17, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 372, 'y': 20, 'w': 2, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'text', 'x': 24, 'y': 72, 'w': 342, 'h': 28, 'text': 'Halo, Petugas Sekolah', 'size': 20, 'weight': 'bold', 'color': 'text_strong'},
            {'type': 'text', 'x': 24, 'y': 106, 'w': 200, 'h': 16, 'text': '13 Juni 2026', 'size': 13, 'color': 'text_muted'},
            {'type': 'text', 'x': 24, 'y': 156, 'w': 200, 'h': 18, 'text': 'Menu Hari Ini', 'size': 15, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'rect', 'x': 16, 'y': 184, 'w': 358, 'h': 280, 'fill': 'surface', 'stroke': 'border', 'radius': 14},
            {'type': 'text', 'x': 32, 'y': 204, 'w': 326, 'h': 24, 'text': 'Menu A', 'size': 17, 'weight': 'bold', 'color': 'text_strong'},
            {'type': 'rect', 'x': 32, 'y': 240, 'w': 6, 'h': 6, 'fill': 'text_strong', 'radius': 3},
            {'type': 'text', 'x': 48, 'y': 234, 'w': 280, 'h': 18, 'text': 'Nasi Putih', 'size': 14, 'color': 'text'},
            {'type': 'rect', 'x': 32, 'y': 270, 'w': 6, 'h': 6, 'fill': 'text_strong', 'radius': 3},
            {'type': 'text', 'x': 48, 'y': 264, 'w': 280, 'h': 18, 'text': 'Ayam Goreng', 'size': 14, 'color': 'text'},
            {'type': 'rect', 'x': 32, 'y': 300, 'w': 6, 'h': 6, 'fill': 'text_strong', 'radius': 3},
            {'type': 'text', 'x': 48, 'y': 294, 'w': 280, 'h': 18, 'text': 'Tumis Bayam', 'size': 14, 'color': 'text'},
            {'type': 'rect', 'x': 32, 'y': 330, 'w': 6, 'h': 6, 'fill': 'text_strong', 'radius': 3},
            {'type': 'text', 'x': 48, 'y': 324, 'w': 280, 'h': 18, 'text': 'Pisang', 'size': 14, 'color': 'text'},
            {'type': 'rect', 'x': 32, 'y': 376, 'w': 326, 'h': 1, 'fill': 'border'},
            {'type': 'text', 'x': 32, 'y': 400, 'w': 280, 'h': 20, 'text': 'Lihat Detail Nutrisi', 'size': 14, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'text', 'x': 332, 'y': 396, 'w': 26, 'h': 24, 'text': '›', 'size': 22, 'color': 'text_muted', 'align': 'center'},
            {'type': 'text', 'x': 24, 'y': 496, 'w': 200, 'h': 16, 'text': 'Informasi', 'size': 13, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'text', 'x': 24, 'y': 520, 'w': 342, 'h': 40, 'text': 'Menu disusun berdasarkan kebutuhan gizi harian.', 'size': 12, 'color': 'text_muted'},
            {'type': 'rect', 'x': 0, 'y': 759, 'w': 390, 'h': 1, 'fill': 'border'},
            {'type': 'rect', 'x': 0, 'y': 760, 'w': 390, 'h': 84, 'fill': 'surface'},
            {'type': 'rect', 'x': 51, 'y': 776, 'w': 28, 'h': 28, 'fill': 'text_strong', 'radius': 6},
            {'type': 'text', 'x': 15, 'y': 812, 'w': 100, 'h': 14, 'text': 'Home', 'size': 11, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'rect', 'x': 181, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 145, 'y': 812, 'w': 100, 'h': 14, 'text': 'Riwayat', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 311, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 275, 'y': 812, 'w': 100, 'h': 14, 'text': 'Profil', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 137, 'y': 826, 'w': 116, 'h': 5, 'fill': 'text_strong', 'radius': 3},
        ],
    },
    {
        "id": 'mobile-detail',
        "name": 'Mobile · Detail Nutrisi',
        "frame": MOBILE_FRAME,
        "blocks": [
            {'type': 'rect', 'x': 0, 'y': 0, 'w': 390, 'h': 44, 'fill': 'surface'},
            {'type': 'text', 'x': 24, 'y': 14, 'w': 60, 'h': 18, 'text': '9:41', 'size': 15, 'weight': 'bold', 'color': 'text_strong'},
            {'type': 'rect', 'x': 296, 'y': 22, 'w': 3, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 302, 'y': 20, 'w': 3, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 308, 'y': 18, 'w': 3, 'h': 9, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 314, 'y': 16, 'w': 3, 'h': 11, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 325, 'y': 16, 'w': 13, 'h': 11, 'fill': 'text_strong', 'radius': 2},
            {'type': 'rect', 'x': 346, 'y': 17, 'w': 26, 'h': 11, 'fill': 'surface', 'stroke': 'text_strong', 'radius': 3},
            {'type': 'rect', 'x': 349, 'y': 19, 'w': 17, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 372, 'y': 20, 'w': 2, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 0, 'y': 44, 'w': 390, 'h': 56, 'fill': 'surface'},
            {'type': 'rect', 'x': 0, 'y': 100, 'w': 390, 'h': 1, 'fill': 'border'},
            {'type': 'text', 'x': 0, 'y': 66, 'w': 390, 'h': 22, 'text': 'Detail Nutrisi', 'size': 16, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'text', 'x': 16, 'y': 60, 'w': 32, 'h': 32, 'text': '‹', 'size': 28, 'weight': 'medium', 'color': 'text_strong', 'align': 'center'},
            {'type': 'text', 'x': 0, 'y': 124, 'w': 390, 'h': 28, 'text': 'Menu A', 'size': 20, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'text', 'x': 0, 'y': 156, 'w': 390, 'h': 16, 'text': '13 Juni 2026', 'size': 12, 'color': 'text_muted', 'align': 'center'},
            {'type': 'text', 'x': 24, 'y': 196, 'w': 200, 'h': 18, 'text': 'Informasi Gizi', 'size': 14, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'rect', 'x': 16, 'y': 220, 'w': 358, 'h': 196, 'fill': 'surface', 'stroke': 'border', 'radius': 12},
            {'type': 'text', 'x': 32, 'y': 236, 'w': 200, 'h': 18, 'text': 'Kalori', 'size': 14, 'color': 'text'},
            {'type': 'text', 'x': 200, 'y': 236, 'w': 158, 'h': 18, 'text': '650 kkal', 'size': 14, 'weight': 'medium', 'color': 'text_strong', 'align': 'right'},
            {'type': 'rect', 'x': 32, 'y': 266, 'w': 326, 'h': 1, 'fill': 'border'},
            {'type': 'text', 'x': 32, 'y': 284, 'w': 200, 'h': 18, 'text': 'Protein', 'size': 14, 'color': 'text'},
            {'type': 'text', 'x': 200, 'y': 284, 'w': 158, 'h': 18, 'text': '30 g', 'size': 14, 'weight': 'medium', 'color': 'text_strong', 'align': 'right'},
            {'type': 'rect', 'x': 32, 'y': 314, 'w': 326, 'h': 1, 'fill': 'border'},
            {'type': 'text', 'x': 32, 'y': 332, 'w': 200, 'h': 18, 'text': 'Lemak', 'size': 14, 'color': 'text'},
            {'type': 'text', 'x': 200, 'y': 332, 'w': 158, 'h': 18, 'text': '18 g', 'size': 14, 'weight': 'medium', 'color': 'text_strong', 'align': 'right'},
            {'type': 'rect', 'x': 32, 'y': 362, 'w': 326, 'h': 1, 'fill': 'border'},
            {'type': 'text', 'x': 32, 'y': 380, 'w': 200, 'h': 18, 'text': 'Karbohidrat', 'size': 14, 'color': 'text'},
            {'type': 'text', 'x': 200, 'y': 380, 'w': 158, 'h': 18, 'text': '85 g', 'size': 14, 'weight': 'medium', 'color': 'text_strong', 'align': 'right'},
            {'type': 'text', 'x': 24, 'y': 448, 'w': 200, 'h': 18, 'text': 'Daftar Makanan', 'size': 14, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'rect', 'x': 16, 'y': 472, 'w': 358, 'h': 160, 'fill': 'surface', 'stroke': 'border', 'radius': 12},
            {'type': 'rect', 'x': 32, 'y': 496, 'w': 6, 'h': 6, 'fill': 'text_strong', 'radius': 3},
            {'type': 'text', 'x': 48, 'y': 488, 'w': 280, 'h': 20, 'text': 'Nasi Putih', 'size': 14, 'color': 'text'},
            {'type': 'rect', 'x': 32, 'y': 528, 'w': 6, 'h': 6, 'fill': 'text_strong', 'radius': 3},
            {'type': 'text', 'x': 48, 'y': 520, 'w': 280, 'h': 20, 'text': 'Ayam Goreng', 'size': 14, 'color': 'text'},
            {'type': 'rect', 'x': 32, 'y': 560, 'w': 6, 'h': 6, 'fill': 'text_strong', 'radius': 3},
            {'type': 'text', 'x': 48, 'y': 552, 'w': 280, 'h': 20, 'text': 'Tumis Bayam', 'size': 14, 'color': 'text'},
            {'type': 'rect', 'x': 32, 'y': 592, 'w': 6, 'h': 6, 'fill': 'text_strong', 'radius': 3},
            {'type': 'text', 'x': 48, 'y': 584, 'w': 280, 'h': 20, 'text': 'Pisang', 'size': 14, 'color': 'text'},
            {'type': 'rect', 'x': 16, 'y': 668, 'w': 358, 'h': 52, 'fill': 'text_strong', 'radius': 12},
            {'type': 'text', 'x': 0, 'y': 684, 'w': 390, 'h': 20, 'text': 'Beri Feedback', 'size': 15, 'weight': 'bold', 'color': 'surface', 'align': 'center'},
            {'type': 'rect', 'x': 0, 'y': 759, 'w': 390, 'h': 1, 'fill': 'border'},
            {'type': 'rect', 'x': 0, 'y': 760, 'w': 390, 'h': 84, 'fill': 'surface'},
            {'type': 'rect', 'x': 51, 'y': 776, 'w': 28, 'h': 28, 'fill': 'text_strong', 'radius': 6},
            {'type': 'text', 'x': 15, 'y': 812, 'w': 100, 'h': 14, 'text': 'Home', 'size': 11, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'rect', 'x': 181, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 145, 'y': 812, 'w': 100, 'h': 14, 'text': 'Riwayat', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 311, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 275, 'y': 812, 'w': 100, 'h': 14, 'text': 'Profil', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 137, 'y': 826, 'w': 116, 'h': 5, 'fill': 'text_strong', 'radius': 3},
        ],
    },
    {
        "id": 'mobile-feedback',
        "name": 'Mobile · Feedback',
        "frame": MOBILE_FRAME,
        "blocks": [
            {'type': 'rect', 'x': 0, 'y': 0, 'w': 390, 'h': 44, 'fill': 'surface'},
            {'type': 'text', 'x': 24, 'y': 14, 'w': 60, 'h': 18, 'text': '9:41', 'size': 15, 'weight': 'bold', 'color': 'text_strong'},
            {'type': 'rect', 'x': 296, 'y': 22, 'w': 3, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 302, 'y': 20, 'w': 3, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 308, 'y': 18, 'w': 3, 'h': 9, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 314, 'y': 16, 'w': 3, 'h': 11, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 325, 'y': 16, 'w': 13, 'h': 11, 'fill': 'text_strong', 'radius': 2},
            {'type': 'rect', 'x': 346, 'y': 17, 'w': 26, 'h': 11, 'fill': 'surface', 'stroke': 'text_strong', 'radius': 3},
            {'type': 'rect', 'x': 349, 'y': 19, 'w': 17, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 372, 'y': 20, 'w': 2, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 0, 'y': 44, 'w': 390, 'h': 56, 'fill': 'surface'},
            {'type': 'rect', 'x': 0, 'y': 100, 'w': 390, 'h': 1, 'fill': 'border'},
            {'type': 'text', 'x': 0, 'y': 66, 'w': 390, 'h': 22, 'text': 'Feedback', 'size': 16, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'text', 'x': 16, 'y': 60, 'w': 32, 'h': 32, 'text': '‹', 'size': 28, 'weight': 'medium', 'color': 'text_strong', 'align': 'center'},
            {'type': 'text', 'x': 0, 'y': 124, 'w': 390, 'h': 28, 'text': 'Menu A', 'size': 20, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'text', 'x': 0, 'y': 156, 'w': 390, 'h': 16, 'text': '13 Juni 2026', 'size': 12, 'color': 'text_muted', 'align': 'center'},
            {'type': 'text', 'x': 24, 'y': 196, 'w': 200, 'h': 18, 'text': 'Berikan Penilaian', 'size': 14, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'text', 'x': 71, 'y': 230, 'w': 40, 'h': 40, 'text': '☆', 'size': 36, 'weight': 'regular', 'color': 'border_strong', 'align': 'center'},
            {'type': 'text', 'x': 123, 'y': 230, 'w': 40, 'h': 40, 'text': '☆', 'size': 36, 'weight': 'regular', 'color': 'border_strong', 'align': 'center'},
            {'type': 'text', 'x': 175, 'y': 230, 'w': 40, 'h': 40, 'text': '☆', 'size': 36, 'weight': 'regular', 'color': 'border_strong', 'align': 'center'},
            {'type': 'text', 'x': 227, 'y': 230, 'w': 40, 'h': 40, 'text': '☆', 'size': 36, 'weight': 'regular', 'color': 'border_strong', 'align': 'center'},
            {'type': 'text', 'x': 279, 'y': 230, 'w': 40, 'h': 40, 'text': '☆', 'size': 36, 'weight': 'regular', 'color': 'border_strong', 'align': 'center'},
            {'type': 'text', 'x': 24, 'y': 312, 'w': 200, 'h': 18, 'text': 'Komentar', 'size': 14, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'rect', 'x': 16, 'y': 340, 'w': 358, 'h': 200, 'fill': 'surface', 'stroke': 'border', 'radius': 12},
            {'type': 'text', 'x': 32, 'y': 360, 'w': 320, 'h': 20, 'text': 'Tulis komentar Anda di sini...', 'size': 13, 'color': 'text_muted'},
            {'type': 'text', 'x': 16, 'y': 512, 'w': 342, 'h': 16, 'text': '0/300', 'size': 11, 'color': 'text_muted', 'align': 'right'},
            {'type': 'rect', 'x': 16, 'y': 668, 'w': 358, 'h': 52, 'fill': 'text_strong', 'radius': 12},
            {'type': 'text', 'x': 0, 'y': 684, 'w': 390, 'h': 20, 'text': 'Kirim Feedback', 'size': 15, 'weight': 'bold', 'color': 'surface', 'align': 'center'},
            {'type': 'rect', 'x': 0, 'y': 759, 'w': 390, 'h': 1, 'fill': 'border'},
            {'type': 'rect', 'x': 0, 'y': 760, 'w': 390, 'h': 84, 'fill': 'surface'},
            {'type': 'rect', 'x': 51, 'y': 776, 'w': 28, 'h': 28, 'fill': 'text_strong', 'radius': 6},
            {'type': 'text', 'x': 15, 'y': 812, 'w': 100, 'h': 14, 'text': 'Home', 'size': 11, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'rect', 'x': 181, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 145, 'y': 812, 'w': 100, 'h': 14, 'text': 'Riwayat', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 311, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 275, 'y': 812, 'w': 100, 'h': 14, 'text': 'Profil', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 137, 'y': 826, 'w': 116, 'h': 5, 'fill': 'text_strong', 'radius': 3},
        ],
    },
    {
        "id": 'mobile-history',
        "name": 'Mobile · Riwayat Menu',
        "frame": MOBILE_FRAME,
        "blocks": [
            {'type': 'rect', 'x': 0, 'y': 0, 'w': 390, 'h': 44, 'fill': 'surface'},
            {'type': 'text', 'x': 24, 'y': 14, 'w': 60, 'h': 18, 'text': '9:41', 'size': 15, 'weight': 'bold', 'color': 'text_strong'},
            {'type': 'rect', 'x': 296, 'y': 22, 'w': 3, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 302, 'y': 20, 'w': 3, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 308, 'y': 18, 'w': 3, 'h': 9, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 314, 'y': 16, 'w': 3, 'h': 11, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 325, 'y': 16, 'w': 13, 'h': 11, 'fill': 'text_strong', 'radius': 2},
            {'type': 'rect', 'x': 346, 'y': 17, 'w': 26, 'h': 11, 'fill': 'surface', 'stroke': 'text_strong', 'radius': 3},
            {'type': 'rect', 'x': 349, 'y': 19, 'w': 17, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 372, 'y': 20, 'w': 2, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 0, 'y': 44, 'w': 390, 'h': 56, 'fill': 'surface'},
            {'type': 'rect', 'x': 0, 'y': 100, 'w': 390, 'h': 1, 'fill': 'border'},
            {'type': 'text', 'x': 0, 'y': 66, 'w': 390, 'h': 22, 'text': 'Riwayat Menu', 'size': 16, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'rect', 'x': 16, 'y': 124, 'w': 358, 'h': 84, 'fill': 'surface', 'stroke': 'border', 'radius': 12},
            {'type': 'text', 'x': 32, 'y': 142, 'w': 240, 'h': 18, 'text': '13 Juni 2026', 'size': 13, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'text', 'x': 32, 'y': 168, 'w': 240, 'h': 18, 'text': 'Menu A', 'size': 14, 'color': 'text'},
            {'type': 'text', 'x': 340, 'y': 154, 'w': 26, 'h': 24, 'text': '›', 'size': 22, 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 16, 'y': 224, 'w': 358, 'h': 84, 'fill': 'surface', 'stroke': 'border', 'radius': 12},
            {'type': 'text', 'x': 32, 'y': 242, 'w': 240, 'h': 18, 'text': '12 Juni 2026', 'size': 13, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'text', 'x': 32, 'y': 268, 'w': 240, 'h': 18, 'text': 'Menu B', 'size': 14, 'color': 'text'},
            {'type': 'text', 'x': 340, 'y': 254, 'w': 26, 'h': 24, 'text': '›', 'size': 22, 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 16, 'y': 324, 'w': 358, 'h': 84, 'fill': 'surface', 'stroke': 'border', 'radius': 12},
            {'type': 'text', 'x': 32, 'y': 342, 'w': 240, 'h': 18, 'text': '11 Juni 2026', 'size': 13, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'text', 'x': 32, 'y': 368, 'w': 240, 'h': 18, 'text': 'Menu C', 'size': 14, 'color': 'text'},
            {'type': 'text', 'x': 340, 'y': 354, 'w': 26, 'h': 24, 'text': '›', 'size': 22, 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 16, 'y': 424, 'w': 358, 'h': 84, 'fill': 'surface', 'stroke': 'border', 'radius': 12},
            {'type': 'text', 'x': 32, 'y': 442, 'w': 240, 'h': 18, 'text': '10 Juni 2026', 'size': 13, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'text', 'x': 32, 'y': 468, 'w': 240, 'h': 18, 'text': 'Menu D', 'size': 14, 'color': 'text'},
            {'type': 'text', 'x': 340, 'y': 454, 'w': 26, 'h': 24, 'text': '›', 'size': 22, 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 0, 'y': 759, 'w': 390, 'h': 1, 'fill': 'border'},
            {'type': 'rect', 'x': 0, 'y': 760, 'w': 390, 'h': 84, 'fill': 'surface'},
            {'type': 'rect', 'x': 51, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 15, 'y': 812, 'w': 100, 'h': 14, 'text': 'Home', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 181, 'y': 776, 'w': 28, 'h': 28, 'fill': 'text_strong', 'radius': 6},
            {'type': 'text', 'x': 145, 'y': 812, 'w': 100, 'h': 14, 'text': 'Riwayat', 'size': 11, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'rect', 'x': 311, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 275, 'y': 812, 'w': 100, 'h': 14, 'text': 'Profil', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 137, 'y': 826, 'w': 116, 'h': 5, 'fill': 'text_strong', 'radius': 3},
        ],
    },
    {
        "id": 'mobile-profile',
        "name": 'Mobile · Profil',
        "frame": MOBILE_FRAME,
        "blocks": [
            {'type': 'rect', 'x': 0, 'y': 0, 'w': 390, 'h': 44, 'fill': 'surface'},
            {'type': 'text', 'x': 24, 'y': 14, 'w': 60, 'h': 18, 'text': '9:41', 'size': 15, 'weight': 'bold', 'color': 'text_strong'},
            {'type': 'rect', 'x': 296, 'y': 22, 'w': 3, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 302, 'y': 20, 'w': 3, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 308, 'y': 18, 'w': 3, 'h': 9, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 314, 'y': 16, 'w': 3, 'h': 11, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 325, 'y': 16, 'w': 13, 'h': 11, 'fill': 'text_strong', 'radius': 2},
            {'type': 'rect', 'x': 346, 'y': 17, 'w': 26, 'h': 11, 'fill': 'surface', 'stroke': 'text_strong', 'radius': 3},
            {'type': 'rect', 'x': 349, 'y': 19, 'w': 17, 'h': 7, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 372, 'y': 20, 'w': 2, 'h': 5, 'fill': 'text_strong', 'radius': 1},
            {'type': 'rect', 'x': 0, 'y': 44, 'w': 390, 'h': 56, 'fill': 'surface'},
            {'type': 'rect', 'x': 0, 'y': 100, 'w': 390, 'h': 1, 'fill': 'border'},
            {'type': 'text', 'x': 0, 'y': 66, 'w': 390, 'h': 22, 'text': 'Profil', 'size': 16, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'rect', 'x': 147, 'y': 132, 'w': 96, 'h': 96, 'fill': 'placeholder', 'stroke': 'border_strong', 'radius': 48},
            {'type': 'rect', 'x': 175, 'y': 152, 'w': 40, 'h': 40, 'fill': 'border_strong', 'radius': 20},
            {'type': 'rect', 'x': 163, 'y': 198, 'w': 64, 'h': 40, 'fill': 'border_strong', 'radius': 32},
            {'type': 'text', 'x': 0, 'y': 252, 'w': 390, 'h': 24, 'text': 'Petugas Sekolah', 'size': 18, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'text', 'x': 0, 'y': 282, 'w': 390, 'h': 16, 'text': 'petugas@sekolah.id', 'size': 13, 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 16, 'y': 332, 'w': 358, 'h': 56, 'fill': 'surface', 'stroke': 'border', 'radius': 12},
            {'type': 'rect', 'x': 32, 'y': 348, 'w': 24, 'h': 24, 'fill': 'placeholder', 'radius': 4},
            {'type': 'text', 'x': 68, 'y': 350, 'w': 240, 'h': 20, 'text': 'Informasi Akun', 'size': 14, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'text', 'x': 340, 'y': 346, 'w': 26, 'h': 24, 'text': '›', 'size': 22, 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 16, 'y': 400, 'w': 358, 'h': 56, 'fill': 'surface', 'stroke': 'border', 'radius': 12},
            {'type': 'rect', 'x': 32, 'y': 416, 'w': 24, 'h': 24, 'fill': 'placeholder', 'radius': 4},
            {'type': 'text', 'x': 68, 'y': 418, 'w': 240, 'h': 20, 'text': 'Status Feedback', 'size': 14, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'text', 'x': 340, 'y': 414, 'w': 26, 'h': 24, 'text': '›', 'size': 22, 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 16, 'y': 468, 'w': 358, 'h': 56, 'fill': 'surface', 'stroke': 'border', 'radius': 12},
            {'type': 'rect', 'x': 32, 'y': 484, 'w': 24, 'h': 24, 'fill': 'placeholder', 'radius': 4},
            {'type': 'text', 'x': 68, 'y': 486, 'w': 240, 'h': 20, 'text': 'Tentang Aplikasi', 'size': 14, 'weight': 'medium', 'color': 'text_strong'},
            {'type': 'text', 'x': 340, 'y': 482, 'w': 26, 'h': 24, 'text': '›', 'size': 22, 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 16, 'y': 564, 'w': 358, 'h': 52, 'fill': 'placeholder', 'radius': 12},
            {'type': 'text', 'x': 0, 'y': 580, 'w': 390, 'h': 20, 'text': 'Logout', 'size': 15, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'rect', 'x': 0, 'y': 759, 'w': 390, 'h': 1, 'fill': 'border'},
            {'type': 'rect', 'x': 0, 'y': 760, 'w': 390, 'h': 84, 'fill': 'surface'},
            {'type': 'rect', 'x': 51, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 15, 'y': 812, 'w': 100, 'h': 14, 'text': 'Home', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 181, 'y': 776, 'w': 28, 'h': 28, 'fill': 'surface', 'stroke': 'border_strong', 'radius': 6},
            {'type': 'text', 'x': 145, 'y': 812, 'w': 100, 'h': 14, 'text': 'Riwayat', 'size': 11, 'weight': 'regular', 'color': 'text_muted', 'align': 'center'},
            {'type': 'rect', 'x': 311, 'y': 776, 'w': 28, 'h': 28, 'fill': 'text_strong', 'radius': 6},
            {'type': 'text', 'x': 275, 'y': 812, 'w': 100, 'h': 14, 'text': 'Profil', 'size': 11, 'weight': 'bold', 'color': 'text_strong', 'align': 'center'},
            {'type': 'rect', 'x': 137, 'y': 826, 'w': 116, 'h': 5, 'fill': 'text_strong', 'radius': 3},
        ],
    },
]

ALL_SCREENS = WEB_SCREENS + MOBILE_SCREENS
