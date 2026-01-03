import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";

function TrafficLight({ color, onClick, icon }: { color: string; onClick?: (e: React.MouseEvent) => void; icon: 'close' | 'minimize' | 'maximize' }) {
  return (
    <div
      className={`h-3 w-3 rounded-full ${color} m-1 flex items-center justify-center cursor-pointer group`}
      onClick={onClick}
    >
      {/* Icon appears on hover */}
      {icon === 'close' && (
        <svg className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10" fill="none">
          <path d="M1 1L9 9M9 1L1 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {icon === 'minimize' && (
        <svg className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10" fill="none">
          <path d="M2 5H8" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {icon === 'maximize' && (
        <svg className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10" fill="none">
          <path d="M1 2L5 5L1 8M9 2L5 5L9 8" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  isMaximized
}: { 
  onClose: () => void; 
  onMinimize: (e: React.MouseEvent) => void;
  onMaximize: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void; 
  isDragging: boolean;
  isMaximized: boolean;
}) {
  return (
    <div 
      className={`h-8 ${isMaximized ? 'w-full' : 'w-200'} bg-surface-primary/95 rounded-t-sm flex items-center pl-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={onMouseDown}
    >
      <TrafficLight color="bg-red-500" onClick={(e) => { e.stopPropagation(); onClose(); }} icon="close" />
      <TrafficLight color="bg-yellow-500" onClick={onMinimize} icon="minimize" />
      <TrafficLight color="bg-green-500" onClick={onMaximize} icon="maximize" />
    </div>
  );
}
export function Modal({ 
  children, 
  onClose, 
  onMinimize, 
  onMaximize, 
  isMaximized 
}: { 
  children: React.ReactNode; 
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Reset position when maximizing
  useEffect(() => {
    if (isMaximized) {
      setPosition(null);
    }
  }, [isMaximized]);

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMinimize();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMaximize();
  };

  const modalClassName = `m-0 p-0 rounded-sm backdrop-blur-2xl bg-surface-primary/30 ${
    isMaximized ? 'w-screen h-screen' : 'w-200 h-100'
  }`;

  return createPortal(
    <div className='fixed inset-0 z-50' onClick={onClose}>
      <div className={!isMaximized && position === null ? 'flex justify-center items-center h-full' : ''}>

        <div
          ref={modalRef}
          className={modalClassName}
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