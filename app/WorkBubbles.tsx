"use client";
import Image from 'next/image';
import { useAccentColor } from './AccentColorContext';
import { useState } from 'react';

export function WorkBubbles({
  onClick = () => {},
  showMinimizedIndicator = false,
}: {
  onClick?: () => void;
  showMinimizedIndicator?: boolean;
}) {
  const { accentColor } = useAccentColor();
  const accentSecondary = '#0ea5e9'; // sky-500
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate scale factors for each bubble based on rotation
  // Positions: top-left (size 12), top-right (size 10), bottom (size 8)
  const getMaximlScale = () => {
    const angle = rotation % 360;
    if (angle === 0) return 1;        // At top-left (12)
    if (angle === 120) return 10/12;  // Moving to top-right (10)
    if (angle === 240) return 8/12;   // Moving to bottom (8)
    return 1;
  };

  const getSamsungScale = () => {
    const angle = rotation % 360;
    if (angle === 0) return 1;        // At top-right (10)
    if (angle === 120) return 8/10;   // Moving to bottom (8)
    if (angle === 240) return 12/10;  // Moving to top-left (12)
    return 1;
  };

  const getGSoCScale = () => {
    const angle = rotation % 360;
    if (angle === 0) return 1;        // At bottom (8)
    if (angle === 120) return 12/8;   // Moving to top-left (12)
    if (angle === 240) return 10/8;   // Moving to top-right (10)
    return 1;
  };

  const handleClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setRotation(prev => prev + 120);
    
    // Open modal after animation completes (100ms)
    setTimeout(() => {
      setIsAnimating(false);
      onClick();
    }, 100);
  };
  
  return (
    <div 
      className="rounded-2xl cursor-pointer transition-colors bg-transparent hover:bg-surface-secondary/80" 
      onClick={handleClick}
    >
      <div className="relative m-5 mt-8 px-3.5">
        <div className="flex flex-col items-center">
          {/* Main bubble container */}
          <div 
            className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl mb-2 z-10 overflow-hidden"
            style={{ backgroundColor: accentSecondary }}
          >
            {/* Rotating container for the bubbles */}
            <div 
              className="absolute inset-0"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 100ms cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            >
            {/* Large bubble - Maximl */}
            <div 
              className="absolute top-4 left-5 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-2"
              style={{ 
                borderColor: accentColor,
                transform: `rotate(-${rotation}deg) scale(${getMaximlScale()})`,
                transition: 'transform 100ms cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            >
              <Image
                src="/logos/maximl.png"
                alt="Maximl"
                width={38}
                height={38}
                className="object-contain p-1"
              />
            </div>

            {/* Medium bubble - Samsung */}
            <div 
              className="absolute top-3 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2"
              style={{ 
                borderColor: accentColor,
                transform: `rotate(-${rotation}deg) scale(${getSamsungScale()})`,
                transition: 'transform 100ms cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            >
              <Image
                src="/logos/samsung.png"
                alt="Samsung"
                width={30}
                height={30}
                className="object-contain p-0.5"
              />
            </div>

            {/* Small bubble - CERN/GSoC */}
            <div 
              className="absolute bottom-4 right-8 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2"
              style={{ 
                borderColor: accentColor,
                transform: `rotate(-${rotation}deg) scale(${getGSoCScale()})`,
                transition: 'transform 100ms cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            >
              <Image
                src="/logos/gsoc.png"
                alt="Google Summer of Code"
                width={24}
                height={24}
                className="object-contain p-0.5"
              />
            </div>
          </div>
          </div>

          <div className="text-xl font-mono text-center">Work</div>
          
          {/* Minimized indicator */}
          {showMinimizedIndicator && (
            <div 
              className="w-2 h-2 rounded-full bg-yellow-500 mt-1" 
              role="status"
              aria-label="Window is minimized"
            />
          )}
        </div>
      </div>
    </div>
  );
}
