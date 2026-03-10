/**
 * FI9_NAYEK: Theme Provider Component
 */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ThemeContextValue, FI9Mode, FI9DarkTheme } from './ThemeContext';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  initialFI9Mode?: FI9Mode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialFI9Mode = 'ACTIVE',
}) => {
  const [fi9Mode, setFI9ModeState] = useState<FI9Mode>(initialFI9Mode);

  const setFI9Mode = useCallback((mode: FI9Mode) => {
    setFI9ModeState(mode);
    console.log(`[FI9] Theme Mode changed to: ${mode}`);
  }, []);

  const value: ThemeContextValue = {
    theme: FI9DarkTheme,
    fi9Mode,
    setFI9Mode,
    isDark: true, // Always dark mode for FI9
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

