import React from "react";
import { Download, Code2, ExternalLink, Copy } from "lucide-react";

export default function Topbar({
  selected,
  scalePct,
  onCopyHtml,
  onOpenHtml,
  onOpenAllHtml,
  onDownloadPlugin,
}) {
  return (
    <header className="topbar" data-testid="topbar">
      <div className="topbar-left">
        <div className="screen-title">{selected?.name}</div>
        <div className="screen-meta">
          {selected?.frame.w} × {selected?.frame.h} px · {scalePct}%
        </div>
      </div>
      <div className="topbar-actions">
        <button
          className="btn ghost"
          onClick={onCopyHtml}
          data-testid="copy-html-btn"
          title="Salin HTML wireframe terpilih"
        >
          <Copy size={14} /> Copy HTML
        </button>
        <button
          className="btn ghost"
          onClick={onOpenHtml}
          data-testid="open-html-btn"
          title="Buka HTML di tab baru"
        >
          <ExternalLink size={14} /> Buka HTML
        </button>
        <button
          className="btn ghost"
          onClick={onOpenAllHtml}
          data-testid="open-all-html-btn"
        >
          <Code2 size={14} /> Semua HTML
        </button>
        <button
          className="btn primary"
          onClick={onDownloadPlugin}
          data-testid="download-plugin-btn"
        >
          <Download size={14} /> Download Plugin Figma
        </button>
      </div>
    </header>
  );
}
