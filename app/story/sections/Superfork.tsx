"use client";
import { Chapter, AnimatedCanvas, scenePalette, type SceneDraw } from "../lib";
import { chapterExtras } from "../../content/library";
import { stacks, TechRow } from "../tech";

const ACCENT = "#7ab8ff";
const COPIED = "#ffd15c";
const CYCLE = 4.2;
const COLS = 3,
  ROWS = 3;

export function Superfork() {
  const draw: SceneDraw = (ctx, t, w, h) => {
    const pal = scenePalette();
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, w, h);
    // subtle grid
    ctx.strokeStyle = pal.grid;
    for (let x = 0; x < w; x += 26) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    const p = (t % CYCLE) / CYCLE;
    const cw = Math.min(w * 0.3, 150);
    const ch = cw;
    const cy = h / 2 - ch / 2;
    const parentX = w * 0.5 - cw - 30;
    const childBaseX = w * 0.5 + 30;

    // child emergence 0.28→0.55, copy 0.55→0.85
    const emerge = clamp((p - 0.28) / 0.27);
    const copyP = clamp((p - 0.55) / 0.3);
    const childX = parentX + (childBaseX - parentX) * ease(emerge);
    const childAlpha = emerge;

    // CoW links (parent pages → child pages) while shared
    if (emerge > 0.05) {
      for (let i = 0; i < COLS * ROWS; i++) {
        const a = pageCenter(parentX, cy, cw, ch, i);
        const b = pageCenter(childX, cy, cw, ch, i);
        const copiedPage = copyP > (i % 4) / 4 && (i === 2 || i === 4 || i === 6);
        ctx.strokeStyle = copiedPage
          ? "rgba(255,209,92,0.15)"
          : `rgba(122,184,255,${0.28 * childAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    drawContainer(ctx, parentX, cy, cw, ch, "parent", t, 1, copyP, false);
    if (emerge > 0.02)
      drawContainer(ctx, childX, cy, cw, ch, "fork", t, childAlpha, copyP, true);

    // fork() call + latency
    ctx.fillStyle = ACCENT;
    ctx.font = "12px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("clone(CLONE_VM | CLONE_COW)  →  fork()", w / 2, h - 30);
    ctx.fillStyle = pal.faint;
    ctx.font = "9px 'JetBrains Mono', ui-monospace, monospace";
    ctx.fillText("copy-on-write · pages shared until written", w / 2, h - 14);
  };

  return (
    <Chapter
      id="superfork"
      accent={ACCENT}
      company="Columbia University"
      role="Graduate Researcher · Software Systems Lab"
      dates="Jan 2026 – Present"
      location="New York, NY"
      logo={chapterExtras.columbia.logo}
      mono={chapterExtras.columbia.mono}
      monoColor={chapterExtras.columbia.monoColor}
      highlights={chapterExtras.columbia.highlights}
      title={
        <>
          Forking a running <span className="accented">container.</span>
        </>
      }
      lede="Research on fast container forking inside a custom Linux kernel and Kata Containers: a multi-threaded fork syscall that replicates memory and file descriptors via copy-on-write, measured with custom eBPF hooks. Now extending it to ARM CCA confidential-compute Realms."
      visual={<AnimatedCanvas draw={draw} />}
    >
      <TechRow items={stacks.columbia} />
    </Chapter>
  );
}

function drawContainer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cw: number,
  ch: number,
  label: string,
  t: number,
  alpha: number,
  copyP: number,
  isChild: boolean
) {
  ctx.globalAlpha = alpha;
  // body
  ctx.fillStyle = "rgba(122,184,255,0.06)";
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x, y, cw, ch, 10);
  ctx.fill();
  ctx.stroke();
  // header bar (whale-ish dots)
  ctx.fillStyle = "rgba(122,184,255,0.14)";
  ctx.beginPath();
  ctx.roundRect(x, y, cw, 20, [10, 10, 0, 0]);
  ctx.fill();
  ctx.fillStyle = ACCENT;
  ctx.font = "9px 'JetBrains Mono', ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.fillText(label, x + 10, y + 13);

  // memory pages grid
  const pad = 14;
  const gx = x + pad,
    gy = y + 26;
  const gw = cw - pad * 2,
    gh = ch - 26 - pad;
  const pw = gw / COLS,
    pph = gh / ROWS;
  for (let i = 0; i < COLS * ROWS; i++) {
    const cxp = gx + (i % COLS) * pw + 3;
    const cyp = gy + Math.floor(i / COLS) * pph + 3;
    const copiedPage =
      isChild && (i === 2 || i === 4 || i === 6) && copyP > (i % 4) / 4;
    const pulse = 0.6 + 0.4 * Math.sin(t * 3 + i);
    ctx.fillStyle = copiedPage
      ? COPIED
      : `rgba(122,184,255,${0.35 + pulse * 0.25})`;
    ctx.fillRect(cxp, cyp, pw - 6, pph - 6);
  }
  ctx.globalAlpha = 1;
}

function pageCenter(x: number, y: number, cw: number, ch: number, i: number) {
  const pad = 14;
  const gx = x + pad,
    gy = y + 26;
  const gw = cw - pad * 2,
    gh = ch - 26 - pad;
  const pw = gw / COLS,
    pph = gh / ROWS;
  return {
    x: gx + (i % COLS) * pw + pw / 2,
    y: gy + Math.floor(i / COLS) * pph + pph / 2,
  };
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - v, 3);
