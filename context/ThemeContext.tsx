'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isMobile: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  isMobile: false,
});

function applyThemeToDocument(newTheme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (newTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default strictly to 'light' (white color scheme)
  const [theme, setThemeState] = useState<Theme>('light');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if device is mobile viewport
    const checkMobile = () => {
      const mobileQuery = window.matchMedia('(max-width: 768px)');
      setIsMobile(mobileQuery.matches);
      return mobileQuery.matches;
    };
    checkMobile();

    // Check stored user preference, otherwise strictly default to 'light'
    const savedTheme = localStorage.getItem('sk_theme') as Theme | null;
    if (savedTheme === 'dark') {
      setThemeState('dark');
      applyThemeToDocument('dark');
    } else {
      // Default is always white / light
      setThemeState('light');
      applyThemeToDocument('light');
    }

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDocument(newTheme);
    localStorage.setItem('sk_theme', newTheme);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isMobile }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
