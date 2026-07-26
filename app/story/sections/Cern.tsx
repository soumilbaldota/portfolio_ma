"use client";
import { useRef } from "react";
import { Chapter, AnimatedCanvas, scenePalette, type SceneDraw } from "../lib";
import { chapterExtras } from "../../content/library";
import { stacks, TechRow } from "../tech";

const ACCENT = "#7cc8ff";

type Track = { pts: { x: number; y: number }[]; vx: number; vy: number; life: number; color: string };

const SHELLS = [
  { rx: 0.9, ry: 0.34, rot: 0, speed: 1.1, n: 2 },
  { rx: 0.62, ry: 0.62, rot: Math.PI / 3, speed: -0.8, n: 3 },
  { rx: 0.34, ry: 0.9, rot: -Math.PI / 3, speed: 1.5, n: 2 },
];

export function Cern() {
  const tracks = useRef<Track[]>([]);
  const lastSpawn = useRef(0);

  const draw: SceneDraw = (ctx, t, w, h) => {
    const pal = scenePalette();
    const cx = w / 2,
      cy = h / 2;
    const R = Math.min(w, h) * 0.4;

    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, w, h);

    // electron shells (orbits)
    for (const s of SHELLS) {
      ctx.strokeStyle = "rgba(124,200,255,0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * s.rx, R * s.ry, s.rot, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Monte-Carlo particle tracks (spawned "through code")
    if (t - lastSpawn.current > 0.5) {
      lastSpawn.current = t;
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = 60 + Math.random() * 90;
        tracks.current.push({
          pts: [{ x: cx, y: cy }],
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          life: 1,
          color: Math.random() > 0.5 ? "#7cc8ff" : "#c39bff",
        });
      }
      if (tracks.current.length > 60) tracks.current.splice(0, tracks.current.length - 60);
    }
    const dt = 1 / 60;
    for (const tr of tracks.current) {
      // curve the path (magnetic field) + fade
      const a = 0.9 * dt;
      const nvx = tr.vx * Math.cos(a) - tr.vy * Math.sin(a);
      const nvy = tr.vx * Math.sin(a) + tr.vy * Math.cos(a);
      tr.vx = nvx;
      tr.vy = nvy;
      const last = tr.pts[tr.pts.length - 1];
      tr.pts.push({ x: last.x + tr.vx * dt, y: last.y + tr.vy * dt });
      if (tr.pts.length > 14) tr.pts.shift();
      tr.life -= dt * 0.6;
    }
    tracks.current = tracks.current.filter((tr) => tr.life > 0);
    for (const tr of tracks.current) {
      ctx.strokeStyle = tr.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = Math.max(0, tr.life) * 0.8;
      ctx.beginPath();
      tr.pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      const head = tr.pts[tr.pts.length - 1];
      ctx.fillStyle = tr.color;
      ctx.fillRect(head.x - 1, head.y - 1, 2.5, 2.5);
    }
    ctx.globalAlpha = 1;

    // electrons on shells
    for (const s of SHELLS) {
      for (let i = 0; i < s.n; i++) {
        const a = t * s.speed + (i * Math.PI * 2) / s.n;
        const ox = R * s.rx * Math.cos(a);
        const oy = R * s.ry * Math.sin(a);
        const ex = cx + ox * Math.cos(s.rot) - oy * Math.sin(s.rot);
        const ey = cy + ox * Math.sin(s.rot) + oy * Math.cos(s.rot);
        ctx.fillStyle = ACCENT;
        ctx.shadowColor = ACCENT;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ex, ey, 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.shadowBlur = 0;

    // nucleus (pulsing cluster)
    const pulse = 1 + Math.sin(t * 3) * 0.08;
    ctx.save();
    ctx.translate(cx, cy);
    const nucleons = [
      [-4, -2, "#ff6b6b"],
      [4, -3, "#ffd15c"],
      [0, 3, "#ff6b6b"],
      [-3, 4, "#ffd15c"],
      [5, 3, "#ff8f6b"],
    ] as const;
    ctx.shadowColor = "#ffb27c";
    ctx.shadowBlur = 22;
    for (const [nx, ny, col] of nucleons) {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(nx * pulse, ny * pulse, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.shadowBlur = 0;

    // label
    ctx.fillStyle = "rgba(124,200,255,0.55)";
    ctx.font = "10px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText("// monte-carlo event generator", 14, h - 16);
  };

  return (
    <Chapter
      id="cern"
      accent={ACCENT}
      company="CERN"
      role="Open Source Contributor · Google Summer of Code"
      dates="Jun 2022 – Sep 2022"
      location="Remote · HSF"
      logo={chapterExtras.cern.logo}
      highlights={chapterExtras.cern.highlights}
      title={
        <>
          Simulating collisions, <span className="accented">in code.</span>
        </>
      }
      lede="At CERN's HEP Software Foundation I built a code-generation bridge from AidaSoft/podio to Julia for physics data pipelines, and benchmarked Julia against C++ for performance parity."
      visual={<AnimatedCanvas draw={draw} />}
    >
      <TechRow items={stacks.cern} />
    </Chapter>
  );
}
