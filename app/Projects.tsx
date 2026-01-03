"use client";
import { useState } from 'react';
import Image from 'next/image';
import { Play, Bot, BrainCircuit, Globe, Bird, Cylinder } from 'lucide-react';

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
  // Robotics Projects
  { id: '1', name: 'Autonomous Drone', category: 'Robotics', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '2', name: 'Robotic Arm', category: 'Robotics', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '3', name: 'Line Following Robot', category: 'Robotics', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  
  // ML Projects
  { id: '4', name: 'Image Recognition', category: 'ML', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '5', name: 'Natural Language Processing', category: 'ML', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '6', name: 'Recommendation System', category: 'ML', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  
  // FullStack Projects
  { id: '7', name: 'E-commerce Platform', category: 'FullStack', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '8', name: 'Real-time Chat App', category: 'FullStack', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '9', name: 'Task Management System', category: 'FullStack', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '10', name: 'Social Media App', category: 'FullStack', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  
  // Kernel Hacking Projects
  { id: '11', name: 'Custom File System', category: 'Kernel Hacking', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '12', name: 'Device Driver Development', category: 'Kernel Hacking', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '13', name: 'Memory Management', category: 'Kernel Hacking', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  
  // DB Projects
  { id: '14', name: 'Database Optimizer', category: 'DB', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '15', name: 'Query Engine', category: 'DB', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '16', name: 'Distributed Database', category: 'DB', thumbnail: '/projects.png', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
];

// Video thumbnail component - simpler macOS-style
function VideoThumbnail({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div 
      className="flex flex-col items-center cursor-pointer group relative"
      onClick={onClick}
    >
      {/* macOS-style window thumbnail */}
      <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-colors">
        {/* Traffic light buttons */}
        <div className="absolute top-1 left-2 flex gap-1 z-10">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        
        {/* Thumbnail image */}
        <Image
          src={project.thumbnail}
          alt={project.name}
          width={128}
          height={96}
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
          <Play className="w-10 h-10 text-white drop-shadow-lg" fill="white" />
        </div>
      </div>
      
      {/* Project name */}
      <div className="text-xs font-mono text-center mt-2 max-w-32 truncate text-zinc-300" title={project.name}>
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

// Sidebar with category navigation
function Sidebar({ selectedCategory, onSelectCategory }: { 
  selectedCategory: string; 
  onSelectCategory: (category: string) => void;
}) {
  const categories = [
    { name: 'Robotics', icon: Bot },
    { name: 'ML', icon: BrainCircuit },
    { name: 'FullStack', icon: Globe },
    { name: 'Kernel Hacking', icon: Bird },
    { name: 'DB', icon: Cylinder },
  ];
  
  return (
    <div className="bg-zinc-800/20 backdrop-blur-2xl flex flex-col">
      {categories.map(({ name, icon: Icon }) => (
        <div
          key={name}
          className={`p-2 font-mono bg-zinc-800/30 flex items-center cursor-pointer transition-colors ${
            selectedCategory === name ? 'bg-blue-500' : 'hover:bg-blue-500'
          }`}
          onClick={() => onSelectCategory(name)}
        >
          <Icon className="mr-2" /> {name}
        </div>
      ))}
    </div>
  );
}

// File area with video thumbnails
function FileArea({ projects, onThumbnailClick }: {
  projects: Project[];
  onThumbnailClick: (project: Project) => void;
}) {
  return (
    <div className="flex flex-wrap overflow-auto gap-4 p-4 items-start content-start bg-zinc-800/10">
      {projects.map((project) => (
        <VideoThumbnail
          key={project.id}
          project={project}
          onClick={() => onThumbnailClick(project)}
        />
      ))}
    </div>
  );
}

// Main Projects component
export function Projects() {
  const [quickLookProject, setQuickLookProject] = useState<Project | null>(null);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Robotics');
  
  // Filter projects by selected category
  const filteredProjects = PROJECTS_DATA.filter(p => p.category === selectedCategory);
  
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
    <div className="w-full h-full max-w-200 max-h-92">
      <div className="bg-zinc-950 w-full h-px" />
      
      <div className="grid grid-cols-[1fr_3fr] h-full w-full">
        <Sidebar 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <FileArea 
          projects={filteredProjects}
          onThumbnailClick={handleThumbnailClick}
        />
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
