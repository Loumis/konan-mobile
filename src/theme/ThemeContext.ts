/**
 * FI9_NAYEK: Theme Context Type Definitions
 */
import { FI9DarkTheme, FI9DarkThemeType } from './fi9-dark';

export type FI9Mode = 'ACTIVE' | 'BYPASS' | 'STRICT';

export interface ThemeContextValue {
  theme: FI9DarkThemeType;
  fi9Mode: FI9Mode;
  setFI9Mode: (mode: FI9Mode) => void;
  isDark: boolean;
}

export { FI9DarkTheme };

