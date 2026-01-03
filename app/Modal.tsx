import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";

function TrafficLight({ color, onClick }: { color: string; onClick?: () => void }) {
  return (
    <div
      className={`h-3 w-3 rounded-full ${color} m-1 flex items-center justify-center cursor-pointer group`}
      onClick={onClick}
    >
      <div className="bg-foreground/10 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function ModalHeader({ 
  onClose, 
  onMinimize,
  onMaximize,
  onMouseDown, 
  isDragging 
}: { 
  onClose: () => void; 
  onMinimize: () => void;
  onMaximize: () => void;
  onMouseDown: (e: React.MouseEvent) => void; 
  isDragging: boolean 
}) {
  return (
    <div 
      className={`h-8 w-200 bg-surface-primary/95 rounded-t-sm flex items-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={onMouseDown}
    >
      <TrafficLight color="bg-red-500" onClick={onClose} />
      <TrafficLight color="bg-yellow-500" onClick={onMinimize} />
      <TrafficLight color="bg-green-500" onClick={onMaximize} />
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent dragging when maximized
    if (isMaximized) return;
    
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
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
  }, [isDragging, dragOffset, isMaximized]);

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
                }
              : {}
          }
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader 
            onClose={onClose} 
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
            onMouseDown={handleMouseDown} 
            isDragging={isDragging} 
          />
          {children}
        </div>

      </div>
    </div>
    ,
    document.body
  );
}