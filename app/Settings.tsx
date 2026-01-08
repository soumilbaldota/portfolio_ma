"use client";
import { useState } from 'react';
import { Palette, Sun, Moon } from 'lucide-react';
import { useAccentColor, type ThemeMode, type AccentColorOption } from './AccentColorContext';

// Sidebar with settings categories
function SettingsSidebar({ selectedCategory, onSelectCategory }: { 
  selectedCategory: string; 
  onSelectCategory: (category: string) => void;
}) {
  const { accentColor, accentColorLight } = useAccentColor();
  const categories = [
    { name: 'Appearance', icon: Palette },
  ];
  
  return (
    <div className="bg-surface-primary/95 backdrop-blur-xl h-full p-3 flex flex-col gap-0.5 border-r border-divider">
      <div className="px-2 pb-2 text-[11px] font-bold text-text-muted uppercase tracking-wider">Settings</div>
      {categories.map(({ name, icon: Icon }) => {
        const isActive = selectedCategory === name;
        return (
          <div
            key={name}
            className="px-2 py-1.25 rounded-md flex items-center cursor-pointer transition-colors group hover:bg-surface-tertiary"
            style={{
              backgroundColor: isActive ? accentColorLight : 'transparent'
            }}
            onClick={() => onSelectCategory(name)}
          >
            <Icon 
              size={18} 
              strokeWidth={1.5}
              style={{ color: accentColor }}
              className="mr-3"
            /> 
            <span className={`text-[13px] font-sans ${isActive ? 'text-text-emphasis' : 'text-text-primary'}`}>
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Appearance settings panel
function AppearanceSettings() {
  const { theme, setTheme, accentColorName, setAccentColorName, accentColor, accentColorLight } = useAccentColor();
  
  const accentColorOptions: { name: AccentColorOption; color: string; label: string }[] = [
    { name: 'blue', color: '#3b82f6', label: 'Blue' },
    { name: 'purple', color: '#a855f7', label: 'Purple' },
    { name: 'green', color: '#10b981', label: 'Green' },
    { name: 'orange', color: '#f59e0b', label: 'Orange' },
    { name: 'pink', color: '#ec4899', label: 'Pink' },
  ];

  return (
    <div className="h-full overflow-auto p-6 bg-surface-secondary/30">
      <div className="max-w-2xl">
        {/* Theme Mode Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-text-emphasis mb-4">Theme Mode</h2>
          <p className="text-sm text-text-muted mb-4">Select your preferred theme mode</p>
          
          <div className="flex gap-3">
            {/* Light Mode Button */}
            <button
              onClick={() => setTheme('light')}
              className="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border transition-all"
              style={{
                borderColor: theme === 'light' ? accentColor : 'var(--border-color)',
                backgroundColor: theme === 'light' ? accentColorLight : 'var(--surface-primary)',
              }}
            >
              <Sun 
                size={24} 
                style={{ color: theme === 'light' ? accentColor : 'var(--text-muted)' }}
              />
              <span className="text-sm font-medium text-text-primary">Light</span>
            </button>
            
            {/* Dark Mode Button */}
            <button
              onClick={() => setTheme('dark')}
              className="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border transition-all"
              style={{
                borderColor: theme === 'dark' ? accentColor : 'var(--border-color)',
                backgroundColor: theme === 'dark' ? accentColorLight : 'var(--surface-primary)',
              }}
            >
              <Moon 
                size={24} 
                style={{ color: theme === 'dark' ? accentColor : 'var(--text-muted)' }}
              />
              <span className="text-sm font-medium text-text-primary">Dark</span>
            </button>
          </div>
        </div>

        {/* Accent Color Section */}
        <div>
          <h2 className="text-lg font-semibold text-text-emphasis mb-4">Accent Color</h2>
          <p className="text-sm text-text-muted mb-4">Choose your preferred accent color</p>
          
          <div className="grid grid-cols-5 gap-3">
            {accentColorOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => setAccentColorName(option.name)}
                className="flex items-center justify-center p-2 rounded-lg border transition-all hover:bg-surface-tertiary"
                style={{
                  borderColor: accentColorName === option.name ? accentColor : 'var(--border-color)',
                }}
                aria-label={option.label}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Settings component
export function Settings() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Appearance');
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="grid grid-cols-[1fr_5fr] flex-1 w-full h-full overflow-hidden">
        <SettingsSidebar 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        {selectedCategory === 'Appearance' && <AppearanceSettings />}
      </div>
    </div>
  );
}
