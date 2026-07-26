import type { Sprite } from "./types";
import { lerpHex } from "./util";

type PaintOpts = { flip?: boolean; animate?: boolean; alpha?: number };

/**
 * Paints a sprite (frame + breathing shimmer) into an existing 2D context at a
 * given position/scale. Lets the pixel sprites be composited into the larger
 * cinematic scene canvases.
 */
export function paintSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
  scale: number,
  tSec: number,
  opts: PaintOpts = {}
) {
  const { flip = false, animate = true, alpha = 1 } = opts;
  const { w, frames, palette, shimmer, shimmerSpeed = 0.4, fps = 4 } = sprite;

  const frameIdx = animate ? Math.floor(tSec * fps) % frames.length : 0;
  const grid = frames[frameIdx] ?? frames[0];

  const pal: Record<string, string> = { ...palette };
  if (shimmer) {
    const s = animate
      ? (Math.sin(tSec * shimmerSpeed * Math.PI * 2) + 1) / 2
      : 0.5;
    for (const [ch, [lo, hi]] of Object.entries(shimmer)) pal[ch] = lerpHex(lo, hi, s);
  }

  const prevAlpha = ctx.globalAlpha;
  if (alpha !== 1) ctx.globalAlpha = alpha;
  for (let gy = 0; gy < grid.length; gy++) {
    const row = grid[gy];
    for (let gx = 0; gx < row.length; gx++) {
      const c = pal[row[gx]];
      if (!c) continue;
      ctx.fillStyle = c;
      const px = flip ? w - 1 - gx : gx;
      ctx.fillRect(Math.round(x + px * scale), Math.round(y + gy * scale), scale, scale);
    }
  }
  ctx.globalAlpha = prevAlpha;
}
