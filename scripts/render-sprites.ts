// Dev-only: render every sprite to a PNG so we can eyeball the pixel art
// without a browser. Run: node scripts/render-sprites.ts
import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync } from "node:fs";
import { SPRITES } from "../app/pixel/sprites/index.ts";
import { lerpHex } from "../app/pixel/util.ts";

const OUT = "/tmp/sprites";
mkdirSync(OUT, { recursive: true });

const SCALE = 10;
const BG = "#0d1117";

function renderSprite(id: string, sprite: any, shimmerT = 0.7) {
  const { w, h, frames, palette, shimmer } = sprite;
  // validate rows
  const grid: string[] = frames[0];
  grid.forEach((row: string, i: number) => {
    if (row.length !== w) {
      console.warn(
        `  [${id}] row ${i} len ${row.length} != w ${w}: "${row}"`
      );
    }
  });

  const pal: Record<string, string> = { ...palette };
  if (shimmer) {
    for (const [ch, [lo, hi]] of Object.entries(shimmer) as [
      string,
      [string, string]
    ][]) {
      pal[ch] = lerpHex(lo, hi, shimmerT);
    }
  }

  const canvas = createCanvas(w * SCALE, h * SCALE);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y].padEnd(w, ".").slice(0, w);
    for (let x = 0; x < w; x++) {
      const c = pal[row[x]];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }
  }
  writeFileSync(`${OUT}/${id}.png`, canvas.toBuffer("image/png"));
}

// Contact sheet: all sprites side by side on one image.
function contactSheet() {
  const ids = Object.keys(SPRITES);
  const cell = 340;
  const cols = 4;
  const rows = Math.ceil(ids.length / cols);
  const canvas = createCanvas(cols * cell, rows * cell);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ids.forEach((id, i) => {
    const sprite: any = SPRITES[id];
    const cx = (i % cols) * cell;
    const cy = Math.floor(i / cols) * cell;
    const s = Math.min(
      Math.floor((cell - 60) / sprite.w),
      Math.floor((cell - 80) / sprite.h)
    );
    const pal: Record<string, string> = { ...sprite.palette };
    if (sprite.shimmer)
      for (const [ch, [lo, hi]] of Object.entries(sprite.shimmer) as any)
        pal[ch] = lerpHex(lo, hi, 0.7);
    const grid: string[] = sprite.frames[0];
    const ox = cx + (cell - sprite.w * s) / 2;
    const oy = cy + (cell - sprite.h * s) / 2 + 6;
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y].padEnd(sprite.w, ".").slice(0, sprite.w);
      for (let x = 0; x < sprite.w; x++) {
        const c = pal[row[x]];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(ox + x * s, oy + y * s, s, s);
      }
    }
    ctx.fillStyle = "#8b98a5";
    ctx.font = "18px sans-serif";
    ctx.fillText(id, cx + 12, cy + 26);
  });
  writeFileSync(`${OUT}/_sheet.png`, canvas.toBuffer("image/png"));
}

console.log("Rendering sprites → " + OUT);
for (const [id, sprite] of Object.entries(SPRITES)) renderSprite(id, sprite);
contactSheet();
console.log("Done. Wrote " + Object.keys(SPRITES).length + " sprites + _sheet.png");
