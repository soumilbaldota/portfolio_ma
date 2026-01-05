"use client";
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';
export type AccentColorOption = 'blue' | 'purple' | 'green' | 'orange' | 'pink';

interface AccentColorContextType {
  accentColor: string;
  accentColorHover: string;
  accentColorLight: string;
  accentColorBorder: string;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  accentColorName: AccentColorOption;
  setAccentColorName: (color: AccentColorOption) => void;
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

// Accent color definitions
const ACCENT_COLORS: Record<AccentColorOption, { base: string; hover: string }> = {
  blue: { base: '#3b82f6', hover: '#2563eb' },
  purple: { base: '#a855f7', hover: '#9333ea' },
  green: { base: '#10b981', hover: '#059669' },
  orange: { base: '#f59e0b', hover: '#d97706' },
  pink: { base: '#ec4899', hover: '#db2777' },
};

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function AccentColorProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [accentColorName, setAccentColorName] = useState<AccentColorOption>('blue');

  // Load theme and accent color from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
      const savedColor = localStorage.getItem('accentColor') as AccentColorOption | null;
      
      if (savedTheme) {
        setThemeState(savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeState(prefersDark ? 'dark' : 'light');
      }
      
      if (savedColor) {
        setAccentColorName(savedColor);
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      }
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  const setAccentColor = (color: AccentColorOption) => {
    setAccentColorName(color);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accentColor', color);
    }
  };

  const colorConfig = ACCENT_COLORS[accentColorName];
  const accentColor = colorConfig.base;
  const accentColorHover = colorConfig.hover;
  const accentColorLight = hexToRgba(accentColor, 0.2);
  const accentColorBorder = hexToRgba(accentColor, 0.3);

  return (
    <AccentColorContext.Provider 
      value={{ 
        accentColor, 
        accentColorHover, 
        accentColorLight, 
        accentColorBorder,
        theme,
        setTheme,
        accentColorName,
        setAccentColorName: setAccentColor,
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
