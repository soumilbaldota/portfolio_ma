"use client";
import React, { createContext, useContext, ReactNode } from 'react';

interface AccentColorContextType {
  accentColor: string;
  accentColorHover: string;
  accentColorLight: string;
  accentColorBorder: string;
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

export function AccentColorProvider({ children }: { children: ReactNode }) {
  // Using the blue accent color from globals.css
  const accentColor = '#3b82f6'; // --accent-primary
  const accentColorHover = '#2563eb'; // Darker blue for hover
  const accentColorLight = 'rgba(59, 130, 246, 0.2)'; // Light blue with transparency
  const accentColorBorder = 'rgba(59, 130, 246, 0.3)'; // Border blue with transparency

  return (
    <AccentColorContext.Provider 
      value={{ 
        accentColor, 
        accentColorHover, 
        accentColorLight, 
        accentColorBorder 
      }}
    >
      {children}
    </AccentColorContext.Provider>
  );
}

export function useAccentColor() {
  const context = useContext(AccentColorContext);
  if (context === undefined) {
    throw new Error('useAccentColor must be used within an AccentColorProvider');
  }
  return context;
}
