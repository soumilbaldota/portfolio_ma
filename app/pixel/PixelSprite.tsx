"use client";
import { useEffect, useRef } from "react";
import type { Sprite } from "./types";
import { lerpHex, prefersReducedMotion } from "./util";

type Props = {
  sprite: Sprite;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
  /** turn off animation/breathing entirely */
  animate?: boolean;
  /** phase offset (seconds) so multiple copies don't breathe in lockstep */
  phase?: number;
  title?: string;
};

/** Renders a single sprite to a crisp, self-animating canvas. */
export function PixelSprite({
  sprite,
  scale = 6,
  className,
  style,
  animate = true,
  phase = 0,
  title,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h, frames, palette, shimmer, shimmerSpeed = 0.4, fps = 4 } =
      sprite;
    canvas.width = w * scale;
    canvas.height = h * scale;
    ctx.imageSmoothingEnabled = false;

    const reduced = prefersReducedMotion() || !animate;
    let raf = 0;
    let start = 0;

    const draw = (tSec: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const frameIdx = reduced
        ? 0
        : Math.floor(tSec * fps) % frames.length;
      const grid = frames[frameIdx] ?? frames[0];

      // Effective palette with shimmer applied.
      const pal: Record<string, string> = { ...palette };
      if (shimmer) {
        const s = reduced ? 0.5 : (Math.sin(tSec * shimmerSpeed * Math.PI * 2) + 1) / 2;
        for (const [ch, [lo, hi]] of Object.entries(shimmer)) {
          pal[ch] = lerpHex(lo, hi, s);
        }
      }

      for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
          const color = pal[row[x]];
          if (!color) continue; // transparent
          ctx.fillStyle = color;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    };

    if (reduced) {
      draw(0);
      return;
    }

    const loop = (now: number) => {
      if (!start) start = now;
      draw((now - start) / 1000 + phase);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        start = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [sprite, scale, animate, phase]);

  return (
    <canvas
      ref={ref}
      className={className}
      title={title}
      style={{
        imageRendering: "pixelated",
        width: sprite.w * scale,
        height: sprite.h * scale,
        display: "block",
        ...style,
      }}
    />
  );
}
