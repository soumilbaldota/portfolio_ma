"use client";
import { useState } from 'react';
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

// Video thumbnail component - simple and clean
function VideoThumbnail({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div 
      className="flex flex-col items-center cursor-pointer group"
      onClick={onClick}
    >
      {/* Simple thumbnail with play overlay */}
      <div className="relative w-32 h-24 rounded-md overflow-hidden bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-colors">
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

// Video carousel content for modal
function VideoCarousel({ projects, initialIndex, selectedCategory, onCategoryChange }: {
  projects: Project[];
  initialIndex: number;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Filter projects by category
  const filteredProjects = projects.filter(p => p.category === selectedCategory);
  const currentProject = filteredProjects[currentIndex];
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredProjects.length - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredProjects.length - 1 ? prev + 1 : 0));
  };
  
  return (
    <div className="w-full h-full flex">
      {/* Left sidebar with category selection */}
      <Sidebar 
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => {
          onCategoryChange(category);
          setCurrentIndex(0); // Reset to first project when changing category
        }}
      />
      
      {/* Video carousel */}
      <div className="flex-1 relative bg-black">
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
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Robotics');
  
  // Filter projects by selected category
  const filteredProjects = PROJECTS_DATA.filter(p => p.category === selectedCategory);
  
  const handleThumbnailClick = (project: Project) => {
    // Open carousel by default when clicking a thumbnail
    const categoryProjects = PROJECTS_DATA.filter(p => p.category === project.category);
    const index = categoryProjects.findIndex(p => p.id === project.id);
    setCarouselStartIndex(index);
    setSelectedCategory(project.category);
    setCarouselOpen(true);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  return (
    <>
      <div className="w-full h-full">
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
            onCategoryChange={handleCategoryChange}
          />
        </Modal>
      )}
    </>
  );
}
