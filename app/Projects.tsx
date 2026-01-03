"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Play, Bot, BrainCircuit, Globe, Bird, Cylinder, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from './Modal';

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

// View mode types
type ViewMode = 'small' | 'medium' | 'big' | 'gallery';

// View button with 4-square grid icon
function ViewButton({ currentView, onViewChange }: { currentView: ViewMode; onViewChange: (view: ViewMode) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const viewOptions: { value: ViewMode; label: string }[] = [
    { value: 'small', label: 'Small Icons' },
    { value: 'medium', label: 'Medium Icons' },
    { value: 'big', label: 'Big Icons' },
    { value: 'gallery', label: 'Gallery View' },
  ];
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-zinc-700 rounded transition-colors"
        aria-label="Change view"
      >
        {/* 4-square grid icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-zinc-300">
          <rect x="4" y="4" width="7" height="7" fill="currentColor" />
          <rect x="13" y="4" width="7" height="7" fill="currentColor" />
          <rect x="4" y="13" width="7" height="7" fill="currentColor" />
          <rect x="13" y="13" width="7" height="7" fill="currentColor" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-50 min-w-40">
          {viewOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onViewChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-mono hover:bg-zinc-700 transition-colors ${
                currentView === option.value ? 'bg-blue-500 text-white' : 'text-zinc-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Video thumbnail component - simple and clean
function VideoThumbnail({ project, onClick, onDoubleClick, size = 'medium' }: { 
  project: Project; 
  onClick: () => void;
  onDoubleClick: () => void;
  size?: 'small' | 'medium' | 'big';
}) {
  const sizes = {
    small: { w: 96, h: 72, imgW: 96, imgH: 72, playSize: 'w-6 h-6', textSize: 'text-[10px]', maxW: 'max-w-24' },
    medium: { w: 128, h: 96, imgW: 128, imgH: 96, playSize: 'w-10 h-10', textSize: 'text-xs', maxW: 'max-w-32' },
    big: { w: 192, h: 144, imgW: 192, imgH: 144, playSize: 'w-14 h-14', textSize: 'text-sm', maxW: 'max-w-48' },
  };
  
  const sizeConfig = sizes[size];
  
  return (
    <div 
      className="flex flex-col items-center cursor-pointer group"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {/* Simple thumbnail with play overlay */}
      <div 
        className="relative rounded-md overflow-hidden bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-colors"
        style={{ width: `${sizeConfig.w}px`, height: `${sizeConfig.h}px` }}
      >
        {/* Thumbnail image */}
        <Image
          src={project.thumbnail}
          alt={project.name}
          width={sizeConfig.imgW}
          height={sizeConfig.imgH}
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
          <Play className={`${sizeConfig.playSize} text-white drop-shadow-lg`} fill="white" />
        </div>
      </div>
      
      {/* Project name */}
      <div className={`${sizeConfig.textSize} font-mono text-center mt-2 ${sizeConfig.maxW} truncate text-zinc-300`} title={project.name}>
        {project.name}
      </div>
    </div>
  );
}

