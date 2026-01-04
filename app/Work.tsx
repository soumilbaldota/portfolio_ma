"use client";
import React, { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronRight } from "lucide-react";

const workExperiences: WorkExperience[] = [
  {
    id: 'maximl',
    company: 'Maximl Labs',
    location: 'Bangalore, India',
    logos: ['/logos/maximl.png'],
    roles: [
      {
        title: 'Software Engineer',
        duration: 'Jun 2024 – Jul 2025',
        description: `• Led design and rollout of a Redis-based background job framework, coordinating adoption across multiple backend teams and driving organization-wide standardization.
• Collaborated with product and frontend teams to translate requirements into scalable backend APIs, identifying edge cases and failure modes early in the design process.
• Strengthened reliability with observability (ELK, Signoz, Datadog) and CI/CD automation (GitLab, ArgoCD), lowering incident resolution from 2h→30m and deployment time by 80%.
• Implemented multi-tenancy using Row-Level Security (RLS) policies, enabling secure data isolation for tenants; eliminated possibility of cross-tenant data leaks.`
      },
      {
        title: 'Software Engineering Intern',
        duration: 'Jun 2023 – Jun 2024',
        description: `• Optimized database performance by refining schemas, constraints, and indexes; achieved 3x faster query execution for core APIs and enhanced uptime during peak usage, added redis cache to avoid re-computation in certain apis.
• Proposed and enforced strict type checking into a previously type-less codebase and expanded E2E tests, boosting coverage from 40% to 90% and lowering post-deployment regressions by 60% over two release cycles.
• Owned backend reliability improvements by diagnosing performance bottlenecks and driving schema, indexing, and caching optimizations.`
      }
    ]
  },
  {
    id: 'samsung',
    company: 'Samsung Research',
    location: 'Bangalore, India',
    logos: ['/logos/samsung.png', '/logos/prism.png'],
    roles: [
      {
        title: 'Software Engineering Intern',
        duration: 'Nov 2022 – Jun 2023',
        description: `• Scraped 50k+ text samples across diverse domains and augmented using BERT, generating 120k+ high-quality training samples.
• Developed a multi-modal benchmark model (LSTM, SVM, Regression) for document classification on low-powered mobile devices, achieving 95% validation accuracy.`
      }
    ]
  },
  {
    id: 'cern',
    company: 'CERN, Google Summer of Code',
    location: 'Mountain View, CA',
    logos: ['/logos/hsf.png', '/logos/gsoc.png', '/logos/cern.png'],
    roles: [
      {
        title: 'Software Contributor',
        duration: 'Jun 2022 – Sep 2022',
        description: `• Owned the Julia bindings workstream under GSoC mentorship, coordinating weekly design reviews and iterating based on feedback from CERN maintainers.
• Documented project progress and refactored generator code to ensure optimal efficiency and ease of maintenance. Conducted rigorous performance testing and benchmarking to compare C++ and Julia language interfaces.`
      }
    ]
  }
];


interface WorkExperience {
  id: string;
  company: string;
  location: string;
  logos: string[];
  roles: {
    title: string;
    duration: string;
    description: string;
  }[];
}

interface TimelineItemProps {
  experience: WorkExperience;
  isLast: boolean;
}

const STACK_OFFSET = 6;

const PHASE_DURATION = 150;

type Phase = "idle" | "ejecting" | "inserting";

export function LogoDeck({ logos }: { logos: string[] }) {
  const [deck, setDeck] = useState(logos);
  const [phase, setPhase] = useState<Phase>("idle");

  const handleClick = () => {
    if (deck.length <= 1 || phase !== "idle") return;

    // Phase 1: eject last card
    setPhase("ejecting");

    // Phase boundary: rotate deck (z-index swap)
    setTimeout(() => {
      setDeck((prev) => {
        const last = prev[prev.length - 1];
        return [last, ...prev.slice(0, -1)];
      });

      // Phase 2: insert new first card
      setPhase("inserting");
    }, PHASE_DURATION);

    // End
    setTimeout(() => {
      setPhase("idle");
    }, PHASE_DURATION * 2);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-24 h-24 ${deck.length > 1 ? "cursor-pointer" : ""}`}
    >
      {deck.map((logo, index) => {
        const isFirst = index === 0;
        const isLast = index === deck.length - 1;

        const baseX = index * STACK_OFFSET;
        const baseY = -index * STACK_OFFSET;

        let x = baseX;
        let y = baseY;

        if (phase === "ejecting" && isLast) {
          // Only last card moves out
          x += 18;
          y -= 18;
        }

        if (phase === "inserting" && isFirst) {
          // Only new first card moves in
          x = STACK_OFFSET;
          y = -STACK_OFFSET;
        }

        return (
          <div
            key={logo}
            className="absolute inset-0 transition-transform ease-out"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              transitionDuration: `${PHASE_DURATION}ms`,
              zIndex: deck.length - index,
            }}
          >
            <div
              className={`w-full h-full rounded-full bg-white p-2 flex items-center justify-center ${isFirst
                  ? "shadow-lg ring-2 ring-blue-500/40"
                  : "shadow-md ring-2 ring-blue-500/20"
                }`}
            >
              <Image
                src={logo}
                alt="company logo"
                width={80}
                height={80}
                className="object-contain rounded-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}



export function TimelineItem({ experience, isLast }: TimelineItemProps) {
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  
  const toggleRole = (index: number) => {
    setExpandedRole((prev) => (prev === index ? null : index));
  };


  return (
    <div className="relative flex gap-6 pb-8">
      {!isLast && (
        <div className="absolute left-12 top-24 bottom-0 w-0.5 bg-linear-to-b from-blue-500 to-blue-700" />
      )}
      <div
        className={`relative w-24 h-24 ${experience.logos.length > 1 ? "cursor-pointer" : ""
          }`}
      >
        <div className="relative w-24 h-24">
          <LogoDeck logos={experience.logos} />
        </div>
      </div>



      {/* Content */}
      <div className="flex-1 pt-2">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-zinc-100">
            {experience.company}
          </h3>
          <p className="text-sm text-zinc-400">{experience.location}</p>
        </div>

        <div className="space-y-3">
          {experience.roles.map((role, index) => (
            <div
              key={index}
              className="bg-zinc-800/50 backdrop-blur-sm rounded-lg border border-zinc-700/50 overflow-hidden"
            >
              <button
                onClick={() => toggleRole(index)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-700/30"
              >
                <div className="text-left">
                  <h4 className="font-semibold text-zinc-200">
                    {role.title}
                  </h4>
                  <p className="text-sm text-zinc-400">
                    {role.duration}
                  </p>
                </div>
                {expandedRole === index ? (
                  <ChevronDown className="w-5 h-5 text-blue-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-blue-400" />
                )}
              </button>

              {expandedRole === index && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-700/50">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {role.description}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export function Work() {
  return (
    <div className="w-full h-full overflow-auto bg-surface-primary/90 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Work Experience</h1>
          <p className="text-zinc-400">Click on a role to see more details</p>
        </div>

        <div className="space-y-4">
          {workExperiences.map((experience, index) => (
            <TimelineItem
              key={experience.id}
              experience={experience}
              isLast={index === workExperiences.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
