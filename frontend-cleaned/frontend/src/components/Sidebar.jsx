import React from "react";
import {
  Layout,
  Smartphone,
  Monitor,
  FileText,
} from "lucide-react";
import {
  SCOPE_ALL,
  SCOPE_WEB,
  SCOPE_MOBILE,
  WEB_PREFIX,
  MOBILE_PREFIX,
} from "@/constants/app";

function ScreenList({ screens, selectedId, onSelect, prefix, replaceText }) {
  return screens.map((s) => (
    <button
      key={s.id}
      className={`screen-item ${selectedId === s.id ? "active" : ""}`}
      onClick={() => onSelect(s.id)}
      data-testid={`screen-${s.id}`}
    >
      {s.name.replace(replaceText, "")}
    </button>
  ));
}

export default function Sidebar({
  scope,
  onScopeChange,
  webScreens,
  mobileScreens,
  selectedId,
  onSelect,
}) {
  return (
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
          className={`scope-btn ${scope === SCOPE_ALL ? "active" : ""}`}
          onClick={() => onScopeChange(SCOPE_ALL)}
          data-testid="scope-all"
        >
          <Layout size={14} /> Semua
        </button>
        <button
          className={`scope-btn ${scope === SCOPE_WEB ? "active" : ""}`}
          onClick={() => onScopeChange(SCOPE_WEB)}
          data-testid="scope-web"
        >
          <Monitor size={14} /> Web
        </button>
        <button
          className={`scope-btn ${scope === SCOPE_MOBILE ? "active" : ""}`}
          onClick={() => onScopeChange(SCOPE_MOBILE)}
          data-testid="scope-mobile"
        >
          <Smartphone size={14} /> Mobile
        </button>
      </div>

      <div className="screen-group">
        {scope !== SCOPE_MOBILE && (
          <>
            <div className="screen-group-title">
              <Monitor size={12} /> Web Admin · {webScreens.length}
            </div>
            <ScreenList
              screens={webScreens}
              selectedId={selectedId}
              onSelect={onSelect}
              prefix={WEB_PREFIX}
              replaceText="Web · "
            />
          </>
        )}

        {scope !== SCOPE_WEB && (
          <>
            <div className="screen-group-title mt">
              <Smartphone size={12} /> Mobile · {mobileScreens.length}
            </div>
            <ScreenList
              screens={mobileScreens}
              selectedId={selectedId}
              onSelect={onSelect}
              prefix={MOBILE_PREFIX}
              replaceText="Mobile · "
            />
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="footer-card">
          <FileText size={14} />
          <div>
            <div className="fc-title">
              {webScreens.length + mobileScreens.length} wireframe
            </div>
            <div className="fc-sub">Web Admin + Mobile App</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
