"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Play, Bot, BrainCircuit, Globe, Bird, Cylinder, Search, X } from 'lucide-react';
import { Modal } from './Modal';
import { ProjectBrowser, type ProjectDetails } from './ProjectBrowser';

// Project data structure
type Project = {
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

// Sample projects data with embedded YouTube videos (TODO: Replace with actual video URLs)
const PROJECTS_DATA: Project[] = [
  // Robotics Projects
  { 
    id: '1', 
    name: 'Autonomous Drone', 
    category: 'Robotics', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'An autonomous drone system capable of navigating complex environments using computer vision and sensor fusion.',
    readme: `# Autonomous Drone Project

## Overview
This project implements a fully autonomous drone system using ROS (Robot Operating System) and computer vision techniques.

## Features
- Real-time object detection and tracking
- Autonomous navigation and path planning
- Obstacle avoidance using LIDAR sensors
- GPS-based waypoint navigation
- Remote monitoring and control interface

## Hardware
- DJI F450 Frame
- Pixhawk Flight Controller
- Raspberry Pi 4
- Intel RealSense Camera
- LIDAR Sensor

## Software Stack
- ROS Melodic
- Python 3.8
- OpenCV for computer vision
- TensorFlow for object detection`,
    languages: ['Python', 'C++', 'ROS', 'OpenCV', 'TensorFlow'],
    githubUrl: 'https://github.com/example/autonomous-drone'
  },
  { 
    id: '2', 
    name: 'Robotic Arm', 
    category: 'Robotics', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'A 6-DOF robotic arm with inverse kinematics for precise manipulation tasks.',
    readme: `# Robotic Arm Control System

## Description
A sophisticated robotic arm control system with 6 degrees of freedom, designed for precise pick-and-place operations.

## Capabilities
- Inverse kinematics solver
- Trajectory planning
- Force feedback control
- Vision-guided manipulation
- ROS integration

## Technical Specifications
- 6 DOF (Degrees of Freedom)
- Payload capacity: 2kg
- Reach: 800mm
- Repeatability: ±0.1mm`,
    languages: ['Python', 'ROS', 'C++', 'Arduino'],
    githubUrl: 'https://github.com/example/robotic-arm'
  },
  { 
    id: '3', 
    name: 'Line Following Robot', 
    category: 'Robotics', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'A mobile robot that autonomously follows lines using IR sensors and PID control.',
    readme: `# Line Following Robot

## Project Overview
An autonomous mobile robot that follows black lines on a white surface using infrared sensors and PID control algorithms.

## Features
- 5 IR sensor array for precise line detection
- PID control for smooth path following
- Adjustable speed control
- Battery level monitoring
- LCD display for real-time data

## Implementation
The robot uses a differential drive system with two DC motors controlled by an H-bridge driver. The sensor readings are processed using a weighted average algorithm to determine the line position.`,
    languages: ['C++', 'Arduino', 'Embedded C'],
    githubUrl: 'https://github.com/example/line-follower'
  },
  
  // ML Projects
  { 
    id: '4', 
    name: 'Image Recognition', 
    category: 'ML', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Deep learning model for multi-class image classification using convolutional neural networks.',
    readme: `# Image Recognition System

## Overview
A state-of-the-art image recognition system built using deep convolutional neural networks.

## Model Architecture
- ResNet-50 backbone
- Transfer learning from ImageNet
- Custom classification head
- Data augmentation pipeline

## Performance
- Accuracy: 94.5% on test set
- Inference time: 25ms per image
- Supports 100+ categories

## Dataset
Trained on a custom dataset of 50,000 images across various categories including animals, vehicles, and everyday objects.`,
    languages: ['Python', 'TensorFlow', 'Keras', 'NumPy'],
    githubUrl: 'https://github.com/example/image-recognition'
  },
  { 
    id: '5', 
    name: 'Natural Language Processing', 
    category: 'ML', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'NLP pipeline for sentiment analysis and text classification using transformer models.',
    readme: `# NLP Sentiment Analysis

## Description
An advanced NLP system for sentiment analysis using transformer-based models.

## Features
- Sentiment classification (positive/negative/neutral)
- Named entity recognition
- Topic modeling
- Multi-language support

## Model
- BERT-based architecture
- Fine-tuned on 100k customer reviews
- Achieves 92% accuracy on test data

## Use Cases
- Customer feedback analysis
- Social media monitoring
- Product review analysis`,
    languages: ['Python', 'PyTorch', 'Transformers', 'NLTK'],
    githubUrl: 'https://github.com/example/nlp-sentiment'
  },
  { 
    id: '6', 
    name: 'Recommendation System', 
    category: 'ML', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Collaborative filtering recommendation engine for personalized content suggestions.',
    readme: `# Recommendation Engine

## Overview
A hybrid recommendation system combining collaborative filtering and content-based approaches.

## Algorithms
- Matrix factorization
- Neural collaborative filtering
- Content-based filtering
- Hybrid ensemble approach

## Performance Metrics
- Precision@10: 0.78
- Recall@10: 0.65
- NDCG@10: 0.82

## Implementation
Built using TensorFlow and Scikit-learn, deployed on AWS with real-time inference capabilities.`,
    languages: ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas'],
    githubUrl: 'https://github.com/example/recommendation-system'
  },
  
  // FullStack Projects
  { 
    id: '7', 
    name: 'E-commerce Platform', 
    category: 'FullStack', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Full-stack e-commerce platform with payment integration and inventory management.',
    readme: `# E-commerce Platform

## Features
- Product catalog with search and filters
- Shopping cart and checkout
- Payment gateway integration (Stripe)
- Order tracking system
- Admin dashboard for inventory management
- User authentication and authorization

## Tech Stack
- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Payment: Stripe API
- Hosting: Vercel + AWS

## Architecture
Microservices architecture with separate services for user management, product catalog, orders, and payments.`,
    languages: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis'],
    githubUrl: 'https://github.com/example/ecommerce-platform'
  },
  { 
    id: '8', 
    name: 'Real-time Chat App', 
    category: 'FullStack', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Real-time messaging application with WebSocket support and group chat functionality.',
    readme: `# Real-time Chat Application

## Features
- One-on-one messaging
- Group chat rooms
- File sharing
- Typing indicators
- Read receipts
- Message history
- User presence status

## Technology
- WebSocket (Socket.io) for real-time communication
- React frontend
- Node.js backend
- MongoDB for message storage
- Redis for session management

## Scalability
Designed to handle 10,000+ concurrent connections using horizontal scaling and load balancing.`,
    languages: ['JavaScript', 'React', 'Node.js', 'Socket.io', 'MongoDB'],
    githubUrl: 'https://github.com/example/chat-app'
  },
  { 
    id: '9', 
    name: 'Task Management System', 
    category: 'FullStack', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Collaborative task management platform with Kanban boards and team collaboration features.',
    readme: `# Task Management System

## Description
A comprehensive task management platform inspired by Jira and Trello.

## Key Features
- Kanban board visualization
- Sprint planning
- Task assignment and tracking
- Time tracking
- Team collaboration
- Customizable workflows
- Analytics and reporting

## Technical Details
- Built with React and TypeScript
- RESTful API with Node.js
- PostgreSQL database
- Real-time updates with WebSockets
- Role-based access control`,
    languages: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
    githubUrl: 'https://github.com/example/task-manager'
  },
  { 
    id: '10', 
    name: 'Social Media App', 
    category: 'FullStack', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Social networking platform with feed, stories, and real-time notifications.',
    readme: `# Social Media Platform

## Overview
A modern social media platform with features similar to Instagram and Twitter.

## Features
- User profiles and authentication
- Post creation (text, images, videos)
- News feed with algorithmic sorting
- Stories (24-hour ephemeral content)
- Like, comment, and share functionality
- Real-time notifications
- Direct messaging
- Hashtags and mentions

## Infrastructure
- Frontend: Next.js with TypeScript
- Backend: Node.js with Express
- Database: MongoDB for posts, PostgreSQL for users
- File storage: AWS S3
- CDN: CloudFront
- Search: Elasticsearch`,
    languages: ['TypeScript', 'Next.js', 'Node.js', 'MongoDB', 'AWS'],
    githubUrl: 'https://github.com/example/social-media'
  },
  
  // Kernel Hacking Projects
  { 
    id: '11', 
    name: 'Custom File System', 
    category: 'Kernel Hacking', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Custom file system implementation for Linux kernel with journaling support.',
    readme: `# Custom File System Module

## Description
A custom file system implementation for the Linux kernel, featuring journaling and advanced caching mechanisms.

## Features
- Block-based storage
- Journaling for crash recovery
- Extended attributes support
- Directory indexing
- B-tree based organization
- Support for large files (>2TB)

## Implementation
Written in C for the Linux kernel. Implements VFS (Virtual File System) interface with custom inode and block management.

## Performance
- 30% faster sequential read performance
- 15% improvement in random write operations
- Reduced fragmentation through smart allocation`,
    languages: ['C', 'Linux Kernel', 'Assembly'],
    githubUrl: 'https://github.com/example/custom-fs'
  },
  { 
    id: '12', 
    name: 'Device Driver Development', 
    category: 'Kernel Hacking', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Linux device drivers for custom hardware peripherals with DMA support.',
    readme: `# Linux Device Driver

## Overview
A collection of Linux device drivers for custom hardware peripherals.

## Drivers Included
- Character device driver for sensor data
- Block device driver for storage controller
- Network device driver for custom NIC
- USB device driver for proprietary hardware

## Features
- DMA (Direct Memory Access) support
- Interrupt handling
- Power management
- Hotplug support
- Sysfs integration

## Development Environment
- Linux kernel 5.15
- Built and tested on x86_64 and ARM platforms
- Follows Linux kernel coding standards`,
    languages: ['C', 'Linux Kernel', 'Assembly', 'Bash'],
    githubUrl: 'https://github.com/example/device-drivers'
  },
  { 
    id: '13', 
    name: 'Memory Management', 
    category: 'Kernel Hacking', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Custom memory allocator with improved performance for specific workloads.',
    readme: `# Custom Memory Allocator

## Description
A custom memory management system optimized for high-performance computing workloads.

## Features
- Slab allocator implementation
- Memory pooling
- NUMA-aware allocation
- Transparent huge pages support
- Memory defragmentation
- Low-latency allocation for real-time systems

## Performance Benefits
- 40% reduction in allocation latency
- Better cache utilization
- Reduced memory fragmentation
- Lower overhead compared to standard allocators

## Use Cases
Optimized for scientific computing, real-time systems, and high-frequency trading applications.`,
    languages: ['C', 'Linux Kernel', 'Assembly'],
    githubUrl: 'https://github.com/example/memory-manager'
  },
  
  // DB Projects
  { 
    id: '14', 
    name: 'Database Optimizer', 
    category: 'DB', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Query optimizer for PostgreSQL with cost-based optimization and plan caching.',
    readme: `# Database Query Optimizer

## Overview
An advanced query optimizer extension for PostgreSQL that improves query execution performance.

## Features
- Cost-based query optimization
- Query plan caching
- Index recommendation engine
- Statistics collection and analysis
- Parallel query execution
- Adaptive query processing

## Optimization Techniques
- Join reordering
- Predicate pushdown
- Materialized view matching
- Partition pruning
- Index selection

## Performance Impact
- 50% reduction in query execution time on average
- 70% improvement for complex joins
- Automatic index suggestions reduce manual tuning`,
    languages: ['C', 'SQL', 'PostgreSQL', 'Python'],
    githubUrl: 'https://github.com/example/db-optimizer'
  },
  { 
    id: '15', 
    name: 'Query Engine', 
    category: 'DB', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Custom SQL query engine with vectorized execution and columnar storage.',
    readme: `# High-Performance Query Engine

## Description
A from-scratch implementation of a SQL query engine with modern optimization techniques.

## Architecture
- Columnar storage format
- Vectorized execution engine
- LLVM-based JIT compilation
- Multi-threaded query execution
- Memory-efficient operators

## Features
- Full SQL support (SELECT, JOIN, GROUP BY, etc.)
- ACID transactions
- Query caching
- Adaptive execution
- Cost-based optimization

## Performance
Benchmarked against PostgreSQL and MySQL, showing 3-5x improvement on analytical workloads.`,
    languages: ['C++', 'SQL', 'LLVM', 'Python'],
    githubUrl: 'https://github.com/example/query-engine'
  },
  { 
    id: '16', 
    name: 'Distributed Database', 
    category: 'DB', 
    thumbnail: '/projects.png', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Distributed database system with consensus protocol and automatic sharding.',
    readme: `# Distributed Database System

## Overview
A distributed database system designed for high availability and horizontal scalability.

## Key Features
- Raft consensus protocol for replication
- Automatic sharding and rebalancing
- Multi-datacenter support
- Strong consistency guarantees
- Distributed transactions
- Fault tolerance

## Architecture
- Master-slave replication
- Hash-based sharding
- Distributed query execution
- Write-ahead logging
- Snapshot isolation

## Scalability
- Tested with 100+ nodes
- Handles 100,000+ TPS
- Sub-millisecond latency for point queries
- Linear scalability for most workloads`,
    languages: ['Go', 'Protocol Buffers', 'gRPC', 'SQL'],
    githubUrl: 'https://github.com/example/distributed-db'
  },
];

// View mode types
type ViewMode = 'small' | 'medium' | 'big' | 'gallery';

// Search button with expandable input
function SearchButton({ searchQuery, onSearchChange }: { 
  searchQuery: string; 
  onSearchChange: (query: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (isExpanded && !searchQuery) {
          setIsExpanded(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, searchQuery]);
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  
  const handleClose = () => {
    onSearchChange('');
    setIsExpanded(false);
  };
  
  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center">
        {/* Search input - expands from right to left */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects..."
          className={`
            font-mono text-sm text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-l px-3 py-1
            focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out
            ${isExpanded ? 'w-48 opacity-100' : 'w-0 opacity-0 px-0 border-0'}
          `}
          style={{ 
            transitionProperty: 'width, opacity, padding, border-width'
          }}
        />
        
        {/* Close button (X icon) - only visible when expanded and has content */}
        {isExpanded && searchQuery && (
          <button
            onClick={handleClose}
            className="p-1 bg-zinc-800 border-y border-zinc-700 hover:bg-zinc-700 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} className="text-zinc-400" />
          </button>
        )}
        
        {/* Search icon button */}
        <button
          onClick={() => {
            if (isExpanded && !searchQuery) {
              setIsExpanded(false);
            } else {
              setIsExpanded(true);
            }
          }}
          className={`p-1 hover:bg-zinc-700 transition-colors ${
            isExpanded ? 'bg-zinc-800 border border-zinc-700 border-l-0 rounded-r' : 'rounded'
          }`}
          aria-label="Search"
        >
          <Search size={18} className="text-zinc-300" />
        </button>
      </div>
    </div>
  );
}

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
        className="p-1 hover:bg-zinc-700 rounded transition-colors"
        aria-label="Change view"
      >
        {/* 4-square grid icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-zinc-300">
          <rect x="4" y="4" width="7" height="7" fill="currentColor" />
          <rect x="13" y="4" width="7" height="7" fill="currentColor" />
          <rect x="4" y="13" width="7" height="7" fill="currentColor" />
          <rect x="13" y="13" width="7" height="7" fill="currentColor" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-50 min-w-[10rem]">
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
function VideoThumbnail({ project, onClick, onDoubleClick, size = 'small' }: { 
  project: Project; 
  onClick: () => void;
  onDoubleClick: () => void;
  size?: 'small' | 'medium' | 'big';
}) {
  const sizes = {
    small: { w: 96, h: 72, imgW: 96, imgH: 72, playSize: 'w-6 h-6', textSize: 'text-xs', maxW: 'max-w-24' },
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
        className="relative rounded-sm overflow-hidden bg-zinc-800 transition-colors"
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
        <div className="absolute inset-0 rounded-sm flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
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
    <div className=" bg-[#1e1e1e]/80 backdrop-blur-xl h-screen p-3 flex flex-col gap-0.5 border-r border-black/20">
      <div className="px-2 pb-2 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Favorites</div>
      {categories.map(({ name, icon: Icon }) => {
        const isActive = selectedCategory === name;
        return (
          <div
            key={name}
            className={`px-2 py-1.25 rounded-md flex items-center cursor-default transition-colors group ${
              isActive 
                ? 'bg-zinc-700/60' 
                : 'hover:bg-zinc-700/40'
            }`}
            onClick={() => onSelectCategory(name)}
          >
            <Icon 
              size={18} 
              strokeWidth={1.5}
              className={`mr-3 ${isActive ? 'text-blue-500' : 'text-blue-500/90'}`} 
            /> 
            <span className={`text-[13px] font-sans ${isActive ? 'text-white' : 'text-zinc-300'}`}>
              {name}
            </span>
          </div>
        );
      })}
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
                className={`cursor-pointer group p-3 rounded transition-colors ${
                  selectedProject?.id === project.id ? 'bg-blue-500/20 border border-blue-500' : 'hover:bg-zinc-700/30'
                }`}
                onClick={() => onThumbnailClick(project)}
                onDoubleClick={() => onThumbnailDoubleClick(project)}
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-28 h-20 rounded overflow-hidden bg-zinc-800 border border-zinc-700 flex-shrink-0">
                    <Image
                      src={project.thumbnail}
                      alt={project.name}
                      width={112}
                      height={80}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-6 h-6 text-white" fill="white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono font-semibold text-zinc-200 mb-1">{project.name}</div>
                    <div className="text-xs font-mono text-zinc-400 mb-2 line-clamp-2">{project.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {project.languages.slice(0, 3).map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-mono rounded border border-blue-500/30"
                        >
                          {lang}
                        </span>
                      ))}
                      {project.languages.length > 3 && (
                        <span className="px-2 py-0.5 bg-zinc-700/50 text-zinc-400 text-[10px] font-mono rounded">
                          +{project.languages.length - 3}
                        </span>
                      )}
                    </div>
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
  let iconSize: 'small' | 'medium' | 'big' = 'small';
  if (viewMode === 'small' || viewMode === 'medium' || viewMode === 'big') {
    iconSize = viewMode;
  }
  
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
  const [browserOpen, setBrowserOpen] = useState(false);
  const [selectedProjectForBrowser, setSelectedProjectForBrowser] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Robotics');
  const [viewMode, setViewMode] = useState<ViewMode>('small');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter projects by search query (across all categories) or by selected category
  const filteredProjects = PROJECTS_DATA.filter(p => {
    // If there's a search query, search across all categories
    if (searchQuery !== '') {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    // Otherwise, filter by selected category only
    return p.category === selectedCategory;
  });
  
  const handleThumbnailClick = (project: Project) => {
    // Single click in gallery view - just select for preview
    // In other views - open the video modal
    if (viewMode === 'gallery') {
      setSelectedProject(project);
    } else {
      handleThumbnailDoubleClick(project);
    }
  };
  
  const handleThumbnailDoubleClick = (project: Project) => {
    // Double click opens browser modal with project details
    setSelectedProjectForBrowser(project);
    setBrowserOpen(true);
  };
  
  return (
    <>
      <div className="w-full h-full flex flex-col">
        {/* Top bar with search and view buttons - matches sidebar styling */}
        <div className="bg-surface-primary/95 backdrop-blur-2xl px-4 py-1 z-10 flex justify-end items-center gap-2">
          <SearchButton searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <ViewButton currentView={viewMode} onViewChange={setViewMode} />
        </div>
                
        <div className="grid grid-cols-[1fr_5fr] flex-1 w-full overflow-hidden">
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
      
      {/* Project Browser Modal */}
      {browserOpen && selectedProjectForBrowser && (
        <Modal 
          onClose={() => {
            setBrowserOpen(false);
            setSelectedProjectForBrowser(null);
          }}
          onMinimize={() => {}}
          onMaximize={() => {}}
          isMaximized={true}
          size="large"
          startMaximized={true}
        >
          <ProjectBrowser project={selectedProjectForBrowser as ProjectDetails} />
        </Modal>
      )}
    </>
  );
}
