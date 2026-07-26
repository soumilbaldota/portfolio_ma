"use client";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

/* ── Theme-aware scene palette (canvases can't read CSS vars) ──────────── */
export function isLight(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("light")
  );
}

/** Base colors for a scene canvas, adapting to the active theme. */
export function scenePalette() {
  const L = isLight();
  return {
    L,
    bg: L ? "#eef1f7" : "#05060f",
    ink: L ? "#1a2029" : "#f5f5f7",
    grid: L ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
    faint: L ? "rgba(20,30,45,0.55)" : "rgba(255,255,255,0.5)",
    hair: L ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)",
  };
}

/* ── Reveal on scroll ──────────────────────────────────────────────────── */
export function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, shown };
}

/* A block that fades/rises in when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "p" | "h2";
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${shown ? "reveal--in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/* ── Count-up number, animates once when revealed ──────────────────────── */
export function useCountUp(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVal(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

/* ── Draw fn signature for AnimatedCanvas ──────────────────────────────── */
export type SceneDraw = (
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number
) => void;

/**
 * A canvas that:
 *  - handles devicePixelRatio + resize
 *  - only animates while on-screen (IntersectionObserver) and tab is visible
 *  - draws a single static frame when prefers-reduced-motion
 */
export function AnimatedCanvas({
  draw,
  className,
  style,
}: {
  draw: SceneDraw;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0,
      dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let start = 0;
    let onScreen = true;

    const loop = (now: number) => {
      if (!start) start = now;
      ctx.clearRect(0, 0, w, h);
      drawRef.current(ctx, (now - start) / 1000, w, h);
      raf = requestAnimationFrame(loop);
    };

    const stop = () => cancelAnimationFrame(raf);
    const play = () => {
      stop();
      if (reduced) {
        ctx.clearRect(0, 0, w, h);
        drawRef.current(ctx, 0, w, h);
        return;
      }
      start = 0;
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen && !document.hidden) play();
        else stop();
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) stop();
      else if (onScreen) play();
    };
    document.addEventListener("visibilitychange", onVis);

    play();
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className={className} style={style} />;
}

/* ── Company logo (image) or monogram badge ────────────────────────────── */
export function Logo({
  logo,
  mono,
  monoColor,
  label,
}: {
  logo?: string | null;
  mono?: string;
  monoColor?: string;
  label: string;
}) {
  if (logo) {
    return (
      <span className="logo-badge" title={label}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={`${label} logo`} />
      </span>
    );
  }
  return (
    <span
      className="logo-badge logo-badge--mono"
      title={label}
      style={
        {
          color: monoColor,
          borderColor: `color-mix(in srgb, ${monoColor} 55%, transparent)`,
        } as CSSProperties
      }
    >
      {mono}
    </span>
  );
}

/* ── Chapter shell (dense: logo header + highlights + big visual) ───────── */
export function Chapter({
  id,
  accent,
  eyebrow,
  company,
  role,
  dates,
  location,
  logo,
  mono,
  monoColor,
  title,
  lede,
  highlights,
  children,
  visual,
  stack = false,
}: {
  id: string;
  accent: string;
  eyebrow?: string;
  company?: string;
  role?: string;
  dates?: string;
  location?: string;
  logo?: string | null;
  mono?: string;
  monoColor?: string;
  title: ReactNode;
  lede?: ReactNode;
  highlights?: string[];
  children?: ReactNode;
  visual?: ReactNode;
  stack?: boolean;
}) {
  return (
    <section
      id={id}
      className={`chapter ${stack ? "chapter--stack" : ""}`}
      style={{ "--accent": accent } as CSSProperties}
      data-chapter
    >
      <div className="chapter__grid">
        <div className="chapter__col">
          {company ? (
            <Reveal>
              <header className="chapter__head">
                <Logo logo={logo} mono={mono} monoColor={monoColor} label={company} />
                <div className="chapter__id">
                  <div className="chapter__company">{company}</div>
                  {role && <div className="chapter__role">{role}</div>}
                </div>
                {(dates || location) && (
                  <div className="chapter__meta">
                    {dates && <span>{dates}</span>}
                    {location && <span>{location}</span>}
                  </div>
                )}
              </header>
            </Reveal>
          ) : (
            eyebrow && (
              <Reveal>
                <span className="eyebrow">{eyebrow}</span>
              </Reveal>
            )
          )}
          <Reveal delay={0.06}>
            <h2 className="title">{title}</h2>
          </Reveal>
          {lede && (
            <Reveal delay={0.12}>
              <p className="lede">{lede}</p>
            </Reveal>
          )}
          {highlights && highlights.length > 0 && (
            <Reveal delay={0.16}>
              <ul className="bullets">
                {highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </Reveal>
          )}
          {children}
        </div>
        {visual && (
          <Reveal delay={0.1}>
            <div className="visual">{visual}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
