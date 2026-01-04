"use client";
import React, { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAccentColor } from "./AccentColorContext";

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
• Implemented multi-tenancy using Row-Level Security (RLS) policies, enabling secure data isolation for tenants; eliminated possibility of cross-tenant data leaks.`,
        techStack: [
          { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
          { name: 'NestJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg' },
          { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
          { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
          { name: 'Azure', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
          { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
          { name: 'ArgoCD', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/argocd/argocd-original.svg' },
          { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
          { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' }
        ]
      },
      {
        title: 'Software Engineering Intern',
        duration: 'Jun 2023 – Jun 2024',
        description: `• Optimized database performance by refining schemas, constraints, and indexes; achieved 3x faster query execution for core APIs and enhanced uptime during peak usage, added redis cache to avoid re-computation in certain apis.
• Proposed and enforced strict type checking into a previously type-less codebase and expanded E2E tests, boosting coverage from 40% to 90% and lowering post-deployment regressions by 60% over two release cycles.
• Owned backend reliability improvements by diagnosing performance bottlenecks and driving schema, indexing, and caching optimizations.`,
        techStack: [
          { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
          { name: 'NestJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg' },
          { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
          { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
          { name: 'Azure', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
          { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
          { name: 'ArgoCD', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/argocd/argocd-original.svg' },
          { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
          { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' }
        ]
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
• Developed a multi-modal benchmark model (LSTM, SVM, Regression) for document classification on low-powered mobile devices, achieving 95% validation accuracy.`,
        techStack: [
          { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
          { name: 'PyTorch', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
          { name: 'Hugging Face', logo: 'https://huggingface.co/front/assets/huggingface_logo.svg' }
        ]
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
• Documented project progress and refactored generator code to ensure optimal efficiency and ease of maintenance. Conducted rigorous performance testing and benchmarking to compare C++ and Julia language interfaces.`,
        techStack: [
          { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
          { name: 'Julia', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg' }
        ]
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
    techStack?: TechItem[];
  }[];
}

interface TechItem {
  name: string;
  logo: string;
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


function TimelineItem({ experience, isLast }: TimelineItemProps) {
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const { accentColor, accentColorBorder } = useAccentColor();
  
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
                <div className="flex items-center gap-3">
                  {role.techStack && role.techStack.length > 0 && (
                    <div className="flex items-center gap-2">
                      {role.techStack.slice(0, 2).map((tech) => (
                        <div
                          key={tech.name}
                          className="w-6 h-6 bg-white rounded-full p-1 flex items-center justify-center shadow-sm"
                          title={tech.name}
                        >
                          <Image
                            src={tech.logo}
                            alt={tech.name}
                            width={16}
                            height={16}
                            className="object-contain"
                          />
                        </div>
                      ))}
                      {role.techStack.length > 2 && (
                        <span className="text-xs text-zinc-400 font-medium">
                          +{role.techStack.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  {expandedRole === index ? (
                    <ChevronDown className="w-5 h-5" style={{ color: accentColor }} />
                  ) : (
                    <ChevronRight className="w-5 h-5" style={{ color: accentColor }} />
                  )}
                </div>
              </button>

              {expandedRole === index && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-700/50">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {role.description}
                  </ReactMarkdown>
                  {role.techStack && role.techStack.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-700/30">
                      <p className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Technologies Used</p>
                      <div className="flex flex-wrap gap-3">
                        {role.techStack.map((tech) => (
                          <div
                            key={tech.name}
                            className="flex items-center gap-2 bg-zinc-900/50 px-3 py-2 rounded-lg border border-zinc-700/40 hover:border-blue-500/50 transition-colors group"
                            title={tech.name}
                          >
                            <Image
                              src={tech.logo}
                              alt={tech.name}
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                            <span className="text-xs text-zinc-300 group-hover:text-blue-400 transition-colors">{tech.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
