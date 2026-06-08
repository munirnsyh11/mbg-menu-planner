import io
import json
import logging
import os
import zipfile
from html import escape
from pathlib import Path

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import HTMLResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware

from wireframe_spec import ALL_SCREENS, COLORS, WEB_SCREENS, MOBILE_SCREENS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

app = FastAPI(title="MBG Wireframe Studio")
api_router = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _screen_summary(s):
    return {
        "id": s["id"],
        "name": s["name"],
        "frame": s["frame"],
        "blocks": s["blocks"],
    }


def _font_weight(weight):
    return {"regular": 400, "medium": 500, "bold": 700}.get(weight, 400)


def _render_blocks_html(blocks):
    parts = []
    for b in blocks:
        x, y = b["x"], b["y"]
        w = b.get("w", 0)
        h = b.get("h", 0)
        if b["type"] == "rect":
            fill = COLORS.get(b.get("fill", "surface"), "transparent")
            radius = b.get("radius", 0)
            stroke = b.get("stroke")
            border = f"1px solid {COLORS[stroke]}" if stroke else "none"
            parts.append(
                f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
                f'background:{fill};border:{border};border-radius:{radius}px;box-sizing:border-box;"></div>'
            )
        else:  # text
            color = COLORS.get(b.get("color", "text"), "#000")
            size = b.get("size", 14)
            weight = _font_weight(b.get("weight", "regular"))
            align = b.get("align", "left")
            text = escape(b.get("text", ""))
            parts.append(
                f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
                f"color:{color};font-size:{size}px;font-weight:{weight};text-align:{align};"
                f'font-family:Inter,system-ui,sans-serif;line-height:1.3;letter-spacing:-0.01em;">'
                f"{text}</div>"
            )
    return "\n".join(parts)


def _render_screen_html(screen, include_label=True):
    w = screen["frame"]["w"]
    h = screen["frame"]["h"]
    label = (
        f'<div style="position:absolute;left:0;top:-32px;width:{w}px;height:24px;'
        f'color:{COLORS["text_strong"]};font-size:14px;font-weight:600;'
        f'font-family:Inter,system-ui,sans-serif;">{escape(screen["name"])}</div>'
        if include_label
        else ""
    )
    return (
        f'<div data-screen-id="{screen["id"]}" '
        f'style="position:relative;width:{w}px;height:{h}px;background:{COLORS["bg"]};'
        f'border:1px solid {COLORS["border"]};border-radius:8px;overflow:hidden;'
        f'box-shadow:0 1px 2px rgba(0,0,0,0.04);">'
        f"{label}"
        f'{_render_blocks_html(screen["blocks"])}'
        f"</div>"
    )


def _build_full_html(screens, title="MBG Wireframes"):
    sections = []
    web = [s for s in screens if s["id"].startswith("web-")]
    mob = [s for s in screens if s["id"].startswith("mobile-")]

    def _group(title, items):
        cards = "\n".join(
            f'<div style="margin:0 48px 96px 0;display:inline-block;vertical-align:top;">'
            f"{_render_screen_html(s)}"
            f"</div>"
            for s in items
        )
        return (
            f'<section style="margin-bottom:80px;">'
            f'<h2 style="font-family:Inter,system-ui,sans-serif;font-size:24px;'
            f'margin:0 0 48px;color:{COLORS["text_strong"]};letter-spacing:-0.02em;">'
            f"{escape(title)}</h2>"
            f"<div>{cards}</div>"
            f"</section>"
        )

    if web:
        sections.append(_group("Web Admin", web))
    if mob:
        sections.append(_group("Mobile App", mob))

    return (
        "<!doctype html><html><head><meta charset='utf-8'>"
        f"<title>{escape(title)}</title>"
        "<style>body{margin:0;padding:64px;background:#FAFAFA;}"
        "*{box-sizing:border-box;}</style></head>"
        f"<body>{''.join(sections)}</body></html>"
    )


# ---------------------------------------------------------------------------
# API routes
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {
        "app": "MBG Wireframe Studio",
        "screens": len(ALL_SCREENS),
        "web_screens": len(WEB_SCREENS),
        "mobile_screens": len(MOBILE_SCREENS),
    }


@api_router.get("/wireframes")
async def list_wireframes():
    return {
        "colors": COLORS,
        "screens": [_screen_summary(s) for s in ALL_SCREENS],
    }


@api_router.get("/wireframes/all/html", response_class=HTMLResponse)
async def all_screens_html():
    return HTMLResponse(_build_full_html(ALL_SCREENS))


