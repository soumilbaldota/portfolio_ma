"use client";
import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useAccentColor } from './AccentColorContext';

interface WorkExperience {
  id: string;
  company: string;
  location: string;
  logo: string;
  roles: {
    title: string;
    duration: string;
    description: string;
  }[];
}

const workExperiences: WorkExperience[] = [
  {
    id: 'maximl',
    company: 'Maximl Labs',
    location: 'Bangalore, India',
    logo: '/logos/maximl.svg',
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
    logo: '/logos/samsung.svg',
    roles: [
      {
        title: 'Software Engineering Intern (Prism)',
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
    logo: '/logos/cern.svg',
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

interface TimelineItemProps {
  experience: WorkExperience;
  isLast: boolean;
}

function TimelineItem({ experience, isLast }: TimelineItemProps) {
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const { accentColor, accentColorBorder } = useAccentColor();

  const toggleRole = (index: number) => {
    setExpandedRole(expandedRole === index ? null : index);
  };

  return (
    <div className="relative flex gap-6 pb-8">
      {/* Timeline line */}
      {!isLast && (
        <div 
          className="absolute left-12 top-24 bottom-0 w-0.5 bg-gradient-to-b" 
          style={{ 
            backgroundImage: `linear-gradient(to bottom, ${accentColor}, ${accentColor}dd)` 
          }}
        />
      )}
      
      {/* Logo */}
      <div className="flex-shrink-0 z-10">
        <div 
          className="w-24 h-24 rounded-full bg-white dark:bg-zinc-800 p-2 shadow-lg ring-2 flex items-center justify-center overflow-hidden"
          style={{ ringColor: accentColorBorder }}
        >
          <Image
            src={experience.logo}
            alt={`${experience.company} logo`}
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-2">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-zinc-100">{experience.company}</h3>
          <p className="text-sm text-zinc-400">{experience.location}</p>
        </div>

        {/* Roles */}
        <div className="space-y-3">
          {experience.roles.map((role, index) => (
            <div
              key={index}
              className="bg-zinc-800/50 backdrop-blur-sm rounded-lg border border-zinc-700/50 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleRole(index)}
                className="w-full px-4 py-3 flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-zinc-200">{role.title}</h4>
                  <p className="text-sm text-zinc-400">{role.duration}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {expandedRole === index ? (
                    <ChevronDown className="w-5 h-5" style={{ color: accentColor }} />
                  ) : (
                    <ChevronRight className="w-5 h-5" style={{ color: accentColor }} />
                  )}
                </div>
              </button>
              
              {expandedRole === index && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-700/50">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => (
                        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line" {...props} />
                      ),
                      ul: ({ ...props }) => (
                        <ul className="list-none text-zinc-300 space-y-1" {...props} />
                      ),
                      li: ({ ...props }) => (
                        <li className="text-sm text-zinc-300 leading-relaxed" {...props} />
                      ),
                    }}
                  >
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
