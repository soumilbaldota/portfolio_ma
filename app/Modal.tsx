import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";

function TrafficLight({ color, onClick }: { color: string; onClick?: () => void }) {
  return (
    <div
      className={`h-3 w-3 rounded-full ${color} m-1 flex items-center justify-center cursor-pointer group`}
      onClick={onClick}
    >
      <div className="bg-white w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function ModalHeader({ onClose, onMouseDown, isDragging }: { onClose: () => void; onMouseDown: (e: React.MouseEvent) => void; isDragging: boolean }) {
  return (
    <div 
      className={`h-8 w-200 bg-zinc-800/95 rounded-t-sm flex items-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={onMouseDown}
    >
      <TrafficLight color="bg-red-500" onClick={onClose} />
      <TrafficLight color="bg-yellow-500" />
      <TrafficLight color="bg-green-500" />
    </div>
  );
}
export function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
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
      if (isDragging) {
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
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return createPortal(
    <div className='fixed inset-0 flex justify-center items-center z-50' onClick={onClose}>
      <div>

        <div
          ref={modalRef}
          className="m-0 p-0 rounded-sm w-200 h-100 backdrop-blur-2xl bg-zinc-800/30 border-0 border-black absolute"
          style={{
            left: position.x !== 0 ? `${position.x}px` : '50%',
            top: position.y !== 0 ? `${position.y}px` : '50%',
            transform: position.x === 0 && position.y === 0 ? 'translate(-50%, -50%)' : 'none',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader onClose={onClose} onMouseDown={handleMouseDown} isDragging={isDragging} />
          {children}
        </div>

      </div>
    </div>
    ,
    document.body
  );
}