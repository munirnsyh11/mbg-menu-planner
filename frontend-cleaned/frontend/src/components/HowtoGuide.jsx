import React from "react";
import { Figma, CheckCircle2 } from "lucide-react";

export default function HowtoGuide({ totalScreens }) {
  return (
    <aside className="howto" data-testid="howto">
      <div className="howto-title">
        <Figma size={14} /> Cara import ke Figma
      </div>
      <ol className="howto-list">
        <li>
          <b>Cara 1 — Plugin (otomatis, direkomendasikan)</b>
          <ol>
            <li>Klik <i>Download Plugin Figma</i> di atas, unzip filenya.</li>
            <li>
              Buka <b>Figma Desktop</b> → Plugins → Development →{" "}
              <b>Import plugin from manifest…</b>
            </li>
            <li>Pilih <code>manifest.json</code> di folder yang baru diunzip.</li>
            <li>
              Jalankan plugin <b>MBG Wireframe Generator</b> → klik{" "}
              <i>Generate Semua</i>.
            </li>
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
        <CheckCircle2 size={14} /> Wireframe sudah sesuai BRD MBG ({totalScreens} layar).
      </div>
    </aside>
  );
}