// Video carousel content for modal
function VideoCarousel({ projects, initialIndex, selectedCategory }: {
  projects: Project[];
  initialIndex: number;
  selectedCategory: string;
}) {
  // Filter projects by category
  const filteredProjects = projects.filter(p => p.category === selectedCategory);
  
  // Ensure currentIndex is within bounds
  const [currentIndex, setCurrentIndex] = useState(() => 
    Math.min(initialIndex, Math.max(0, filteredProjects.length - 1))
  );
  
  // Update currentIndex when category changes to ensure it's within bounds
  useEffect(() => {
    if (currentIndex >= filteredProjects.length) {
      setCurrentIndex(Math.max(0, filteredProjects.length - 1));
    }
  }, [filteredProjects.length, currentIndex]);
  
  const currentProject = filteredProjects[currentIndex];
  
  // Guard against empty filtered projects
  if (!currentProject) {
    return <div className="w-full h-full flex items-center justify-center bg-black text-white">No projects in this category</div>;
  }
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredProjects.length - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredProjects.length - 1 ? prev + 1 : 0));
  };
  
  return (
    <div className="w-full h-full flex bg-black">
      {/* Video carousel - no sidebar */}
      <div className="flex-1 relative">
        {/* Video */}
        <iframe
          key={currentProject.id}
          src={currentProject.videoUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Previous Button - Left side */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10"
          aria-label="Previous video"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        {/* Next Button - Right side */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10"
          aria-label="Next video"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        {/* Project info overlay - Bottom center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full z-10">
          <div className="text-xs font-mono text-white text-center">
            {currentProject.name} • {currentIndex + 1} of {filteredProjects.length}
          </div>
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
function FileArea({ projects, onThumbnailClick, onThumbnailDoubleClick, viewMode, selectedProject }: {
  projects: Project[];
  onThumbnailClick: (project: Project) => void;
  onThumbnailDoubleClick: (project: Project) => void;
  viewMode: ViewMode;
  selectedProject: Project | null;
}) {
  if (viewMode === 'gallery') {
    return (
      <div className="flex h-full">
        {/* Left side - thumbnails list */}
        <div className="flex-1 overflow-auto p-4 bg-zinc-800/10">
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`cursor-pointer group p-2 rounded transition-colors ${
                  selectedProject?.id === project.id ? 'bg-blue-500/20 border border-blue-500' : 'hover:bg-zinc-700/30'
                }`}
                onClick={() => onThumbnailClick(project)}
                onDoubleClick={() => onThumbnailDoubleClick(project)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-24 h-18 rounded overflow-hidden bg-zinc-800 border border-zinc-700 flex-shrink-0">
                    <Image
                      src={project.thumbnail}
                      alt={project.name}
                      width={96}
                      height={72}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-6 h-6 text-white" fill="white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono text-zinc-300 truncate">{project.name}</div>
                    <div className="text-xs font-mono text-zinc-500">{project.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right side - preview pane */}
        <div className="w-1/2 border-l border-zinc-700 bg-zinc-900/50 flex items-center justify-center p-8">
          {selectedProject ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
                <Image
                  src={selectedProject.thumbnail}
                  alt={selectedProject.name}
                  width={640}
                  height={480}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play className="w-20 h-20 text-white drop-shadow-lg" fill="white" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg font-mono text-zinc-200">{selectedProject.name}</div>
                <div className="text-sm font-mono text-zinc-400 mt-1">{selectedProject.category}</div>
                <div className="text-xs font-mono text-zinc-500 mt-2">Double-click to open video</div>
              </div>
            </div>
          ) : (
            <div className="text-zinc-500 font-mono text-sm">Select a project to preview</div>
          )}
        </div>
      </div>
    );
  }
  
  // Grid view for small/medium/big icons
  const iconSize = viewMode === 'small' ? 'small' : viewMode === 'medium' ? 'medium' : 'big';
  
  return (
    <div className="flex flex-wrap overflow-auto gap-4 p-4 items-start content-start bg-zinc-800/10">
      {projects.map((project) => (
        <VideoThumbnail
          key={project.id}
          project={project}
          onClick={() => onThumbnailClick(project)}
          onDoubleClick={() => onThumbnailDoubleClick(project)}
          size={iconSize}
        />
      ))}
    </div>
  );
}

// Main Projects component
export function Projects() {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Robotics');
  const [viewMode, setViewMode] = useState<ViewMode>('medium');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Filter projects by selected category
  const filteredProjects = PROJECTS_DATA.filter(p => p.category === selectedCategory);
  
  const handleThumbnailClick = (project: Project) => {
    // Single click in gallery view - just select for preview
    if (viewMode === 'gallery') {
      setSelectedProject(project);
    }
  };
  
  const handleThumbnailDoubleClick = (project: Project) => {
    // Double click opens carousel modal
    const categoryProjects = PROJECTS_DATA.filter(p => p.category === project.category);
    const index = categoryProjects.findIndex(p => p.id === project.id);
    setCarouselStartIndex(index);
    setSelectedCategory(project.category);
    setCarouselOpen(true);
  };
  
  return (
    <>
      <div className="w-full h-full flex flex-col">
        {/* Top bar with view button */}
        <div className="bg-zinc-900/50 border-b border-zinc-700 px-4 py-2 flex justify-end items-center">
          <ViewButton currentView={viewMode} onViewChange={setViewMode} />
        </div>
        
        <div className="bg-zinc-950 w-full h-px" />
        
        <div className="grid grid-cols-[1fr_3fr] flex-1 w-full overflow-hidden">
          <Sidebar 
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setSelectedProject(null); // Clear selection when changing category
            }}
          />
          <FileArea 
            projects={filteredProjects}
            onThumbnailClick={handleThumbnailClick}
            onThumbnailDoubleClick={handleThumbnailDoubleClick}
            viewMode={viewMode}
            selectedProject={selectedProject}
          />
        </div>
      </div>
      
      {/* Video Carousel Modal */}
      {carouselOpen && (
        <Modal 
          onClose={() => setCarouselOpen(false)}
          onMinimize={() => {}}
          onMaximize={() => {}}
          isMaximized={false}
        >
          <VideoCarousel
            projects={PROJECTS_DATA}
            initialIndex={carouselStartIndex}
            selectedCategory={selectedCategory}
          />
        </Modal>
      )}
    </>
  );
}
