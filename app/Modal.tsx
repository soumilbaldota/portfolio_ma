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
  size = "medium",
  title,
}: {
  onClose: () => void;
  onMinimize: (e: React.MouseEvent) => void;
  onMaximize: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging: boolean;
  isMaximized: boolean;
  size?: "small" | "medium" | "large";
  title?: string;
}) {
  const sizeConfig = {
    small: 'w-150',
    medium: 'w-200',
    large: 'w-250',
  };
  
  return (
    <div
      className={`h-8 ${isMaximized ? 'w-full' : sizeConfig[size]} bg-surface-primary/95 rounded-t-sm flex items-center pl-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Size configurations
  const sizeConfig = {
    small: { width: 'w-150', height: 'h-80' },
    medium: { width: 'w-200', height: 'h-100' },
    large: { width: 'w-250', height: 'h-125' },
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
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position, isMaximized]);
  
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
    // Reset position when maximizing
    if (!isMaximized) {
      setPosition(null);
    }
    onMaximize();
  };

  const { width, height } = sizeConfig[size];
  const modalClassName = `m-0 p-0 rounded-sm backdrop-blur-2xl bg-surface-primary/30 transition-all duration-300 ${
    isMaximized || (startMaximized && !isAnimating)
      ? 'w-screen h-screen'
      : isAnimating
      ? 'w-40 h-30'
      : `${width} ${height}`
  }`;

  return createPortal(
    <div className='fixed inset-0 z-50 pointer-events-none' onClick={onClose}>
      <div 
        className={`pointer-events-none ${!isMaximized && position === null ? 'flex justify-center items-center h-full' : ''}`}
      >

        <div
          ref={modalRef}
          className={`${modalClassName} pointer-events-auto`}
          style={
            !isMaximized && position !== null
              ? {
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                willChange: isDragging ? 'transform' : 'auto',
              }
              : {
                willChange: isDragging ? 'transform' : 'auto',
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
            size={size}
            title={title}
          />
          <div className="h-[calc(100%-2rem)]" style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
            {children}
          </div>
        </div>

      </div>
    </div>
    ,
    document.body
  );
}