@api_router.get("/wireframes/{screen_id}/html", response_class=HTMLResponse)
async def screen_html(screen_id: str):
    screen = next((s for s in ALL_SCREENS if s["id"] == screen_id), None)
    if not screen:
        raise HTTPException(status_code=404, detail="Screen not found")
    w = screen["frame"]["w"]
    h = screen["frame"]["h"]
    body = _render_screen_html(screen, include_label=False)
    html = (
        "<!doctype html><html><head><meta charset='utf-8'>"
        f"<title>{escape(screen['name'])}</title>"
        "<style>body{margin:0;padding:0;background:#FAFAFA;}*{box-sizing:border-box;}</style>"
        "</head><body>"
        f'<div style="width:{w}px;height:{h}px;">{body}</div>'
        "</body></html>"
    )
    return HTMLResponse(html)


@api_router.get("/figma-plugin/download")
async def figma_plugin_zip():
    """Return a self-contained Figma plugin (zip) the user can load via
    Figma Desktop → Plugins → Development → Import plugin from manifest."""
    spec_json = json.dumps(
        {"colors": COLORS, "screens": [_screen_summary(s) for s in ALL_SCREENS]},
        ensure_ascii=False,
    )

    manifest = {
        "name": "MBG Wireframe Generator",
        "id": "mbg-wireframe-generator",
        "api": "1.0.0",
        "main": "code.js",
        "ui": "ui.html",
        "editorType": ["figma"],
        "networkAccess": {"allowedDomains": ["none"]},
    }

    code_js = _build_plugin_code(spec_json)
    ui_html = _build_plugin_ui()
    readme = _build_plugin_readme()

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("mbg-wireframe-plugin/manifest.json", json.dumps(manifest, indent=2))
        z.writestr("mbg-wireframe-plugin/code.js", code_js)
        z.writestr("mbg-wireframe-plugin/ui.html", ui_html)
        z.writestr("mbg-wireframe-plugin/README.md", readme)

    buf.seek(0)
    return Response(
        content=buf.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="mbg-wireframe-plugin.zip"'},
    )


def _build_plugin_code(spec_json: str) -> str:
    return (
        "// MBG Wireframe Generator — Figma Plugin\n"
        "// Auto-generates all wireframes onto the canvas.\n"
        "const SPEC = " + spec_json + ";\n\n"
        + r"""
figma.showUI(__html__, { width: 320, height: 380 });

function hexToRgb(hex) {
  const m = hex.replace('#', '');
  return {
    r: parseInt(m.substring(0, 2), 16) / 255,
    g: parseInt(m.substring(2, 4), 16) / 255,
    b: parseInt(m.substring(4, 6), 16) / 255,
  };
}

function solid(hex) { return [{ type: 'SOLID', color: hexToRgb(hex) }]; }

function fontWeight(w) {
  if (w === 'bold') return 'Bold';
  if (w === 'medium') return 'Medium';
  return 'Regular';
}

async function loadFonts() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
}

function buildBlock(block, colors) {
  if (block.type === 'rect') {
    const r = figma.createRectangle();
    r.x = block.x;
    r.y = block.y;
    r.resize(Math.max(1, block.w), Math.max(1, block.h));
    r.fills = solid(colors[block.fill] || '#FFFFFF');
    if (block.stroke) {
      r.strokes = solid(colors[block.stroke] || '#D4D4D8');
      r.strokeWeight = 1;
    }
    if (block.radius) r.cornerRadius = block.radius;
    return r;
  }
  if (block.type === 'text') {
    const t = figma.createText();
    t.fontName = { family: 'Inter', style: fontWeight(block.weight) };
    t.characters = block.text || '';
    t.fontSize = block.size || 14;
    t.fills = solid(colors[block.color] || '#18181B');
    t.x = block.x;
    t.y = block.y;
    if (block.w) {
      t.resize(block.w, Math.max(t.height, block.h || t.height));
      t.textAutoResize = 'HEIGHT';
    }
    if (block.align === 'center') t.textAlignHorizontal = 'CENTER';
    if (block.align === 'right') t.textAlignHorizontal = 'RIGHT';
    return t;
  }
  return null;
}

function buildScreen(screen, colors, offsetX, offsetY) {
  const frame = figma.createFrame();
  frame.name = screen.name;
  frame.x = offsetX;
  frame.y = offsetY;
  frame.resize(screen.frame.w, screen.frame.h);
  frame.fills = solid(colors.bg || '#F4F4F5');
  frame.cornerRadius = 8;
  frame.clipsContent = true;

  for (const block of screen.blocks) {
    const node = buildBlock(block, colors);
    if (node) frame.appendChild(node);
  }
  return frame;
}

async function generate(scope) {
  await loadFonts();

  const colors = SPEC.colors;
  let screens = SPEC.screens;
  if (scope === 'web') screens = screens.filter(s => s.id.indexOf('web-') === 0);
  if (scope === 'mobile') screens = screens.filter(s => s.id.indexOf('mobile-') === 0);

  const page = figma.currentPage;
  const created = [];

  const COL_GAP = 80;
  const ROW_GAP = 120;

  // Two-row layout: web row + mobile row
  const webItems = screens.filter(s => s.id.indexOf('web-') === 0);
  const mobItems = screens.filter(s => s.id.indexOf('mobile-') === 0);

  let xCursor = 0;
  let yCursor = 0;

  for (const s of webItems) {
    const node = buildScreen(s, colors, xCursor, yCursor);
    page.appendChild(node);
    created.push(node);
    xCursor += s.frame.w + COL_GAP;
  }

  if (mobItems.length) {
    yCursor += 900 + ROW_GAP; // below web row
    xCursor = 0;
    for (const s of mobItems) {
      const node = buildScreen(s, colors, xCursor, yCursor);
      page.appendChild(node);
      created.push(node);
      xCursor += s.frame.w + COL_GAP;
    }
  }

  if (created.length) {
    figma.viewport.scrollAndZoomIntoView(created);
  }
  figma.notify('Berhasil membuat ' + created.length + ' wireframe.');
  figma.ui.postMessage({ type: 'done', count: created.length });
}

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'generate') {
      await generate(msg.scope || 'all');
    } else if (msg.type === 'close') {
      figma.closePlugin();
    }
  } catch (e) {
    figma.notify('Error: ' + (e && e.message ? e.message : e), { error: true });
    figma.ui.postMessage({ type: 'error', message: String(e && e.message ? e.message : e) });
  }
};
"""
    )


