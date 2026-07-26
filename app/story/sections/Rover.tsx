"use client";
import { Chapter, AnimatedCanvas, isLight, type SceneDraw } from "../lib";
import { SPRITES } from "../../pixel/sprites";
import { paintSprite } from "../../pixel/paint";
import { chapterExtras } from "../../content/library";
import { stacks, TechRow } from "../tech";

const ACCENT = "#e0653b";
const DETECT = "#3ad98a";

const ROCKS = [
  { wx: 0.24, r: 10, label: "ROCK", conf: 0.98 },
  { wx: 0.52, r: 7, label: "ROCK", conf: 0.91 },
  { wx: 0.78, r: 13, label: "OBSTACLE", conf: 0.87 },
];

export function Rover() {
  const draw: SceneDraw = (ctx, t, w, h) => {
    const L = isLight();
    // martian sky (dusk in dark mode, brighter daytime Mars in light mode)
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    if (L) {
      sky.addColorStop(0, "#f3d0b0");
      sky.addColorStop(0.6, "#e0946a");
      sky.addColorStop(1, "#c56a3e");
    } else {
      sky.addColorStop(0, "#3a1a12");
      sky.addColorStop(0.6, "#722f1e");
      sky.addColorStop(1, "#9a4326");
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // faint sun
    ctx.fillStyle = "rgba(255,210,170,0.25)";
    ctx.beginPath();
    ctx.arc(w * 0.8, h * 0.22, 34, 0, Math.PI * 2);
    ctx.fill();

    // terrain
    const baseY = h * 0.72;
    const terrainAt = (x: number) =>
      baseY + Math.sin(x * 0.014) * 10 + Math.sin(x * 0.05) * 4;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) ctx.lineTo(x, terrainAt(x));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = L ? "#b0623b" : "#4a2417";
    ctx.fill();
    // terrain speckle
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    for (let i = 0; i < 40; i++) {
      const x = (i * 97.3) % w;
      ctx.fillRect(x, terrainAt(x) + 6 + ((i * 13) % 20), 2, 2);
    }

    // rocks
    for (const rk of ROCKS) {
      const x = rk.wx * w;
      const y = terrainAt(x);
      ctx.fillStyle = "#2e1710";
      ctx.beginPath();
      ctx.ellipse(x, y, rk.r, rk.r * 0.7, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5c2e1d";
      ctx.beginPath();
      ctx.ellipse(x - rk.r * 0.3, y - rk.r * 0.15, rk.r * 0.5, rk.r * 0.35, 0, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    // rover driving L→R
    const sprite = SPRITES.marsRover;
    const scale = Math.max(2, Math.round(h / 90));
    const roverW = sprite.w * scale;
    const span = w + roverW * 2;
    const rx = ((t * 46) % span) - roverW;
    const roverCenter = rx + roverW / 2;
    const ry = terrainAt(roverCenter) - sprite.h * scale + scale * 2;
    paintSprite(ctx, sprite, rx, ry, scale, t);

    // SLAM point-cloud trail behind rover
    ctx.fillStyle = "rgba(58,217,138,0.5)";
    for (let i = 1; i < 26; i++) {
      const px = roverCenter - i * 9;
      if (px < 0) break;
      ctx.globalAlpha = 0.5 * (1 - i / 26);
      ctx.fillRect(px, terrainAt(px) - 2, 2, 2);
    }
    ctx.globalAlpha = 1;

    // camera scan cone
    const camX = roverCenter + roverW * 0.28;
    const camY = ry + scale * 4;
    ctx.fillStyle = "rgba(58,217,138,0.08)";
    ctx.beginPath();
    ctx.moveTo(camX, camY);
    ctx.lineTo(camX + 120, camY - 30);
    ctx.lineTo(camX + 120, camY + 40);
    ctx.closePath();
    ctx.fill();

    // detection boxes when the rover is looking at a rock ahead
    ctx.font = "10px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    for (const rk of ROCKS) {
      const x = rk.wx * w;
      const dist = x - camX;
      if (dist > 8 && dist < 150) {
        const y = terrainAt(x);
        const bw = rk.r * 2.4;
        const bh = rk.r * 2.2;
        const bx = x - bw / 2;
        const by = y - bh + rk.r * 0.4;
        ctx.strokeStyle = DETECT;
        ctx.lineWidth = 1.5;
        const cor = 6;
        // corner-bracket box
        const corners = [
          [bx, by, 1, 1],
          [bx + bw, by, -1, 1],
          [bx, by + bh, 1, -1],
          [bx + bw, by + bh, -1, -1],
        ];
        for (const [px, py, sx, sy] of corners) {
          ctx.beginPath();
          ctx.moveTo(px, py + sy * cor);
          ctx.lineTo(px, py);
          ctx.lineTo(px + sx * cor, py);
          ctx.stroke();
        }
        // label
        ctx.fillStyle = DETECT;
        ctx.fillRect(bx, by - 13, bw, 12);
        ctx.fillStyle = "#04140c";
        ctx.fillText(`${rk.label} ${rk.conf.toFixed(2)}`, bx + 3, by - 3.5);
      }
    }
  };

  return (
    <Chapter
      id="rudra"
      accent={ACCENT}
      company="Team RUDRA"
      role="Computer Vision & SLAM"
      dates="Mars Rover"
      location="SRM · India"
      logo={chapterExtras.rover.logo}
      mono={chapterExtras.rover.mono}
      monoColor={chapterExtras.rover.monoColor}
      highlights={chapterExtras.rover.highlights}
      title={
        <>
          Teaching a rover <span className="accented">to see.</span>
        </>
      }
      lede="Leading SLAM for a competition Mars rover — the hard-real-world engineering that first pulled me toward systems work."
      visual={<AnimatedCanvas draw={draw} />}
    >
      <TechRow items={stacks.rover} />
    </Chapter>
  );
}
