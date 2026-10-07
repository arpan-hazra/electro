// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ACCENT_COLORS = {
  purple: {
    id: 'purple',
    name: 'Electric Violet',
    primary: '#8B5CF6',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    ring: 'focus:ring-purple-400',
    btnBg: 'bg-purple-600 hover:bg-purple-700',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
  },
  blue: {
    id: 'blue',
    name: 'Vibrant Blue',
    primary: '#3B82F6',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    ring: 'focus:ring-blue-400',
    btnBg: 'bg-blue-600 hover:bg-blue-700',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
  },
  cyan: {
    id: 'cyan',
    name: 'Neon Cyan',
    primary: '#06B6D4',
    gradient: 'from-teal-400 via-cyan-500 to-blue-500',
    ring: 'focus:ring-cyan-400',
    btnBg: 'bg-cyan-600 hover:bg-cyan-700',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300'
  },
  pink: {
    id: 'pink',
    name: 'Hot Pink',
    primary: '#EC4899',
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    ring: 'focus:ring-pink-400',
    btnBg: 'bg-pink-600 hover:bg-pink-700',
    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
  },
  orange: {
    id: 'orange',
    name: 'Sunset Orange',
    primary: '#F97316',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    ring: 'focus:ring-orange-400',
    btnBg: 'bg-orange-600 hover:bg-orange-700',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
  },
  green: {
    id: 'green',
    name: 'Fresh Mint',
    primary: '#10B981',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    ring: 'focus:ring-green-400',
    btnBg: 'bg-green-600 hover:bg-green-700',
    badge: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
  }
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('vibely_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [accentKey, setAccentKey] = useState(() => {
    return localStorage.getItem('vibely_accent') || 'purple';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('vibely_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('vibely_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const changeAccent = (key) => {
    if (ACCENT_COLORS[key]) {
      setAccentKey(key);
      localStorage.setItem('vibely_accent', key);
    }
  };

  const currentAccent = ACCENT_COLORS[accentKey] || ACCENT_COLORS.purple;

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleTheme,
      accentKey,
      currentAccent,
      changeAccent,
      ACCENT_COLORS
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
