"use client";
import { useRef } from "react";
import { AnimatedCanvas, Logo, isLight, type SceneDraw } from "../lib";
import { profile, heroLogos } from "../../content/library";

type Star = { x: number; y: number; z: number; tw: number };

export function Hero() {
  const stars = useRef<Star[]>([]);
  const shoot = useRef<{ x: number; y: number; life: number } | null>(null);
  const lastShoot = useRef(0);

  const draw: SceneDraw = (ctx, t, w, h) => {
    if (stars.current.length === 0 || stars.current.length !== 320) {
      stars.current = Array.from({ length: 320 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        tw: Math.random() * Math.PI * 2,
      }));
    }
    const L = isLight();
    // sky wash (deep space in dark mode, soft daybreak in light mode)
    const g = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, Math.max(w, h) * 0.7);
    if (L) {
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, "#dbe6f5");
    } else {
      g.addColorStop(0, "#0a1020");
      g.addColorStop(1, "#000000");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (const s of stars.current) {
      const drift = (t * (8 + s.z * 22)) % (w + 20);
      const x = (s.x + drift) % w;
      const twinkle = 0.5 + 0.5 * Math.sin(t * 2 + s.tw);
      ctx.globalAlpha = Math.min(1, (L ? 0.22 : 0.4 + s.z * 0.85) * twinkle);
      ctx.fillStyle = L ? "#3f5b86" : s.z > 0.8 ? "#bcd4ff" : "#ffffff";
      const size = s.z > 0.7 ? 2 : 1;
      ctx.fillRect(x, s.y, size, size);
    }
    ctx.globalAlpha = 1;

    // occasional shooting star
    if (t - lastShoot.current > 4 && !shoot.current) {
      lastShoot.current = t;
      shoot.current = { x: Math.random() * w * 0.6, y: Math.random() * h * 0.4, life: 0 };
    }
    if (shoot.current) {
      shoot.current.life += 0.02;
      const s = shoot.current;
      const len = 90;
      const px = s.x + s.life * 320;
      const py = s.y + s.life * 160;
      const grad = ctx.createLinearGradient(px - len, py - len * 0.5, px, py);
      grad.addColorStop(0, "rgba(122,184,255,0)");
      grad.addColorStop(1, "rgba(200,225,255,0.9)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - len, py - len * 0.5);
      ctx.lineTo(px, py);
      ctx.stroke();
      if (s.life > 1) shoot.current = null;
    }
  };

  return (
    <header className="hero" id="top">
      <AnimatedCanvas
        draw={draw}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero__skyline" src="/nyc-skyline.png" alt="New York City skyline" />
        <p className="hero__sub" style={{ marginBottom: "1.5rem", marginTop: 0 }}>
          {profile.location}
        </p>
        <h1 className="hero__name">
          Soumil
          <br />
          Baldota
        </h1>
        <p className="hero__sub">
          {profile.tagline}, close to the metal
        </p>
        <div className="hero__logos">
          {heroLogos.map((l) => (
            <Logo key={l.label} logo={l.src} label={l.label} />
          ))}
        </div>
      </div>
      <a href="#cloudflare" className="hero__hint" aria-label="Scroll to begin">
        scroll to begin ↓
      </a>
    </header>
  );
}
