/**
 * FI9_NAYEK: Theme Context Provider
 */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DesignSystem } from '../styles/DesignSystem';

export type FI9Mode = 'ACTIVE' | 'BYPASS' | 'STRICT';

interface ThemeContextValue {
  theme: typeof DesignSystem;
  fi9Mode: FI9Mode;
  setFI9Mode: (mode: FI9Mode) => void;
  isDark: boolean;
}

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
  }, []);

  const value: ThemeContextValue = {
    theme: DesignSystem,
    fi9Mode,
    setFI9Mode,
    isDark: true, // Always dark mode for FI9
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

