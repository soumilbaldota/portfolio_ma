"use client";
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useAccentColor } from './AccentColorContext';

const SHORT_ABOUT_ME = `# TLDR

I am a MSCS student at Columbia University with a focus on systems, operating systems, and scalable infrastructure. I enjoy working close to the metal and understanding how kernels behave, how networks fail, and how systems can be made more efficient and reliable.
I have worked across research, industry, and open source environments, from SLAM systems on a Mars Rover team to scientific computing systems at CERN HSF @ Google Summer of Code.
Currently, I am focused on deepening my systems expertise, building robust software, and improving through disciplined, consistent work.

I am currently looking for Summer 2026 internships so please feel free to reachout !
`;

const FULL_ABOUT_ME = `# My Story

I have been drawn to computing since childhood, not just using technology but understanding how it works internally. Early on, I spent time dismantling and reassembling computer hardware and experimenting with operating systems, which led me toward systems level thinking.
This curiosity shaped my academic path. I completed my undergraduate degree in computer science with a GPA of 9.56/10 and received the Dean's Scholarship for academic excellence. During this time, I gravitated toward coursework such as Operating Systems, Design and Analysis of Algorithms, and Digital Image Processing.

My interest in applied systems grew through hands on projects. As part of the Rudra Mars Rover Team, I led the development of SLAM algorithms under real world constraints where reliability, performance, and rapid debugging were critical.

Along the way, my exploration of cybersecurity, including identifying vulnerabilities in ISP networks, has shaped how I think about robustness, efficiency, and system security.

I am currently pursuing a Master of Science in Computer Science at Columbia University. I have completed rigorous coursework including Operating Systems (widely regarded as one of the most demanding courses in Columbia Engineering), Computer Networks, Natural Language Processing, Programming for Problem Solving

This semester challenged me both technically and personally. Living in New York has been demanding at times, but it has also been deeply formative. I finished the semester with a 3.5 GPA and a much deeper understanding of the Linux kernel and low level system behavior.

## Current Goals

At this stage, my goals are straightforward and demanding:

1. Strengthen my fundamentals in systems, competitive programming, and system design 🧠
2. Contribute meaningful research or open source work 🧠
3. Build software that is efficient, secure, and reliable 🧠
4. Get Fitter 💪

I believe in steady progress through consistent effort. There is always more to understand in computing systems, and I am motivated by the work that remains to be done.`;

interface SidebarItemProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

function SidebarItem({ title, isActive, onClick }: SidebarItemProps) {
  const { accentColorLight } = useAccentColor();
  return (
    <div
      className="px-3 py-1.5 rounded-md flex items-center cursor-pointer transition-colors hover:bg-surface-tertiary"
      style={{
        backgroundColor: isActive ? accentColorLight : 'transparent'
      }}
      onClick={onClick}
    >
      <span className={`text-[13px] font-sans ${isActive ? 'text-white' : 'text-text-primary'}`}>
        {title}
      </span>
    </div>
  );
}

interface SidebarProps {
  selectedTab: 'tldr' | 'full';
  onSelectTab: (tab: 'tldr' | 'full') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function Sidebar({ selectedTab, onSelectTab, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { accentColorLight } = useAccentColor();
  return (
    <div className={`bg-surface-primary/95 backdrop-blur-xl h-full flex flex-col border-r border-divider transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-30'
    }`}>
      {/* Toggle button */}
      <div className="p-3 flex items-center justify-between border-b border-divider">
        {!isCollapsed && (
          <div className="px-2 text-[11px] font-bold text-text-muted uppercase tracking-wider">About Me</div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded transition-colors hover:bg-surface-tertiary ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-text-muted" />
          ) : (
            <ChevronDown size={16} className="text-text-muted" />
          )}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="p-3 flex flex-col gap-0.5">
          <SidebarItem
            title="TLDR"
            isActive={selectedTab === 'tldr'}
            onClick={() => onSelectTab('tldr')}
          />
          <SidebarItem
            title="Full Story"
            isActive={selectedTab === 'full'}
            onClick={() => onSelectTab('full')}
          />
        </div>
      )}
      
      {/* Collapsed state - show icons */}
      {isCollapsed && (
        <div className="flex flex-col items-center gap-2 p-2">
          <button
            onClick={() => onSelectTab('tldr')}
            className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:bg-surface-tertiary"
            style={{
              backgroundColor: selectedTab === 'tldr' ? accentColorLight : 'transparent'
            }}
            title="TLDR"
          >
            <span className="text-xs text-text-primary">T</span>
          </button>
          <button
            onClick={() => onSelectTab('full')}
            className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:bg-surface-tertiary"
            style={{
              backgroundColor: selectedTab === 'full' ? accentColorLight : 'transparent'
            }}
            title="Full Story"
          >
            <span className="text-xs text-text-primary">F</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function AboutMe() {
  const [selectedTab, setSelectedTab] = useState<'tldr' | 'full'>('tldr');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { accentColor } = useAccentColor();
  
  const content = selectedTab === 'tldr' ? SHORT_ABOUT_ME : FULL_ABOUT_ME;
  
  return (
    <div className="w-full h-full flex">
      <Sidebar
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      {/* Main content area - Markdown rendering */}
      <div className="flex-1 overflow-auto bg-surface-primary/90 p-8">
        <div className="max-w-3xl mx-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-3xl font-bold text-text-emphasis mb-6 mt-8 first:mt-0" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-2xl font-bold text-text-primary mb-4 mt-6" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-xl font-semibold text-text-primary mb-3 mt-4" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="text-base text-text-secondary mb-4 leading-relaxed" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal list-inside text-text-secondary mb-4 space-y-2" {...props} />
              ),
              li: ({ ...props }) => (
                <li className="text-base text-text-secondary leading-relaxed" {...props} />
              ),
              strong: ({ ...props }) => (
                <strong className="font-semibold text-text-emphasis" {...props} />
              ),
              em: ({ ...props }) => (
                <em className="italic text-text-secondary" {...props} />
              ),
              code: ({ ...props }) => (
                <code 
                  className="px-1.5 py-0.5 rounded text-sm font-mono bg-surface-tertiary" 
                  style={{ color: accentColor }}
                  {...props} 
                />
              ),
              pre: ({ ...props }) => (
                <pre className="bg-surface-tertiary text-text-primary p-4 rounded-lg overflow-x-auto mb-4" {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote 
                  className="pl-4 italic text-text-muted my-4 border-l-4" 
                  style={{ borderColor: accentColor }}
                  {...props} 
                />
              ),
              a: ({ ...props }) => (
                <a 
                  className="underline hover:opacity-80" 
                  style={{ color: accentColor }}
                  {...props} 
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
