import { fontWeight } from "@/components/Wireframe";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function rectHtml(b, colors) {
  const bg = colors[b.fill] || "transparent";
  const border = b.stroke ? `1px solid ${colors[b.stroke]}` : "none";
  return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;background:${bg};border:${border};border-radius:${b.radius || 0}px;box-sizing:border-box;"></div>`;
}

function textHtml(b, colors) {
  const color = colors[b.color] || "#000";
  return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;color:${color};font-size:${b.size || 14}px;font-weight:${fontWeight(b.weight)};text-align:${b.align || "left"};font-family:Inter,system-ui,sans-serif;line-height:1.3;letter-spacing:-0.01em;">${escapeHtml(b.text || "")}</div>`;
}

export function buildScreenHtml(screen, colors) {
  const parts = screen.blocks.map((b) =>
    b.type === "rect" ? rectHtml(b, colors) : textHtml(b, colors)
  );
  return `<div style="position:relative;width:${screen.frame.w}px;height:${screen.frame.h}px;background:${colors.bg};">\n${parts.join("\n")}\n</div>`;
}
