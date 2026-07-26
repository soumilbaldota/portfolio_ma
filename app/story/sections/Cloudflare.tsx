"use client";
import { useRef } from "react";
import { Chapter, AnimatedCanvas, scenePalette, type SceneDraw } from "../lib";
import { chapterExtras } from "../../content/library";
import { stacks, TechRow } from "../tech";

const ACCENT = "#f6821f";
const PROTOS = [
  { name: "TCP", color: "#5ab0ff" },
  { name: "UDP", color: "#6ee7a8" },
  { name: "QUIC", color: "#c39bff" },
  { name: "ICMP", color: "#ff8f6b" },
];
const CGROUPS = ["edge-proxy", "dns", "warp", "logfwd"];

type Pkt = { x: number; lane: number; sp: number; proto: number; counted: boolean; bytes: number };

export function Cloudflare() {
  const pkts = useRef<Pkt[]>([]);
  const counters = useRef<number[]>([0, 0, 0, 0]);
  const total = useRef(0);
  const lastSpawn = useRef(0);
  const flash = useRef(0);

  const draw: SceneDraw = (ctx, t, w, h) => {
    const pal = scenePalette();
    ctx.fillStyle = pal.L ? "#f6efe6" : "#0a0805";
    ctx.fillRect(0, 0, w, h);
    // orange horizon glow
    const g = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.6);
    g.addColorStop(0, "rgba(246,130,31,0.10)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const nLanes = CGROUPS.length;
    const laneTop = h * 0.18;
    const laneGap = (h * 0.5) / nLanes;
    const hookX = w * 0.44;

    // lane rails + cgroup labels + counters
    ctx.font = "9px 'JetBrains Mono', ui-monospace, monospace";
    for (let i = 0; i < nLanes; i++) {
      const y = laneTop + i * laneGap;
      ctx.strokeStyle = pal.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.fillStyle = pal.faint;
      ctx.textAlign = "left";
      ctx.fillText(`cgroup:${CGROUPS[i]}`, 8, y - 6);
      ctx.fillStyle = ACCENT;
      ctx.textAlign = "right";
      ctx.fillText(counters.current[i].toLocaleString(), w - 8, y - 6);
    }

    // spawn packets
    if (t - lastSpawn.current > 0.09) {
      lastSpawn.current = t;
      pkts.current.push({
        x: -8,
        lane: Math.floor(Math.random() * nLanes),
        sp: 90 + Math.random() * 80,
        proto: Math.floor(Math.random() * PROTOS.length),
        counted: false,
        bytes: 64 + Math.floor(Math.random() * 1400),
      });
      if (pkts.current.length > 90) pkts.current.splice(0, pkts.current.length - 90);
    }

    const dt = 1 / 60;
    // eBPF hook gate
    const hookPulse = Math.max(0, flash.current);
    ctx.fillStyle = `rgba(246,130,31,${0.15 + hookPulse * 0.5})`;
    ctx.fillRect(hookX - 3, laneTop - 16, 6, laneGap * nLanes);
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 1;
    ctx.strokeRect(hookX - 3, laneTop - 16, 6, laneGap * nLanes);
    flash.current = Math.max(0, flash.current - dt * 4);

    // packets
    for (const p of pkts.current) {
      p.x += p.sp * dt;
      const y = laneTop + p.lane * laneGap;
      if (!p.counted && p.x >= hookX) {
        p.counted = true;
        counters.current[p.lane] += 1;
        total.current += p.bytes;
        flash.current = 1;
      }
      const col = PROTOS[p.proto].color;
      ctx.fillStyle = p.counted ? col : `${col}99`;
      ctx.fillRect(p.x, y - 3, 6, 6);
      // trailing streak
      ctx.fillStyle = `${col}22`;
      ctx.fillRect(p.x - 10, y - 1, 10, 2);
    }
    pkts.current = pkts.current.filter((p) => p.x < w + 12);

    // hook label
    ctx.fillStyle = ACCENT;
    ctx.font = "9px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("cgroup_skb / eBPF", hookX, laneTop - 22);
    ctx.fillStyle = pal.faint;
    ctx.fillText("~50 ns / packet", hookX, laneTop + laneGap * nLanes + 6);

    // big live counter
    const cyt = h * 0.86;
    ctx.textAlign = "center";
    ctx.fillStyle = pal.ink;
    ctx.font = "700 30px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText(fmtBytes(total.current), w / 2, cyt);
    ctx.fillStyle = ACCENT;
    ctx.font = "10px 'JetBrains Mono', ui-monospace, monospace";
    ctx.fillText("bytes accounted · on track for ~103B requests/day", w / 2, cyt + 18);

    // protocol legend
    ctx.textAlign = "left";
    ctx.font = "8px 'JetBrains Mono', ui-monospace, monospace";
    let lx = 8;
    for (const pr of PROTOS) {
      ctx.fillStyle = pr.color;
      ctx.fillRect(lx, h - 14, 6, 6);
      ctx.fillStyle = pal.faint;
      ctx.fillText(pr.name, lx + 9, h - 9);
      lx += 46;
    }
  };

  return (
    <Chapter
      id="cloudflare"
      accent={ACCENT}
      company="Cloudflare"
      role="SWE Intern · Performance Team"
      dates="May 2026 – Aug 2026"
      location="Austin, TX"
      logo={chapterExtras.cloudflare.logo}
      highlights={chapterExtras.cloudflare.highlights}
      title={
        <>
          Every packet, <span className="accented">accounted for.</span>
        </>
      }
      lede="Per-cgroup network accounting for Cloudflare's edge: an eBPF datapath in the kernel hot path attributing bytes and packets across all 256 L4 protocols into lock-free per-CPU counters, merged to production and rolling out toward the path of all Cloudflare traffic."
      visual={<AnimatedCanvas draw={draw} />}
    >
      <div className="metric-row" style={{ marginTop: "1.4rem" }}>
        <div className="metric">
          <div className="metric__value">~103B<span className="unit">/day</span></div>
          <div className="metric__label">Requests in path</div>
        </div>
        <div className="metric">
          <div className="metric__value">~50<span className="unit">ns</span></div>
          <div className="metric__label">Per packet</div>
        </div>
        <div className="metric">
          <div className="metric__value">256</div>
          <div className="metric__label">L4 protocols</div>
        </div>
      </div>
      <TechRow items={stacks.cloudflare} />
    </Chapter>
  );
}

function fmtBytes(n: number) {
  if (n > 1e9) return (n / 1e9).toFixed(2) + " GB";
  if (n > 1e6) return (n / 1e6).toFixed(2) + " MB";
  if (n > 1e3) return (n / 1e3).toFixed(1) + " KB";
  return Math.floor(n) + " B";
}
