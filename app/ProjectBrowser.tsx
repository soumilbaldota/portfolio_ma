"use client";
import { Globe, Lock, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAccentColor } from './AccentColorContext';

// Extended Project type with more details
export type ProjectDetails = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  readme: string;
  languages: string[];
  githubUrl?: string;
};

// Browser chrome component
function BrowserChrome({ projectName, url }: { projectName: string; url?: string }) {
  return (
    <div className="bg-zinc-800 border-b border-zinc-700">
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Navigation buttons */}
        <button 
          className="p-1 rounded disabled:opacity-30 transition-colors" 
          disabled
          style={{
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ChevronLeft className="w-4 h-4 text-zinc-400" />
        </button>
        <button 
          className="p-1 rounded disabled:opacity-30 transition-colors" 
          disabled
          style={{
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>
        <button 
          className="p-1 rounded disabled:opacity-30 transition-colors" 
          disabled
          style={{
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <RefreshCw className="w-4 h-4 text-zinc-400" />
        </button>
        
        {/* Address bar */}
        <div className="flex-1 flex items-center bg-zinc-900 rounded px-3 py-1.5 gap-2">
          <Lock className="w-3 h-3 text-green-500" />
          <span className="text-xs text-zinc-400 font-mono truncate">
            {url || `https://projects.portfolio/${projectName.toLowerCase().replace(/\s+/g, '-')}`}
          </span>
        </div>
        
        <Globe className="w-4 h-4 text-zinc-400" />
      </div>
    </div>
  );
}

// Project details sidebar
function ProjectDetailsSidebar({ project }: { project: ProjectDetails }) {
  const { accentColor, accentColorLight, accentColorBorder } = useAccentColor();
  return (
    <div className="w-full h-full overflow-auto bg-zinc-900 p-6">
      {/* Project Description */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-3">{project.name}</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">{project.description}</p>
      </div>
      
      {/* Languages/Technologies */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {project.languages.map((lang) => (
            <span
              key={lang}
              className="px-3 py-1 text-xs font-mono rounded-full"
              style={{
                backgroundColor: accentColorLight,
                color: accentColor,
                border: `1px solid ${accentColorBorder}`
              }}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
      
      {/* README Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">README</h3>
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({...props}) => <h1 className="text-xl font-bold text-white mb-3 mt-4 first:mt-0" {...props} />,
                h2: ({...props}) => <h2 className="text-lg font-bold text-white mb-2 mt-3" {...props} />,
                h3: ({...props}) => <h3 className="text-base font-semibold text-zinc-200 mb-2 mt-2" {...props} />,
                p: ({...props}) => <p className="text-sm text-zinc-300 mb-2 leading-relaxed" {...props} />,
                ul: ({...props}) => <ul className="text-sm text-zinc-300 mb-2 ml-4 list-disc space-y-1" {...props} />,
                ol: ({...props}) => <ol className="text-sm text-zinc-300 mb-2 ml-4 list-decimal space-y-1" {...props} />,
                li: ({...props}) => <li className="text-sm text-zinc-300" {...props} />,
                code: (props) => {
                  const { inline, ...rest } = props as { inline?: boolean; [key: string]: unknown };
                  return inline ? (
                    <code 
                      className="px-1 py-0.5 rounded text-xs font-mono" 
                      style={{ backgroundColor: '#18181b', color: accentColor }}
                      {...rest} 
                    />
                  ) : (
                    <code className="block bg-zinc-900 text-zinc-300 p-2 rounded text-xs font-mono overflow-x-auto" {...rest} />
                  );
                },
                pre: ({...props}) => <pre className="bg-zinc-900 rounded p-2 mb-2 overflow-x-auto" {...props} />,
                a: ({...props}) => (
                  <a 
                    className="underline hover:opacity-80" 
                    style={{ color: accentColor }}
                    {...props} 
                  />
                ),
                blockquote: ({...props}) => <blockquote className="pl-3 italic text-zinc-400 my-2 border-l-2" style={{ borderColor: accentColor }} {...props} />,
              }}
            >
              {project.readme}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      
      {/* GitHub Link */}
      {project.githubUrl && (
        <div>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-mono rounded border transition-colors"
            style={{
              backgroundColor: '#27272a',
              borderColor: '#52525b'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27272a'}
          >
            <Globe className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      )}
    </div>
  );
}

// Main ProjectBrowser component
export function ProjectBrowser({ project }: { project: ProjectDetails }) {
  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Browser Chrome */}
      <BrowserChrome projectName={project.name} url={project.githubUrl} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video */}
        <div className="flex-1 bg-black">
          <iframe
            src={project.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* Right: Details Sidebar */}
        <div className="w-96 border-l border-zinc-700">
          <ProjectDetailsSidebar project={project} />
        </div>
      </div>
    </div>
  );
}
