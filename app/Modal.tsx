import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";

function TrafficLight({ color, onClick, icon }: { color: string; onClick?: (e: React.MouseEvent) => void; icon: 'close' | 'minimize' | 'maximize' }) {
  return (
    <div
      className={`h-3 w-3 rounded-full ${color} m-1 flex items-center justify-center cursor-pointer`}
      onClick={onClick}
    >
      {/* Icon appears on hover */}
      {icon === 'close' && (
        <svg className="w-2 h-2 opacity-0 group-hover:opacity-60 transition-opacity" viewBox="0 0 10 10" fill="none">
          <path d="M1 1L9 9M9 1L1 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {icon === 'minimize' && (
        <svg className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" viewBox="0 0 10 10" fill="none">
          <path d="M2 5H8" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {icon === 'maximize' && (
        <svg
          className="w-6 h-6 opacity-0 group-hover:opacity-60 transition-opacity duration-120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="50" fill="#4ade80" />

          <path
            d="M30 22 H70 L30 62 V22Z"
            fill="#1d1d1f"
          />

          <path
            d="M70 78 H30 L70 38 V78Z"
            fill="#1d1d1f"
          />
        </svg>


      )}

    </div>
  );
}

function ModalHeader({
  onClose,
  onMinimize,
  onMaximize,
  onMouseDown,
  isDragging,
  isMaximized,
  title,
}: {
  onClose: () => void;
  onMinimize: (e: React.MouseEvent) => void;
  onMaximize: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging: boolean;
  isMaximized: boolean;
  title?: string;
}) {
  return (
    <div
      className={`h-8 ${isMaximized ? 'w-full' : ''} bg-surface-primary/95 rounded-t-sm flex items-center pl-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={onMouseDown}
    >
      <div className="group flex">
        <TrafficLight color="bg-red-400" onClick={(e) => { e.stopPropagation(); onClose(); }} icon="close" />
        <TrafficLight color="bg-yellow-400" onClick={onMinimize} icon="minimize" />
        <TrafficLight color="bg-green-500" onClick={onMaximize} icon="maximize" />
      </div>
      {title && (
        <div className="flex-1 text-center text-sm font-medium text-zinc-700 dark:text-zinc-300 pr-16">
          {title}
        </div>
      )}
    </div>
  );
}
export function Modal({
  children,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  size = "medium",
  startMaximized = false,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  size?: "small" | "medium" | "large";
  startMaximized?: boolean;
  title?: string;
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(startMaximized);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, mouseX: 0, mouseY: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 800, height: 600 }); // Default fallback for SSR
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Update viewport size on mount and window resize
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Set initial size
    updateViewportSize();
    
    // Listen for window resize
    window.addEventListener('resize', updateViewportSize);
    
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);
  
  // Size configurations (viewport percentage based)
  const sizeConfig = {
    small: { width: viewportSize.width * 0.5, height: viewportSize.height * 0.5 },
    medium: { width: viewportSize.width * 0.7, height: viewportSize.height * 0.7 },
    large: { width: viewportSize.width * 0.9, height: viewportSize.height * 0.9 },
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent dragging when maximized
    if (isMaximized) return;

    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();

      // If modal hasn't been positioned yet (centered), convert to absolute positioning
      if (position === null) {
        setPosition({
          x: rect.left,
          y: rect.top,
        });
      }

      // Store where the drag started relative to the modal
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    // Prevent resizing when maximized
    if (isMaximized) return;
    
    e.stopPropagation(); // Prevent triggering drag
    
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      
      // Use current dimensions or rect for resize start
      const currentWidth = dimensions?.width || rect.width;
      const currentHeight = dimensions?.height || rect.height;
      
      // Initialize dimensions if not set
      if (dimensions === null) {
        setDimensions({
          width: currentWidth,
          height: currentHeight,
        });
      }
      
      setResizeStart({
        width: currentWidth,
        height: currentHeight,
        mouseX: e.clientX,
        mouseY: e.clientY,
      });
      setIsResizing(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && modalRef.current && position !== null && !isMaximized) {
        // Calculate new position based on mouse position and drag offset
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Use transform for smooth dragging without re-renders
        const deltaX = newX - position.x;
        const deltaY = newY - position.y;
        modalRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }
      
      if (isResizing && modalRef.current && !isMaximized) {
        // Calculate new dimensions based on mouse movement
        const deltaX = e.clientX - resizeStart.mouseX;
        const deltaY = e.clientY - resizeStart.mouseY;
        
        const newWidth = Math.max(300, resizeStart.width + deltaX); // Min width 300px
        const newHeight = Math.max(200, resizeStart.height + deltaY); // Min height 200px
        
        setDimensions({
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && modalRef.current && position !== null && !isMaximized) {
        // Calculate final position
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Reset transform and update position state
        modalRef.current.style.transform = '';
        setPosition({
          x: newX,
          y: newY,
        });
      }
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, position, isMaximized, resizeStart, dimensions]);
  
  // Handle expand animation for startMaximized
  useEffect(() => {
    if (startMaximized) {
      // Start animation after a short delay
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [startMaximized]);

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMinimize();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Reset position and dimensions when maximizing
    if (!isMaximized) {
      setPosition(null);
      setDimensions(null);
    }
    onMaximize();
  };

  const { width: defaultWidth, height: defaultHeight } = sizeConfig[size];
  const transitionClass = (isDragging || isResizing) ? 'transition-none' : 'transition-all duration-300';
  const modalClassName = `m-0 p-0 rounded-sm backdrop-blur-2xl bg-surface-primary/30 ${transitionClass} ${
    isMaximized || (startMaximized && !isAnimating)
      ? 'w-screen h-screen'
      : ''
  }`;
  
  // Calculate actual dimensions
  const actualWidth = dimensions?.width || defaultWidth;
  const actualHeight = dimensions?.height || defaultHeight;

  return createPortal(
    <div className='fixed inset-0 z-50 pointer-events-none' onClick={onClose}>
      <div 
        className={`pointer-events-none ${!isMaximized && position === null ? 'flex justify-center items-center h-full' : ''}`}
      >

        <div
          ref={modalRef}
          className={`${modalClassName} pointer-events-auto relative`}
          style={
            isMaximized || (startMaximized && !isAnimating)
              ? {
                willChange: (isDragging || isResizing) ? 'transform' : 'auto',
              }
              : !isMaximized && position !== null
              ? {
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${actualWidth}px`,
                height: `${actualHeight}px`,
                willChange: (isDragging || isResizing) ? 'transform' : 'auto',
              }
              : {
                width: isAnimating ? '160px' : `${actualWidth}px`,
                height: isAnimating ? '120px' : `${actualHeight}px`,
                willChange: (isDragging || isResizing) ? 'transform' : 'auto',
              }
          }
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader
            onClose={onClose}
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
            onMouseDown={handleMouseDown}
            isDragging={isDragging}
            isMaximized={isMaximized}
            title={title}
          />
          <div className="h-[calc(100%-2rem)]" style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
            {children}
          </div>
          
          {/* Resize handle - only show when not maximized */}
          {!isMaximized && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize group"
              onMouseDown={handleResizeMouseDown}
              style={{ touchAction: 'none' }}
            >
              {/* Visual indicator for resize handle */}
              <div className="absolute bottom-0.5 right-0.5 w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full">
                  <path d="M11 1L1 11M11 5L5 11M11 9L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-600 dark:text-zinc-400" />
                </svg>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
    ,
    document.body
  );
}