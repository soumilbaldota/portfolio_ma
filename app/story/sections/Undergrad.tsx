"use client";
import { Chapter, AnimatedCanvas, Reveal, useReveal, useCountUp, scenePalette, type SceneDraw } from "../lib";
import { chapterExtras } from "../../content/library";
import { stacks, TechRow } from "../tech";

const ACCENT = "#ffd15c";

function CgpaGauge() {
  const draw: SceneDraw = (ctx, t, w, h) => {
    const pal = scenePalette();
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2,
      cy = h / 2,
      r = Math.min(w, h) * 0.3;
    const target = 0.956;
    const p = Math.min(t / 1.6, 1);
    const val = target * (1 - Math.pow(1 - p, 3));

    // faint grid
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += 28) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    // track
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = pal.hair;
    ctx.lineWidth = 10;
    ctx.stroke();
    // value arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + val * Math.PI * 2);
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.shadowColor = ACCENT;
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // center text
    ctx.fillStyle = pal.ink;
    ctx.font = `700 ${Math.round(r * 0.62)}px 'Space Grotesk', system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((val * 10).toFixed(2), cx, cy - r * 0.05);
    ctx.fillStyle = ACCENT;
    ctx.font = `500 ${Math.round(r * 0.2)}px 'JetBrains Mono', ui-monospace, monospace`;
    ctx.fillText("CGPA / 10", cx, cy + r * 0.42);

    // orbiting achievement pips
    for (let i = 0; i < 3; i++) {
      const a = t * 0.5 + (i * Math.PI * 2) / 3;
      const px = cx + Math.cos(a) * (r + 26);
      const py = cy + Math.sin(a) * (r + 26);
      ctx.fillStyle = ACCENT;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  };
  return <AnimatedCanvas draw={draw} />;
}

function Metric({ value, label, active }: { value: number; label: string; active: boolean }) {
  const v = useCountUp(value, active);
  return (
    <div className="metric">
      <div className="metric__value">
        {value % 1 === 0 ? Math.round(v) : v.toFixed(2)}
      </div>
      <div className="metric__label">{label}</div>
    </div>
  );
}

export function Undergrad() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <Chapter
      id="undergrad"
      accent={ACCENT}
      company="SRM Institute"
      role="B.Tech · CS & Big Data Analytics"
      dates="Aug 2020 – May 2024"
      location="India"
      logo={chapterExtras.srm.logo}
      mono={chapterExtras.srm.mono}
      monoColor={chapterExtras.srm.monoColor}
      title={
        <>
          Where it <span className="accented">started.</span>
        </>
      }
      lede="A B.Tech in Computer Science & Big Data Analytics, and the habits that stuck: dismantling systems until they made sense, then rebuilding them better."
      visual={<CgpaGauge />}
    >
      <div className="metric-row" ref={ref} style={{ marginTop: "1.6rem" }}>
        <Metric value={3.84} label="GPA / 4.0" active={shown} />
        <Metric value={9.56} label="CGPA / 10" active={shown} />
        <Metric value={1} label="ICRTDA-157 Paper" active={shown} />
      </div>
      <Reveal delay={0.2}>
        <div className="chips">
          <span className="chip chip--accent">Dean&apos;s Scholarship</span>
          <span className="chip chip--accent">First Class with Distinction</span>
          <span className="chip">Plant-Seedling CNN · Published</span>
        </div>
      </Reveal>
      <TechRow items={stacks.srm} />
    </Chapter>
  );
}
