import { useCallback, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import HowtoGuide from "@/components/HowtoGuide";
import Wireframe from "@/components/Wireframe";

import { useWireframeData } from "@/hooks/use-wireframe-data";
import { useElementSize } from "@/hooks/use-element-size";

import { buildScreenHtml } from "@/lib/wireframe-html";
import {
  API,
  CANVAS_PADDING_PX,
  WEB_PREFIX,
  MOBILE_PREFIX,
  SCOPE_ALL,
  SCOPE_WEB,
  SCOPE_MOBILE,
} from "@/constants/app";

import "@/App.css";

function screensForScope(screens, scope) {
  if (scope === SCOPE_WEB) return screens.filter((s) => s.id.startsWith(WEB_PREFIX));
  if (scope === SCOPE_MOBILE) return screens.filter((s) => s.id.startsWith(MOBILE_PREFIX));
  return screens;
}

function computeScale(selected, size) {
  if (!selected) return 1;
  const widthRatio = (size.w - CANVAS_PADDING_PX) / selected.frame.w;
  const heightRatio = (size.h - CANVAS_PADDING_PX) / selected.frame.h;
  return Math.min(1, widthRatio, heightRatio);
}

function LoadingScreen() {
  return (
    <div className="loading-wrap">
      <div className="loading-dot" />
      <div className="loading-text">Memuat wireframe...</div>
    </div>
  );
}

export default function WireframeStudio() {
  const data = useWireframeData();
  const [selectedId, setSelectedId] = useState(null);
  const [scope, setScope] = useState(SCOPE_ALL);
  const canvasRef = useRef(null);
  const canvasSize = useElementSize(canvasRef);

  const webScreens = useMemo(
    () => (data ? data.screens.filter((s) => s.id.startsWith(WEB_PREFIX)) : []),
    [data]
  );
  const mobileScreens = useMemo(
    () => (data ? data.screens.filter((s) => s.id.startsWith(MOBILE_PREFIX)) : []),
    [data]
  );

  const scopedScreens = useMemo(
    () => (data ? screensForScope(data.screens, scope) : []),
    [data, scope]
  );

  const selected = useMemo(() => {
    if (!data) return null;
    const byId = data.screens.find((s) => s.id === selectedId);
    if (byId) return byId;
    if (scopedScreens.length > 0) return scopedScreens[0];
    return data.screens[0] || null;
  }, [data, selectedId, scopedScreens]);

  const scale = useMemo(() => computeScale(selected, canvasSize), [selected, canvasSize]);
  const scalePct = Math.round(scale * 100);

  const handleScopeChange = useCallback(
    (nextScope) => {
      setScope(nextScope);
      if (!data) return;
      const list = screensForScope(data.screens, nextScope);
      if (list.length > 0 && !list.find((s) => s.id === selectedId)) {
        setSelectedId(list[0].id);
      }
    },
    [data, selectedId]
  );

  const handleDownloadPlugin = useCallback(() => {
    const anchor = document.createElement("a");
    anchor.href = `${API}/figma-plugin/download`;
    anchor.download = "mbg-wireframe-plugin.zip";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    toast.success("Plugin Figma diunduh. Lihat panduan di kanan.");
  }, []);

  const handleCopyHtml = useCallback(async () => {
    if (!selected || !data) return;
    const html = buildScreenHtml(selected, data.colors);
    try {
      await navigator.clipboard.writeText(html);
      toast.success("HTML wireframe disalin. Paste ke plugin html.to.design di Figma.");
    } catch {
      toast.error("Tidak bisa menyalin. Coba pakai tombol Buka HTML.");
    }
  }, [selected, data]);

  const handleOpenHtml = useCallback(() => {
    if (!selected) return;
    window.open(`${API}/wireframes/${selected.id}/html`, "_blank");
  }, [selected]);

  const handleOpenAllHtml = useCallback(() => {
    window.open(`${API}/wireframes/all/html`, "_blank");
  }, []);

  if (!data) return <LoadingScreen />;

  return (
    <div className="app-shell" data-testid="app-shell">
      <Toaster position="top-right" theme="light" richColors />

      <Sidebar
        scope={scope}
        onScopeChange={handleScopeChange}
        webScreens={webScreens}
        mobileScreens={mobileScreens}
        selectedId={selected?.id || null}
        onSelect={setSelectedId}
      />

      <main className="main">
        <Topbar
          selected={selected}
          scalePct={scalePct}
          onCopyHtml={handleCopyHtml}
          onOpenHtml={handleOpenHtml}
          onOpenAllHtml={handleOpenAllHtml}
          onDownloadPlugin={handleDownloadPlugin}
        />

        <div className="main-content">
          <div className="canvas" ref={canvasRef} data-testid="canvas">
            {selected && (
              <Wireframe screen={selected} colors={data.colors} scale={scale} />
            )}
          </div>
          <HowtoGuide totalScreens={data.screens.length} />
        </div>
      </main>
    </div>
  );
}
