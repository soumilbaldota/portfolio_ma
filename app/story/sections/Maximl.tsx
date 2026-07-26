"use client";
import { Chapter, AnimatedCanvas, isLight, type SceneDraw } from "../lib";
import { SPRITES } from "../../pixel/sprites";
import { paintSprite } from "../../pixel/paint";
import { chapterExtras } from "../../content/library";
import { stacks, TechRow } from "../tech";

const ACCENT = "#f6a821";

export function Maximl() {
  const draw: SceneDraw = (ctx, t, w, h) => {
    const L = isLight();
    // industrial sky (dusk in dark mode, clear day in light mode)
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    if (L) {
      sky.addColorStop(0, "#bcd6ef");
      sky.addColorStop(0.55, "#dbe3ec");
      sky.addColorStop(1, "#e8d9c4");
    } else {
      sky.addColorStop(0, "#241a2e");
      sky.addColorStop(0.55, "#5a3b34");
      sky.addColorStop(1, "#7a4a24");
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const baseY = h * 0.82;

    // distant refinery silhouette
    ctx.fillStyle = "rgba(10,8,14,0.7)";
    const towers = [0.06, 0.14, 0.2, 0.86, 0.93];
    for (const f of towers) {
      const x = f * w;
      const tw = 12 + ((f * 100) % 10);
      const th = 60 + ((f * 260) % 70);
      ctx.fillRect(x, baseY - th, tw, th);
      // blinking beacon
      if (Math.sin(t * 3 + f * 20) > 0.6) {
        ctx.fillStyle = "#ff5a5a";
        ctx.fillRect(x + tw / 2 - 1, baseY - th - 4, 2, 2);
        ctx.fillStyle = "rgba(10,8,14,0.7)";
      }
    }
    // horizontal pipe
    ctx.strokeStyle = "rgba(10,8,14,0.6)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, baseY - 22);
    ctx.lineTo(w, baseY - 22);
    ctx.stroke();

    // ground
    ctx.fillStyle = L ? "#b79a72" : "#3a2415";
    ctx.fillRect(0, baseY, w, h - baseY);

    // pump-jack
    const pj = SPRITES.oilplant;
    const ps = Math.max(2, Math.round((h * 0.42) / pj.h));
    const pjx = w * 0.26 - (pj.w * ps) / 2;
    const pjy = baseY - pj.h * ps + ps;
    paintSprite(ctx, pj, pjx, pjy, ps, t);

    // worker with phone
    const wk = SPRITES.worker;
    const ws = Math.max(2, Math.round((h * 0.28) / wk.h));
    const wkx = w * 0.5;
    const wky = baseY - wk.h * ws + ws;
    paintSprite(ctx, wk, wkx, wky, ws, t);

    // job stream flowing into the worker's phone (jobs being processed)
    const phoneX = wkx + wk.w * ws;
    const phoneY = wky + wk.h * ws * 0.6;
    for (let i = 0; i < 8; i++) {
      const prog = (t * 0.5 + i / 8) % 1;
      const jx = w * 0.92 - prog * (w * 0.92 - phoneX);
      const jy = phoneY - 24 + Math.sin(prog * Math.PI) * -18;
      ctx.fillStyle = ACCENT;
      ctx.globalAlpha = 0.85 * (1 - prog * 0.5);
      ctx.fillRect(jx, jy, 4, 4);
      ctx.globalAlpha = 1;
    }

    // HUD telemetry panel
    const hx = w - 184,
      hy = 18,
      hw = 166,
      hh = 122;
    ctx.fillStyle = "rgba(6,8,12,0.78)";
    ctx.strokeStyle = "rgba(246,168,33,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(hx, hy, hw, hh, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = ACCENT;
    ctx.font = "9px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText("PLANT · MAXIML", hx + 12, hy + 17);
    ctx.fillStyle = "#e8edf3";
    ctx.font = "700 16px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText("1M+ jobs / wk", hx + 12, hy + 39);
    ctx.fillStyle = "#7ee0a8";
    ctx.font = "10px 'JetBrains Mono', ui-monospace, monospace";
    ctx.fillText("99.9% success", hx + 12, hy + 56);

    // p99 latency sparkline dropping 450 → 150
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "8px 'JetBrains Mono', ui-monospace, monospace";
    ctx.fillText("p99 450 → 150ms", hx + 12, hy + 74);
    const sx = hx + 12,
      sy = hy + 112,
      sw = hw - 24,
      sh = 26;
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.strokeRect(sx, sy - sh, sw, sh);
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= sw; i += 3) {
      const f = i / sw;
      const drop = 1 - Math.min(f * 1.6, 1);
      const jitter = Math.sin(f * 18 + t * 2) * 0.06 * drop;
      const y = sy - (drop * 0.72 + jitter) * sh - 2;
      i === 0 ? ctx.moveTo(sx + i, y) : ctx.lineTo(sx + i, y);
    }
    ctx.stroke();
  };

  return (
    <Chapter
      id="maximl"
      accent={ACCENT}
      company="Maximl Labs"
      role="Software Engineer (Intern → Full-time)"
      dates="Jun 2023 – Jul 2025"
      location="Bengaluru, India"
      logo={chapterExtras.maximl.logo}
      highlights={chapterExtras.maximl.highlights}
      title={
        <>
          Keeping the plant <span className="accented">running.</span>
        </>
      }
      lede="Backend and infrastructure for industrial-plant SaaS: a BullMQ job-processing library adopted across 90% of services, Postgres row-level multi-tenancy, and latency work that took p99 from 450ms to 150ms."
      visual={<AnimatedCanvas draw={draw} />}
    >
      <div className="metric-row" style={{ marginTop: "1.4rem" }}>
        <div className="metric">
          <div className="metric__value">90<span className="unit">%</span></div>
          <div className="metric__label">Services adopted it</div>
        </div>
        <div className="metric">
          <div className="metric__value">70<span className="unit">%</span></div>
          <div className="metric__label">Fewer job bugs</div>
        </div>
        <div className="metric">
          <div className="metric__value">3<span className="unit">×</span></div>
          <div className="metric__label">Faster queries</div>
        </div>
      </div>
      <TechRow items={stacks.maximl} />
    </Chapter>
  );
}
