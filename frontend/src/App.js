import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import {
  Download,
  Code2,
  ExternalLink,
  Copy,
  Layout,
  Smartphone,
  Monitor,
  CheckCircle2,
  FileText,
  Figma,
} from "lucide-react";
import "./App.css";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND}/api`;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fontWeight(w) {
  if (w === "bold") return 700;
  if (w === "medium") return 500;
  return 400;
}

function Block({ block, colors }) {
  const { x, y, w, h, type } = block;
  if (type === "rect") {
    const bg = colors[block.fill] || "transparent";
    const border = block.stroke ? `1px solid ${colors[block.stroke]}` : "none";
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          background: bg,
          border,
          borderRadius: block.radius || 0,
          boxSizing: "border-box",
        }}
      />
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        color: colors[block.color] || "#000",
        fontSize: block.size || 14,
        fontWeight: fontWeight(block.weight),
        textAlign: block.align || "left",
        fontFamily: "Inter, system-ui, sans-serif",
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
        overflow: "hidden",
      }}
    >
      {block.text}
    </div>
  );
}

function Wireframe({ screen, colors, scale }) {
  const { frame, blocks } = screen;
  return (
    <div
      style={{
        width: frame.w * scale,
        height: frame.h * scale,
        position: "relative",
      }}
    >
      <div
        style={{
          width: frame.w,
          height: frame.h,
          background: colors.bg,
          position: "relative",
          overflow: "hidden",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {blocks.map((b, i) => (
          <Block key={i} block={b} colors={colors} />
        ))}
      </div>
    </div>
  );
}

function buildScreenHtml(screen, colors) {
  const parts = screen.blocks.map((b) => {
    if (b.type === "rect") {
      const bg = colors[b.fill] || "transparent";
      const border = b.stroke ? `1px solid ${colors[b.stroke]}` : "none";
      return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;background:${bg};border:${border};border-radius:${b.radius || 0}px;box-sizing:border-box;"></div>`;
    }
    const color = colors[b.color] || "#000";
    return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;color:${color};font-size:${b.size || 14}px;font-weight:${fontWeight(b.weight)};text-align:${b.align || "left"};font-family:Inter,system-ui,sans-serif;line-height:1.3;letter-spacing:-0.01em;">${escapeHtml(b.text || "")}</div>`;
  });
  return `<div style="position:relative;width:${screen.frame.w}px;height:${screen.frame.h}px;background:${colors.bg};">\n${parts.join("\n")}\n</div>`;
}

