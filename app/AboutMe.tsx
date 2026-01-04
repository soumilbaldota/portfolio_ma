"use client";
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, ChevronDown } from 'lucide-react';

// About Me content
const SHORT_ABOUT_ME = `# About Me (TLDR)

I am a computer science graduate student at Columbia University with a focus on systems, operating systems, and scalable infrastructure. I enjoy working close to the metal and understanding how kernels behave, how networks fail, and how systems can be made more efficient and reliable.

I have worked across research, industry, and open source environments, from SLAM systems on a Mars Rover team to distributed scientific computing at CERN.

Currently, I am focused on deepening my systems expertise, building robust software, and improving through disciplined, consistent work.`;

const FULL_ABOUT_ME = `# About Me (Full Story)

## Early Interest in Computing

I have been drawn to computing since childhood, not just using technology but understanding how it works internally. Early on, I spent time dismantling and reassembling computer hardware and experimenting with operating systems, which led me toward systems level thinking.

This curiosity shaped my academic path. I completed my undergraduate degree in computer science with a GPA of 9.56 out of 10 and received the Dean's Scholarship for academic excellence. During this time, I gravitated toward coursework such as Operating Systems, Design and Analysis of Algorithms, and Digital Image Processing.

## Applied Systems Research

My interest in applied systems research grew through hands on projects. As part of the **Rudra Mars Rover Team**, I led the development of SLAM algorithms under real world constraints where reliability, performance, and rapid debugging were critical.

During an international competition, I helped diagnose and resolve a motor overheating issue mid run, reinforcing how theory, systems intuition, and teamwork intersect under pressure. Our team placed fourth at the International Rover Design Challenge, and I later mentored new team members, passing on both technical and collaborative lessons.

## Professional Experience

I continued developing as a systems engineer through research and industry roles:

- **Google Summer of Code 2022 at CERN**: I worked on a high performance code generation interface for scientific computing and gained exposure to distributed systems and software optimization at scale.

- **Samsung Research**: I led a small team designing a multi modal machine learning model, learning how to balance research ambition with practical constraints.

- **Maximl Labs**: I have been building resource leveling and optimization strategies that streamline enterprise operations and deliver measurable business impact.

Along the way, my exploration of cybersecurity, including identifying vulnerabilities in ISP networks, has shaped how I think about robustness, efficiency, and system security.

## Graduate Studies at Columbia

I am currently pursuing a Master of Science in Computer Science at Columbia University. I have completed rigorous coursework including:

- Operating Systems (widely regarded as one of the most demanding courses in Columbia Engineering)
- Computer Networks
- Natural Language Processing
- Programming for Problem Solving

This semester challenged me both technically and personally. Living in New York has been demanding at times, but it has also been deeply formative. I finished the semester with a 3.5 GPA and a much deeper understanding of the Linux kernel and low level system behavior.

## Current Goals

At this stage, my goals are straightforward and demanding:

1. Strengthen my fundamentals in systems, competitive programming, and system design
2. Contribute meaningful research or open source work
3. Build software that is efficient, secure, and reliable

I believe in steady progress through consistent effort. There is always more to understand in computing systems, and I am motivated by the work that remains to be done.`;

interface SidebarItemProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

function SidebarItem({ title, isActive, onClick }: SidebarItemProps) {
  return (
    <div
      className={`px-3 py-1.5 rounded-md flex items-center cursor-pointer transition-colors ${
        isActive 
          ? 'bg-zinc-700/60' 
          : 'hover:bg-zinc-700/40'
      }`}
      onClick={onClick}
    >
      <span className={`text-[13px] font-sans ${isActive ? 'text-white' : 'text-zinc-300'}`}>
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
  return (
    <div className={`bg-[#1e1e1e]/80 backdrop-blur-xl h-full flex flex-col border-r border-black/20 transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-56'
    }`}>
      {/* Toggle button */}
      <div className="p-3 flex items-center justify-between border-b border-black/20">
        {!isCollapsed && (
          <div className="px-2 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">About Me</div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-zinc-700/40 rounded transition-colors ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-zinc-400" />
          ) : (
            <ChevronDown size={16} className="text-zinc-400" />
          )}
        </button>
      </div>
      
      {/* Sidebar items */}
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
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              selectedTab === 'tldr' ? 'bg-zinc-700/60' : 'hover:bg-zinc-700/40'
            }`}
            title="TLDR"
          >
            <span className="text-xs text-zinc-300">T</span>
          </button>
          <button
            onClick={() => onSelectTab('full')}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              selectedTab === 'full' ? 'bg-zinc-700/60' : 'hover:bg-zinc-700/40'
            }`}
            title="Full Story"
          >
            <span className="text-xs text-zinc-300">F</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function AboutMe() {
  const [selectedTab, setSelectedTab] = useState<'tldr' | 'full'>('tldr');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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
        <div className="max-w-3xl mx-auto prose prose-invert prose-zinc max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-3xl font-bold text-zinc-100 mb-6 mt-8 first:mt-0" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-2xl font-bold text-zinc-200 mb-4 mt-6" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-xl font-semibold text-zinc-300 mb-3 mt-4" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="text-base text-zinc-300 mb-4 leading-relaxed" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal list-inside text-zinc-300 mb-4 space-y-2" {...props} />
              ),
              li: ({ ...props }) => (
                <li className="text-base text-zinc-300 leading-relaxed" {...props} />
              ),
              strong: ({ ...props }) => (
                <strong className="font-semibold text-zinc-100" {...props} />
              ),
              em: ({ ...props }) => (
                <em className="italic text-zinc-300" {...props} />
              ),
              code: ({ ...props }) => (
                <code className="bg-zinc-800 text-blue-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
              ),
              pre: ({ ...props }) => (
                <pre className="bg-zinc-800 text-zinc-300 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-zinc-400 my-4" {...props} />
              ),
              a: ({ ...props }) => (
                <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
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
