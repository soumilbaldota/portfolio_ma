"use client";
import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

// Project data structure
type Project = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  description?: string;
};

// Sample projects data with embedded YouTube videos (TODO: Replace with actual video URLs)
const PROJECTS_DATA: Project[] = [
  // Web Development Projects
  { id: '1', name: 'E-commerce Platform', category: 'Web Development', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '2', name: 'Real-time Chat App', category: 'Web Development', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '3', name: 'Task Management System', category: 'Web Development', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  
  // Mobile Development Projects
  { id: '4', name: 'Fitness Tracker App', category: 'Mobile Development', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '5', name: 'Food Delivery App', category: 'Mobile Development', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '6', name: 'Social Media App', category: 'Mobile Development', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  
  // Machine Learning Projects
  { id: '7', name: 'Image Recognition', category: 'Machine Learning', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '8', name: 'Natural Language Processing', category: 'Machine Learning', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '9', name: 'Recommendation System', category: 'Machine Learning', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  
  // Data Science Projects
  { id: '10', name: 'Financial Analysis Dashboard', category: 'Data Science', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '11', name: 'Market Trend Predictor', category: 'Data Science', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '12', name: 'Customer Segmentation', category: 'Data Science', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  
  // DevOps Projects
  { id: '13', name: 'CI/CD Pipeline', category: 'DevOps', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '14', name: 'Cloud Infrastructure', category: 'DevOps', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '15', name: 'Monitoring Dashboard', category: 'DevOps', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  
  // UI/UX Projects
  { id: '16', name: 'Design System', category: 'UI/UX', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '17', name: 'Portfolio Website', category: 'UI/UX', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '18', name: 'Landing Page Collection', category: 'UI/UX', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
];

// Video thumbnail component that looks like macOS file icons
function VideoThumbnail({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div 
      className="flex flex-col items-center m-2 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-700 hover:bg-zinc-600 transition-colors border border-zinc-600">
        <Image
          src={project.thumbnail}
          alt={project.name}
          width={80}
          height={80}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Play className="w-8 h-8 text-white" fill="white" />
        </div>
      </div>
      <div className="text-xs font-mono text-center mt-1 max-w-20 truncate" title={project.name}>
        {project.name}
      </div>
    </div>
  );
}

// QuickLook-style preview modal
function QuickLookPreview({ project, onClose, onOpenCarousel }: { 
  project: Project; 
  onClose: () => void;
  onOpenCarousel: () => void;
}) {
  return (
    <div 
      className="fixed inset-0 flex justify-center items-center z-50 bg-black/60"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900/95 rounded-lg overflow-hidden w-4/5 max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-10 bg-zinc-800/95 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div 
              className="h-3 w-3 rounded-full bg-red-500 cursor-pointer" 
              onClick={onClose}
              role="button"
              aria-label="Close preview"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onClose()}
            />
            <div className="h-3 w-3 rounded-full bg-yellow-500" role="presentation" />
            <div 
              className="h-3 w-3 rounded-full bg-green-500 cursor-pointer" 
              onClick={onOpenCarousel}
              role="button"
              aria-label="Open in carousel view"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onOpenCarousel()}
            />
          </div>
          <div className="font-mono text-sm text-zinc-300">{project.name}</div>
          <div className="w-12"></div>
        </div>
        
        {/* Video Preview */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={project.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* Info bar */}
        <div className="bg-zinc-800/80 p-3 text-sm font-mono text-zinc-300">
          <div>Category: {project.category}</div>
          <div className="text-xs text-zinc-400 mt-1">
            Click green button to open in carousel view
          </div>
        </div>
      </div>
    </div>
  );
}

// Video carousel component
function VideoCarousel({ projects, initialIndex, onClose }: {
  projects: Project[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentProject = projects[currentIndex];
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };
  
  return (
    <div 
      className="fixed inset-0 flex justify-center items-center z-50 bg-black/80"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900/95 rounded-lg overflow-hidden w-11/12 max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-10 bg-zinc-800/95 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div 
              className="h-3 w-3 rounded-full bg-red-500 cursor-pointer" 
              onClick={onClose}
              role="button"
              aria-label="Close carousel"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onClose()}
            />
            <div className="h-3 w-3 rounded-full bg-yellow-500" role="presentation" />
            <div className="h-3 w-3 rounded-full bg-green-500" role="presentation" />
          </div>
          <div className="font-mono text-sm text-zinc-300">
            {currentProject.name} ({currentIndex + 1} of {projects.length})
          </div>
          <div className="w-12"></div>
        </div>
        
        {/* Video */}
        <div className="relative aspect-video bg-black">
          <iframe
            key={currentProject.id}
            src={currentProject.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* Controls */}
        <div className="bg-zinc-800/80 p-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-mono"
          >
            Previous
          </button>
          
          <div className="text-sm font-mono text-zinc-300 text-center">
            <div>{currentProject.name}</div>
            <div className="text-xs text-zinc-400">{currentProject.category}</div>
          </div>
          
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-mono"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Projects component
export function Projects() {
  const [quickLookProject, setQuickLookProject] = useState<Project | null>(null);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  
  // Group projects by category
  const projectsByCategory = PROJECTS_DATA.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);
  
  const handleThumbnailClick = (project: Project) => {
    setQuickLookProject(project);
  };
  
  const handleOpenCarousel = () => {
    if (quickLookProject) {
      const index = PROJECTS_DATA.findIndex(p => p.id === quickLookProject.id);
      setCarouselStartIndex(index);
      setQuickLookProject(null);
      setCarouselOpen(true);
    }
  };
  
  return (
    <div className="w-full h-full bg-zinc-800/90 overflow-auto p-4">
      <div className="bg-zinc-950 w-full h-px mb-4" />
      
      <div className="space-y-6">
        {Object.entries(projectsByCategory).map(([category, projects]) => (
          <div key={category} className="bg-zinc-900/40 rounded-lg p-4">
            {/* Category header - looks like macOS Finder section */}
            <div className="flex items-center mb-3 pb-2 border-b border-zinc-700">
              <div className="text-sm font-mono font-bold text-zinc-300">{category}</div>
              <div className="ml-2 text-xs font-mono text-zinc-500">({projects.length} items)</div>
            </div>
            
            {/* Project thumbnails grid */}
            <div className="flex flex-wrap gap-2">
              {projects.map((project) => (
                <VideoThumbnail
                  key={project.id}
                  project={project}
                  onClick={() => handleThumbnailClick(project)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* QuickLook Preview */}
      {quickLookProject && (
        <QuickLookPreview
          project={quickLookProject}
          onClose={() => setQuickLookProject(null)}
          onOpenCarousel={handleOpenCarousel}
        />
      )}
      
      {/* Video Carousel */}
      {carouselOpen && (
        <VideoCarousel
          projects={PROJECTS_DATA}
          initialIndex={carouselStartIndex}
          onClose={() => setCarouselOpen(false)}
        />
      )}
    </div>
  );
}
