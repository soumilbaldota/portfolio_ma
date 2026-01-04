"use client";
import { Globe, Lock, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

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
        <button className="p-1 rounded hover:bg-zinc-700 disabled:opacity-30" disabled>
          <ChevronLeft className="w-4 h-4 text-zinc-400" />
        </button>
        <button className="p-1 rounded hover:bg-zinc-700 disabled:opacity-30" disabled>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>
        <button className="p-1 rounded hover:bg-zinc-700 disabled:opacity-30" disabled>
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
              className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded-full border border-blue-500/30"
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
            <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {project.readme}
            </div>
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-mono rounded border border-zinc-600 transition-colors"
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
