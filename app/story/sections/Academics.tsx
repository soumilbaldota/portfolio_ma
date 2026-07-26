"use client";
import {
  Chapter,
  AnimatedCanvas,
  Reveal,
  useReveal,
  useCountUp,
  scenePalette,
  type SceneDraw,
} from "../lib";
import { chapterExtras, education } from "../../content/library";

/* Reusable radial GPA gauge. */
function Gauge({
  value,
  max,
  unitLabel,
  accent,
}: {
  value: number;
  max: number;
  unitLabel: string;
  accent: string;
}) {
  const draw: SceneDraw = (ctx, t, w, h) => {
    const pal = scenePalette();
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2,
      cy = h / 2,
      r = Math.min(w, h) * 0.3;
    const target = value / max;
    const p = Math.min(t / 1.6, 1);
    const val = target * (1 - Math.pow(1 - p, 3));

    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += 28) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = pal.hair;
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + val * Math.PI * 2);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.shadowColor = accent;
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = pal.ink;
    ctx.font = `700 ${Math.round(r * 0.6)}px 'Space Grotesk', system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((val * max).toFixed(2), cx, cy - r * 0.05);
    ctx.fillStyle = accent;
    ctx.font = `500 ${Math.round(r * 0.19)}px 'JetBrains Mono', ui-monospace, monospace`;
    ctx.fillText(unitLabel, cx, cy + r * 0.42);

    for (let i = 0; i < 3; i++) {
      const a = t * 0.5 + (i * Math.PI * 2) / 3;
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * (r + 26), cy + Math.sin(a) * (r + 26), 3, 0, Math.PI * 2);
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
      <div className="metric__value">{value % 1 === 0 ? Math.round(v) : v.toFixed(2)}</div>
      <div className="metric__label">{label}</div>
    </div>
  );
}

const COLUMBIA_BLUE = "#7ab8ff";
const GOLD = "#ffd15c";

export function Academics() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const columbia = education[0];
  const srm = education[1];

  return (
    <>
      {/* Columbia — M.S. */}
      <Chapter
        id="columbia-edu"
        accent={COLUMBIA_BLUE}
        company="Columbia University"
        role="M.S. in Computer Science"
        dates={columbia.dates}
        location={columbia.location}
        logo={chapterExtras.columbia.logo}
        title={
          <>
            Sharpening the <span className="accented">fundamentals.</span>
          </>
        }
        lede="A master's focused on systems and operating systems, paired with research in the Software Systems Lab on kernel container forking."
        highlights={[
          "GPA 3.7 / 4.0",
          "Operating Systems, Computer Networks, NLP",
          "Research @ Software Systems Lab (kernel container forking)",
        ]}
        visual={<Gauge value={3.7} max={4} unitLabel="GPA / 4.0" accent={COLUMBIA_BLUE} />}
      />

      {/* SRM — B.Tech */}
      <Chapter
        id="srm"
        accent={GOLD}
        company="SRM Institute"
        role="B.Tech · CS & Big Data Analytics"
        dates={srm.dates}
        location={srm.location}
        logo={chapterExtras.srm.logo}
        title={
          <>
            Where it <span className="accented">started.</span>
          </>
        }
        lede="A B.Tech in Computer Science & Big Data Analytics, and the habits that stuck: dismantling systems until they made sense, then rebuilding them better."
        visual={<Gauge value={9.56} max={10} unitLabel="CGPA / 10" accent={GOLD} />}
      >
        <div className="metric-row" ref={ref}>
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
      </Chapter>
    </>
  );
}
