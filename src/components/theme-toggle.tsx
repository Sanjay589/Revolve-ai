'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

export type ThemeMode = 'dark' | 'light' | 'system';

export const ThemeToggle: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  const applyTheme = (targetMode: ThemeMode) => {
    let effective: 'dark' | 'light' = 'dark';
    if (targetMode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effective = isDark ? 'dark' : 'light';
    } else {
      effective = targetMode;
    }
    setResolvedTheme(effective);
    document.documentElement.setAttribute('data-theme', effective);
  };

  useEffect(() => {
    const saved = localStorage.getItem('revolve_theme') as ThemeMode | null;
    const initialMode: ThemeMode = saved || 'dark';
    setMode(initialMode);
    applyTheme(initialMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentSaved = localStorage.getItem('revolve_theme') as ThemeMode | null;
      if (currentSaved === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const cycleTheme = () => {
    let nextMode: ThemeMode = 'dark';
    if (mode === 'dark') nextMode = 'light';
    else if (mode === 'light') nextMode = 'system';
    else if (mode === 'system') nextMode = 'dark';

    setMode(nextMode);
    localStorage.setItem('revolve_theme', nextMode);
    applyTheme(nextMode);
  };

  const getLabel = () => {
    if (mode === 'dark') return 'Theme: Dark (click for Light)';
    if (mode === 'light') return 'Theme: Light (click for System)';
    return `Theme: System (${resolvedTheme}) (click for Dark)`;
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="btn btn-ghost btn-icon relative group"
      aria-label={getLabel()}
      title={getLabel()}
    >
      {mode === 'dark' && <Moon size={17} />}
      {mode === 'light' && <Sun size={17} />}
      {mode === 'system' && <Laptop size={17} />}

      {/* Tiny mode indicator dot */}
      <span
        className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ${
          mode === 'system'
            ? 'bg-[#818CF8]'
            : mode === 'light'
            ? 'bg-[#F59E0B]'
            : 'bg-[#00C076]'
        }`}
      />
    </button>
  );
};
