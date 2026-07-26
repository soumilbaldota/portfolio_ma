import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import { SPRITES } from "../app/pixel/sprites/index.ts";
import { lerpHex } from "../app/pixel/util.ts";

const BG = "#e9edf2", CARD = "#ffffff", INK = "#1a2029";
const cell = 380, cols = 3;
const ids = Object.keys(SPRITES);
const rows = Math.ceil(ids.length / cols);
const cv = createCanvas(cols * cell, rows * cell);
const ctx = cv.getContext("2d");
ctx.fillStyle = BG; ctx.fillRect(0,0,cv.width,cv.height);

ids.forEach((id, i) => {
  const sp: any = SPRITES[id];
  const cx = (i % cols) * cell, cy = Math.floor(i / cols) * cell;
  // card
  ctx.fillStyle = CARD;
  ctx.fillRect(cx+14, cy+14, cell-28, cell-28);
  // sprite
  const s = Math.min(Math.floor((cell-140)/sp.w), Math.floor((cell-160)/sp.h));
  const pal: Record<string,string> = { ...sp.palette };
  if (sp.shimmer) for (const [c,[lo,hi]] of Object.entries(sp.shimmer) as any) pal[c]=lerpHex(lo,hi,0.65);
  const grid: string[] = sp.frames[0];
  const ox = cx + (cell - sp.w*s)/2, oy = cy + 60;
  for (let y=0;y<grid.length;y++){const row=grid[y].padEnd(sp.w,".");for(let x=0;x<sp.w;x++){const col=pal[row[x]];if(!col)continue;ctx.fillStyle=col;ctx.fillRect(ox+x*s, oy+y*s, s, s);}}
  // label
  ctx.fillStyle = INK; ctx.font = "bold 22px sans-serif";
  ctx.fillText(id, cx+34, cy+48);
  // palette swatches
  const cols2 = Object.values(sp.palette) as string[];
  const sw = 26, sy = cy + cell - 56;
  cols2.forEach((c, k) => { ctx.fillStyle = c; ctx.fillRect(cx+34 + k*(sw+6), sy, sw, sw); ctx.strokeStyle="#cbd3dc"; ctx.strokeRect(cx+34 + k*(sw+6), sy, sw, sw); });
});
writeFileSync("/tmp/sprites/_showcase.png", cv.toBuffer("image/png"));
console.log("showcase written");
