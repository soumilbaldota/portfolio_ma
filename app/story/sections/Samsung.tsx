"use client";
import { Chapter, AnimatedCanvas, scenePalette, type SceneDraw } from "../lib";
import { chapterExtras } from "../../content/library";
import { stacks, TechRow } from "../tech";

const ACCENT = "#4f8bff";
const DOCS = [
  { name: "INVOICE", conf: 0.96 },
  { name: "FORM", conf: 0.94 },
  { name: "REPORT", conf: 0.95 },
  { name: "RECEIPT", conf: 0.93 },
  { name: "LETTER", conf: 0.97 },
];
const CYCLE = 2.6;

export function Samsung() {
  const draw: SceneDraw = (ctx, t, w, h) => {
    const pal = scenePalette();
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, w, h);

    // phone geometry
    const ph = Math.min(h * 0.78, 320);
    const pw = ph * 0.5;
    const px = w / 2 - pw / 2;
    const py = h / 2 - ph / 2;
    const scrX = px + 10,
      scrY = py + 22,
      scrW = pw - 20,
      scrH = ph - 44;

    // body
    ctx.fillStyle = "#12151c";
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    roundRect(ctx, px, py, pw, ph, 22);
    ctx.fill();
    ctx.stroke();
    // screen
    ctx.fillStyle = "#0a0e18";
    roundRect(ctx, scrX, scrY, scrW, scrH, 10);
    ctx.fill();
    // speaker
    ctx.fillStyle = "#2a2f3a";
    ctx.fillRect(w / 2 - 12, py + 12, 24, 3);

    // clip to screen
    ctx.save();
    roundRect(ctx, scrX, scrY, scrW, scrH, 10);
    ctx.clip();

    const idx = Math.floor(t / CYCLE) % DOCS.length;
    const doc = DOCS[idx];
    const p = (t % CYCLE) / CYCLE;

    // document card sliding up
    const docW = scrW * 0.66;
    const docH = scrH * 0.5;
    const dx = scrX + (scrW - docW) / 2;
    const slide = p < 0.28 ? p / 0.28 : 1;
    const dy = scrY + scrH * 0.5 - docH / 2 + (1 - slide) * scrH;
    ctx.fillStyle = "#eef1f6";
    roundRect(ctx, dx, dy, docW, docH, 6);
    ctx.fill();
    // text lines on the doc
    ctx.fillStyle = "#c3ccd8";
    for (let i = 0; i < 6; i++) {
      const lw = i === 0 ? docW * 0.5 : docW * (0.5 + ((i * 37) % 40) / 100);
      ctx.fillRect(dx + 10, dy + 12 + i * (docH - 24) / 6, Math.min(lw, docW - 20), 3);
    }

    // scan line during analysis
    if (p > 0.28 && p < 0.62) {
      const sp = (p - 0.28) / 0.34;
      const sy = dy + sp * docH;
      ctx.fillStyle = ACCENT;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(dx, sy, docW, 2);
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = ACCENT;
      ctx.fillRect(dx, dy, docW, sy - dy);
      ctx.globalAlpha = 1;
    }

    // result label + confidence
    if (p > 0.62) {
      const rp = Math.min((p - 0.62) / 0.2, 1);
      ctx.globalAlpha = rp;
      ctx.fillStyle = ACCENT;
      const tagY = dy + docH + 14;
      roundRect(ctx, dx, tagY, docW, 34, 6);
      ctx.fill();
      ctx.fillStyle = "#04101f";
      ctx.font = "700 15px 'Space Grotesk', system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(doc.name, dx + 10, tagY + 12);
      // confidence bar
      ctx.fillStyle = "rgba(4,16,31,0.35)";
      ctx.fillRect(dx + 10, tagY + 22, docW - 20, 5);
      ctx.fillStyle = "#04101f";
      ctx.fillRect(dx + 10, tagY + 22, (docW - 20) * doc.conf * rp, 5);
      ctx.font = "10px 'JetBrains Mono', ui-monospace, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(doc.conf * 100)}%`, dx + docW - 10, tagY + 12);
      ctx.globalAlpha = 1;
    }

    // status header
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "9px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(p < 0.62 ? "classifying…" : "on-device · real-time", scrX + 8, scrY + 16);

    ctx.restore();
  };

  return (
    <Chapter
      id="samsung"
      accent={ACCENT}
      company="Samsung Research"
      role="Machine Learning Intern · PRISM"
      dates="Nov 2022 – Jun 2023"
      location="Bengaluru, India"
      logo={chapterExtras.samsung.logo}
      highlights={chapterExtras.samsung.highlights}
      title={
        <>
          Intelligence, <span className="accented">on the device.</span>
        </>
      }
      lede="Multi-modal document classification for low-powered mobile devices — real-time inference on-device, no server round-trip."
      visual={<AnimatedCanvas draw={draw} />}
    >
      <div className="metric-row" style={{ marginTop: "1.4rem" }}>
        <div className="metric">
          <div className="metric__value">95<span className="unit">%</span></div>
          <div className="metric__label">Accuracy</div>
        </div>
        <div className="metric">
          <div className="metric__value">120k<span className="unit">+</span></div>
          <div className="metric__label">Training samples</div>
        </div>
      </div>
      <TechRow items={stacks.samsung} />
    </Chapter>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
