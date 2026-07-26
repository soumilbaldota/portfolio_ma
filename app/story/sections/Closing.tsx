"use client";
import { Chapter, Reveal } from "../lib";
import { profile, skills } from "../../content/library";

const ACCENT = "#7ab8ff";

export function Closing() {
  return (
    <Chapter
      id="now"
      accent={ACCENT}
      eyebrow={`Now · ${profile.location}`}
      title={
        <>
          Let&apos;s build something <span className="accented">close to the metal.</span>
        </>
      }
      lede={`Currently an M.S. CS student at Columbia, seeking ${profile.seeking}. If you're working on kernels, eBPF, performance, or edge infrastructure, I'd love to talk.`}
      stack
    >
      <Reveal delay={0.15}>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            ✉ Email me
          </a>
          <a className="btn" href={profile.calendar} target="_blank" rel="noreferrer">
            ◷ Book a call
          </a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
            in LinkedIn
          </a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
            ⌥ GitHub
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="skills-grid">
          {skills.map((g) => (
            <div className="skill-card" key={g.label}>
              <h4>{g.label}</h4>
              <p>{g.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="footer">
          {profile.email} · {profile.phone}, built with Next.js + canvas.
        </p>
      </Reveal>
    </Chapter>
  );
}
