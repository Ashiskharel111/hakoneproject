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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if device is mobile viewport
    const checkMobile = () => {
      const mobileQuery = window.matchMedia('(max-width: 768px)');
      setIsMobile(mobileQuery.matches);
      return mobileQuery.matches;
    };

    const isCurrentMobile = checkMobile();
    const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // On phone/mobile: Auto detect system theme
    if (isCurrentMobile) {
      const initialSystemTheme: Theme = systemDarkQuery.matches ? 'dark' : 'light';
      setThemeState(initialSystemTheme);
      applyTheme(initialSystemTheme);
    } else {
      // On desktop: check stored preference or default to light
      const savedTheme = localStorage.getItem('sk_theme') as Theme | null;
      const initialTheme = savedTheme || 'light';
      setThemeState(initialTheme);
      applyTheme(initialTheme);
    }

    // System dark mode listener for mobile devices
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (window.innerWidth <= 768) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    // Resize listener
    const handleResize = () => {
      checkMobile();
    };

    systemDarkQuery.addEventListener('change', handleSystemThemeChange);
    window.addEventListener('resize', handleResize);

    return () => {
      systemDarkQuery.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
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
