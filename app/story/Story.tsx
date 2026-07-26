"use client";
import { useEffect, useState } from "react";
import { Hero } from "./sections/Hero";
import { Rover } from "./sections/Rover";
import { Cern } from "./sections/Cern";
import { Samsung } from "./sections/Samsung";
import { Maximl } from "./sections/Maximl";
import { Superfork } from "./sections/Superfork";
import { Cloudflare } from "./sections/Cloudflare";
import { Academics } from "./sections/Academics";
import { ThemeToggle } from "./ThemeToggle";

type Tab = "experience" | "academics";

// reverse-chronological
const EXPERIENCE_STOPS = [
  { id: "top", label: "Intro" },
  { id: "cloudflare", label: "Cloudflare" },
  { id: "superfork", label: "Columbia · Research" },
  { id: "maximl", label: "Maximl Labs" },
  { id: "samsung", label: "Samsung" },
  { id: "cern", label: "CERN · GSoC" },
  { id: "rudra", label: "Team RUDRA" },
];
const ACADEMIC_STOPS = [
  { id: "columbia-edu", label: "Columbia" },
  { id: "srm", label: "SRM" },
];

function Rail({ stops }: { stops: { id: string; label: string }[] }) {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    stops.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [stops]);
  return (
    <nav className="rail" aria-label="Chapters">
      {stops.map((s) => (
        <button
          key={s.id}
          className="rail__dot"
          aria-current={active === s.id}
          aria-label={s.label}
          title={s.label}
          onClick={() =>
            document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })
          }
        />
      ))}
    </nav>
  );
}

function Tabs({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="tabs" role="tablist" aria-label="Sections">
      {(["experience", "academics"] as Tab[]).map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={tab === t}
          className={`tabs__tab ${tab === t ? "tabs__tab--on" : ""}`}
          onClick={() => onChange(t)}
        >
          {t === "experience" ? "Experience" : "Academics"}
        </button>
      ))}
    </div>
  );
}

export function Story() {
  const [tab, setTab] = useState<Tab>("experience");

  const switchTab = (t: Tab) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <main>
      <ThemeToggle />
      <Tabs tab={tab} onChange={switchTab} />
      <Rail stops={tab === "experience" ? EXPERIENCE_STOPS : ACADEMIC_STOPS} />
      {tab === "experience" ? (
        <>
          <Hero />
          <Cloudflare />
          <Superfork />
          <Maximl />
          <Samsung />
          <Cern />
          <Rover />
        </>
      ) : (
        <Academics />
      )}
    </main>
  );
}
