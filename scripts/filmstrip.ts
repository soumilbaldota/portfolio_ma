import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import { SPRITES } from "../app/pixel/sprites/index.ts";
import { lerpHex } from "../app/pixel/util.ts";
const S = 8, BG = "#0d1117", GAP = 16;
function strip(id: string) {
  const sp: any = SPRITES[id];
  const n = sp.frames.length;
  const cw = sp.w * S, ch = sp.h * S;
  const cv = createCanvas(n * cw + (n - 1) * GAP, ch);
  const ctx = cv.getContext("2d");
  ctx.fillStyle = BG; ctx.fillRect(0, 0, cv.width, cv.height);
  sp.frames.forEach((grid: string[], fi: number) => {
    const pal: Record<string,string> = { ...sp.palette };
    if (sp.shimmer) for (const [c,[lo,hi]] of Object.entries(sp.shimmer) as any) pal[c]=lerpHex(lo,hi,0.6);
    const ox = fi * (cw + GAP);
    for (let y=0;y<grid.length;y++){const row=grid[y];for(let x=0;x<row.length;x++){const col=pal[row[x]];if(!col)continue;ctx.fillStyle=col;ctx.fillRect(ox+x*S,y*S,S,S);}}
  });
  writeFileSync(`/tmp/sprites/_strip_${id}.png`, cv.toBuffer("image/png"));
}
strip("oilplant"); strip("marsRover");
console.log("strips written");
