import React from "react";

function fontWeight(w) {
  if (w === "bold") return 700;
  if (w === "medium") return 500;
  return 400;
}

function blockKey(block, index) {
  // Stable composite key – position + type uniquely identifies a block
  // within a single screen frame.
  return `${block.type}-${block.x}-${block.y}-${block.w}-${block.h}-${index}`;
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

export default function Wireframe({ screen, colors, scale }) {
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
          <Block key={blockKey(b, i)} block={b} colors={colors} />
        ))}
      </div>
    </div>
  );
}

export { fontWeight };
