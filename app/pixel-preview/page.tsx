"use client";
// Dev-only gallery to eyeball every sprite live (animation + breathing).
import { SPRITES } from "../pixel/sprites";
import { PixelSprite } from "../pixel/PixelSprite";

export default function PixelPreview() {
  const ids = Object.keys(SPRITES);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#c9d1d9",
        fontFamily: "monospace",
        padding: 32,
        overflow: "auto",
      }}
    >
      <h1 style={{ fontSize: 18, marginBottom: 24 }}>
        pixel sprite preview — {ids.length} sprites (live + breathing)
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 24,
        }}
      >
        {ids.map((id, i) => (
          <div
            key={id}
            style={{
              border: "1px solid #21262d",
              borderRadius: 8,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              background: "#0a0e14",
            }}
          >
            <div
              style={{
                minHeight: 160,
                display: "flex",
                alignItems: "center",
              }}
            >
              <PixelSprite sprite={SPRITES[id]} scale={6} phase={i * 0.6} />
            </div>
            <code style={{ color: "#8b98a5" }}>{id}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
