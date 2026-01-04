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
    <div className="bg-surface-secondary border-b border-border">
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Navigation buttons */}
        <button 
          className="p-1 rounded disabled:opacity-30 transition-colors hover:bg-surface-tertiary" 
          disabled
        >
          <ChevronLeft className="w-4 h-4 text-text-muted" />
        </button>
        <button 
          className="p-1 rounded disabled:opacity-30 transition-colors hover:bg-surface-tertiary" 
          disabled
        >
          <ChevronRight className="w-4 h-4 text-text-muted" />
        </button>
        <button 
          className="p-1 rounded disabled:opacity-30 transition-colors hover:bg-surface-tertiary" 
          disabled
        >
          <RefreshCw className="w-4 h-4 text-text-muted" />
        </button>
        
        {/* Address bar */}
        <div className="flex-1 flex items-center bg-surface-primary rounded px-3 py-1.5 gap-2">
          <Lock className="w-3 h-3 text-green-500" />
          <span className="text-xs text-text-muted font-mono truncate">
            {url || `https://projects.portfolio/${projectName.toLowerCase().replace(/\s+/g, '-')}`}
          </span>
        </div>
        
        <Globe className="w-4 h-4 text-text-muted" />
      </div>
    </div>
  );
}

// Project details sidebar
function ProjectDetailsSidebar({ project }: { project: ProjectDetails }) {
  const { accentColor, accentColorLight, accentColorBorder } = useAccentColor();
  return (
    <div className="w-full h-full overflow-auto bg-surface-primary p-6">
      {/* Project Description */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-emphasis mb-3">{project.name}</h2>
        <p className="text-sm text-text-secondary leading-relaxed">{project.description}</p>
      </div>
      
      {/* Languages/Technologies */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">Technologies</h3>
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
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">README</h3>
        <div className="bg-surface-secondary rounded-lg p-4 border border-border">
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({...props}) => <h1 className="text-xl font-bold text-text-emphasis mb-3 mt-4 first:mt-0" {...props} />,
                h2: ({...props}) => <h2 className="text-lg font-bold text-text-emphasis mb-2 mt-3" {...props} />,
                h3: ({...props}) => <h3 className="text-base font-semibold text-text-primary mb-2 mt-2" {...props} />,
                p: ({...props}) => <p className="text-sm text-text-secondary mb-2 leading-relaxed" {...props} />,
                ul: ({...props}) => <ul className="text-sm text-text-secondary mb-2 ml-4 list-disc space-y-1" {...props} />,
                ol: ({...props}) => <ol className="text-sm text-text-secondary mb-2 ml-4 list-decimal space-y-1" {...props} />,
                li: ({...props}) => <li className="text-sm text-text-secondary" {...props} />,
                code: (props) => {
                  const { inline, ...rest } = props as { inline?: boolean; [key: string]: unknown };
                  return inline ? (
                    <code 
                      className="px-1 py-0.5 rounded text-xs font-mono bg-surface-tertiary" 
                      style={{ color: accentColor }}
                      {...rest} 
                    />
                  ) : (
                    <code className="block bg-surface-primary text-text-primary p-2 rounded text-xs font-mono overflow-x-auto" {...rest} />
                  );
                },
                pre: ({...props}) => <pre className="bg-surface-primary rounded p-2 mb-2 overflow-x-auto" {...props} />,
                a: ({...props}) => (
                  <a 
                    className="underline hover:opacity-80" 
                    style={{ color: accentColor }}
                    {...props} 
                  />
                ),
                blockquote: ({...props}) => <blockquote className="pl-3 italic text-text-muted my-2 border-l-2" style={{ borderColor: accentColor }} {...props} />,
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
            className="inline-flex items-center gap-2 px-4 py-2 text-text-primary text-sm font-mono rounded border border-border transition-colors hover:bg-surface-tertiary"
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
        <div className="w-96 border-l border-border">
          <ProjectDetailsSidebar project={project} />
        </div>
      </div>
    </div>
  );
}