def _build_plugin_ui() -> str:
    return r"""<!doctype html>
<html><head><meta charset="utf-8">
<style>
  body { margin:0; padding:20px; font-family: Inter, system-ui, sans-serif; background:#fafafa; color:#18181B; }
  h1 { font-size:14px; margin:0 0 4px; letter-spacing:-0.01em; }
  p  { font-size:11px; color:#71717A; margin:0 0 16px; line-height:1.4; }
  .row { display:flex; gap:8px; margin-bottom:8px; }
  button { flex:1; padding:10px 12px; border-radius:8px; border:1px solid #D4D4D8; background:#fff; cursor:pointer; font-size:12px; font-weight:500; }
  button.primary { background:#18181B; color:#fff; border-color:#18181B; }
  button:hover { opacity:0.9; }
  .status { margin-top:12px; font-size:11px; color:#71717A; min-height:14px; }
  .footer { position:absolute; bottom:12px; left:20px; right:20px; font-size:10px; color:#A1A1AA; }
</style></head>
<body>
  <h1>MBG Wireframe Generator</h1>
  <p>Generate semua wireframe MBG Menu Planner ke canvas Figma. Pilih scope di bawah.</p>
  <button class="primary" id="all">Generate Semua (Web + Mobile)</button>
  <div class="row" style="margin-top:8px;">
    <button id="web">Hanya Web</button>
    <button id="mobile">Hanya Mobile</button>
  </div>
  <div class="status" id="status"></div>
  <div class="footer">Mid-fidelity · Greyscale · Inter</div>
<script>
  const status = document.getElementById('status');
  function send(scope){
    status.textContent = 'Memproses...';
    parent.postMessage({ pluginMessage: { type:'generate', scope } }, '*');
  }
  document.getElementById('all').onclick    = () => send('all');
  document.getElementById('web').onclick    = () => send('web');
  document.getElementById('mobile').onclick = () => send('mobile');
  window.onmessage = (e) => {
    const m = e.data.pluginMessage;
    if (!m) return;
    if (m.type === 'done')  status.textContent = 'Selesai · ' + m.count + ' frame dibuat.';
    if (m.type === 'error') status.textContent = 'Error: ' + m.message;
  };
</script>
</body></html>
"""


def _build_plugin_readme() -> str:
    return (
        "# MBG Wireframe Generator (Figma Plugin)\n\n"
        "Plugin ini membuat seluruh wireframe MBG Menu Planner langsung di canvas Figma.\n\n"
        "## Cara Pasang\n\n"
        "1. Unzip folder ini di komputer Anda.\n"
        "2. Buka **Figma Desktop App** (tidak bisa di Figma Web).\n"
        "3. Menu: **Plugins → Development → Import plugin from manifest...**\n"
        "4. Pilih file `manifest.json` di dalam folder ini.\n"
        "5. Jalankan plugin: **Plugins → Development → MBG Wireframe Generator**.\n"
        "6. Klik **Generate Semua** — semua frame Web + Mobile akan otomatis terbuat di canvas.\n\n"
        "## Catatan\n\n"
        "- Mid-fidelity, palet abu-abu, font Inter.\n"
        "- Plugin tidak membutuhkan akses internet.\n"
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)