export default function App() {
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [scope, setScope] = useState("all"); // all | web | mobile
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 1000, h: 800 });

  useEffect(() => {
    axios
      .get(`${API}/wireframes`)
      .then((r) => {
        setData(r.data);
        if (r.data.screens.length) setSelectedId(r.data.screens[0].id);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Gagal memuat wireframe. Periksa koneksi backend.");
      });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setContainerSize({ w: e.contentRect.width, h: e.contentRect.height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [data]);

  const filteredScreens = useMemo(() => {
    if (!data) return [];
    if (scope === "web") return data.screens.filter((s) => s.id.startsWith("web-"));
    if (scope === "mobile")
      return data.screens.filter((s) => s.id.startsWith("mobile-"));
    return data.screens;
  }, [data, scope]);

  const selected = useMemo(() => {
    if (!data) return null;
    return (
      data.screens.find((s) => s.id === selectedId) ||
      filteredScreens[0] ||
      data.screens[0] ||
      null
    );
  }, [data, selectedId, filteredScreens]);

  const handleScopeChange = (next) => {
    setScope(next);
    if (!data) return;
    const list =
      next === "web"
        ? data.screens.filter((s) => s.id.startsWith("web-"))
        : next === "mobile"
        ? data.screens.filter((s) => s.id.startsWith("mobile-"))
        : data.screens;
    if (list.length && !list.find((s) => s.id === selectedId)) {
      setSelectedId(list[0].id);
    }
  };

  const scale = useMemo(() => {
    if (!selected) return 1;
    const padding = 96;
    const sw = (containerSize.w - padding) / selected.frame.w;
    const sh = (containerSize.h - padding) / selected.frame.h;
    return Math.min(1, sw, sh);
  }, [selected, containerSize]);

  const handleDownloadPlugin = async () => {
    const url = `${API}/figma-plugin/download`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "mbg-wireframe-plugin.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Plugin Figma diunduh. Lihat panduan di kanan.");
  };

  const handleCopyHtml = async () => {
    if (!selected || !data) return;
    const html = buildScreenHtml(selected, data.colors);
    try {
      await navigator.clipboard.writeText(html);
      toast.success("HTML wireframe disalin. Paste ke plugin html.to.design di Figma.");
    } catch {
      toast.error("Tidak bisa menyalin. Coba pakai tombol Buka HTML.");
    }
  };

  const handleOpenHtml = () => {
    if (!selected) return;
    window.open(`${API}/wireframes/${selected.id}/html`, "_blank");
  };

  const handleOpenAllHtml = () => {
    window.open(`${API}/wireframes/all/html`, "_blank");
  };

  if (!data) {
    return (
      <div className="loading-wrap">
        <div className="loading-dot" />
        <div className="loading-text">Memuat wireframe...</div>
      </div>
    );
  }

  const webCount = data.screens.filter((s) => s.id.startsWith("web-")).length;
  const mobCount = data.screens.filter((s) => s.id.startsWith("mobile-")).length;

  return (
    <div className="app-shell" data-testid="app-shell">
      <Toaster position="top-right" theme="light" richColors />

      {/* Sidebar */}
      <aside className="sidebar" data-testid="sidebar">
        <div className="brand">
          <div className="brand-mark">MBG</div>
          <div>
            <div className="brand-name">Wireframe Studio</div>
            <div className="brand-sub">Menu Planner · Mid-fi</div>
          </div>
        </div>

        <div className="scope-row" data-testid="scope-tabs">
          <button
            className={`scope-btn ${scope === "all" ? "active" : ""}`}
            onClick={() => handleScopeChange("all")}
            data-testid="scope-all"
          >
            <Layout size={14} /> Semua
          </button>
          <button
            className={`scope-btn ${scope === "web" ? "active" : ""}`}
            onClick={() => handleScopeChange("web")}
            data-testid="scope-web"
          >
            <Monitor size={14} /> Web
          </button>
          <button
            className={`scope-btn ${scope === "mobile" ? "active" : ""}`}
            onClick={() => handleScopeChange("mobile")}
            data-testid="scope-mobile"
          >
            <Smartphone size={14} /> Mobile
          </button>
        </div>

        <div className="screen-group">
          {scope !== "mobile" && (
            <>
              <div className="screen-group-title">
                <Monitor size={12} /> Web Admin · {webCount}
              </div>
              {data.screens
                .filter((s) => s.id.startsWith("web-"))
                .map((s) => (
                  <button
                    key={s.id}
                    className={`screen-item ${selectedId === s.id ? "active" : ""}`}
                    onClick={() => setSelectedId(s.id)}
                    data-testid={`screen-${s.id}`}
                  >
                    {s.name.replace("Web · ", "")}
                  </button>
                ))}
            </>
          )}

          {scope !== "web" && (
            <>
              <div className="screen-group-title mt">
                <Smartphone size={12} /> Mobile · {mobCount}
              </div>
              {data.screens
                .filter((s) => s.id.startsWith("mobile-"))
                .map((s) => (
                  <button
                    key={s.id}
                    className={`screen-item ${selectedId === s.id ? "active" : ""}`}
                    onClick={() => setSelectedId(s.id)}
                    data-testid={`screen-${s.id}`}
                  >
                    {s.name.replace("Mobile · ", "")}
                  </button>
                ))}
            </>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="footer-card">
            <FileText size={14} />
            <div>
              <div className="fc-title">14 wireframe</div>
              <div className="fc-sub">Web Admin + Mobile App</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topbar" data-testid="topbar">
          <div className="topbar-left">
            <div className="screen-title">{selected?.name}</div>
            <div className="screen-meta">
              {selected?.frame.w} × {selected?.frame.h} px · {Math.round(scale * 100)}%
            </div>
          </div>
          <div className="topbar-actions">
            <button
              className="btn ghost"
              onClick={handleCopyHtml}
              data-testid="copy-html-btn"
              title="Salin HTML wireframe terpilih"
            >
              <Copy size={14} /> Copy HTML
            </button>
            <button
              className="btn ghost"
              onClick={handleOpenHtml}
              data-testid="open-html-btn"
              title="Buka HTML di tab baru"
            >
              <ExternalLink size={14} /> Buka HTML
            </button>
            <button
              className="btn ghost"
              onClick={handleOpenAllHtml}
              data-testid="open-all-html-btn"
            >
              <Code2 size={14} /> Semua HTML
            </button>
            <button
              className="btn primary"
              onClick={handleDownloadPlugin}
              data-testid="download-plugin-btn"
            >
              <Download size={14} /> Download Plugin Figma
            </button>
          </div>
        </header>

        <div className="main-content">
          <div className="canvas" ref={containerRef} data-testid="canvas">
            {selected && (
              <Wireframe screen={selected} colors={data.colors} scale={scale} />
            )}
          </div>

          <aside className="howto" data-testid="howto">
            <div className="howto-title">
              <Figma size={14} /> Cara import ke Figma
            </div>
            <ol className="howto-list">
              <li>
                <b>Cara 1 — Plugin (otomatis, direkomendasikan)</b>
                <ol>
                  <li>Klik <i>Download Plugin Figma</i> di atas, unzip filenya.</li>
                  <li>Buka <b>Figma Desktop</b> → Plugins → Development → <b>Import plugin from manifest…</b></li>
                  <li>Pilih <code>manifest.json</code> di folder yang baru diunzip.</li>
                  <li>Jalankan plugin <b>MBG Wireframe Generator</b> → klik <i>Generate Semua</i>.</li>
                </ol>
              </li>
              <li className="mt8">
                <b>Cara 2 — Plugin html.to.design</b>
                <ol>
                  <li>Install plugin gratis <b>html.to.design</b> di Figma.</li>
                  <li>Klik <i>Buka HTML</i> di atas, copy URL, lalu paste ke plugin.</li>
                </ol>
              </li>
            </ol>
            <div className="ok-row">
              <CheckCircle2 size={14} /> Wireframe sudah sesuai BRD MBG (14 layar).
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
