"use client";

import type React from 'react';
import { createContext, useContext, useMemo, type ReactNode, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

   // Effect to apply the theme class to the body
  useEffect(() => {
      if (typeof window !== 'undefined') {
          const body = window.document.body;
          body.classList.remove('light', 'dark');
          body.classList.add(theme);
      }
  }, [theme]);


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Ensure toggleTheme is stable using useCallback if needed, though here it's simple enough
  // const stableToggleTheme = useCallback(toggleTheme, [setTheme]);

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]); // Use stableToggleTheme if useCallback is used

  return (
    <ThemeContext.Provider value={contextValue}>
        {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
