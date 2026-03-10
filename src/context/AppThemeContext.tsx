// FI9_NAYEK v13: App Theme Context (Light/Dark/Auto)
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/context/AppThemeContext.tsx");
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "auto";

const THEME_KEY = "KONAN_THEME";
const DEFAULT_THEME: ThemeMode = "dark";

interface ThemeColors {
  // Arrière-plans
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  
  // Texte
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // Bordures
  border: string;
  borderLight: string;
  
  // Couleurs primaires
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Couleurs secondaires
  secondary: string;
  
  // États
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Messages (Chat)
  userMessageBg: string;
  userMessageText: string;
  assistantMessageBg: string;
  assistantMessageText: string;
  
  // Composants
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  
  // Sidebar
  sidebarBackground: string;
  sidebarItemActive: string;
  sidebarItemHover: string;
  
  // Overlay
  overlay: string;
}

const lightTheme: ThemeColors = {
  // Arrière-plans
  background: "#FFFFFF",
  backgroundSecondary: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceElevated: "#FAFAFA",
  
  // Texte
  text: "#1f1f1f",
  textSecondary: "#666666",
  textMuted: "rgba(31,31,31,0.6)",
  textInverse: "#FFFFFF",
  
  // Bordures
  border: "rgba(31,31,31,0.1)",
  borderLight: "#F0F0F0",
  
  // Couleurs primaires
  primary: "#10A37F",
  primaryLight: "#2AB891",
  primaryDark: "#0D8C6D",
  
  // Couleurs secondaires
  secondary: "#4A90E2",
  
  // États
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",
  
  // Messages (Chat)
  userMessageBg: "#10A37F",
  userMessageText: "#FFFFFF",
  assistantMessageBg: "#F5F5F5",
  assistantMessageText: "#1f1f1f",
  
  // Composants
  inputBackground: "#F5F5F5",
  inputBorder: "#E0E0E0",
  inputText: "#1f1f1f",
  inputPlaceholder: "#999999",
  
  // Sidebar
  sidebarBackground: "#FFFFFF",
  sidebarItemActive: "#E8F5E9",
  sidebarItemHover: "#F5F5F5",
  
  // Overlay
  overlay: "rgba(0, 0, 0, 0.5)",
};

const darkTheme: ThemeColors = {
  // Arrière-plans
  background: "#0B0B0B",
  backgroundSecondary: "#1A1A1A",
  surface: "#1f1f1f",
  surfaceElevated: "#2A2A2A",
  
  // Texte
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  textMuted: "rgba(255,255,255,0.6)",
  textInverse: "#000000",
  
  // Bordures
  border: "rgba(255,255,255,0.1)",
  borderLight: "#2E2E2E",
  
  // Couleurs primaires
  primary: "#10A37F",
  primaryLight: "#2AB891",
  primaryDark: "#0D8C6D",
  
  // Couleurs secondaires
  secondary: "#5FA3FF",
  
  // États
  success: "#66BB6A",
  warning: "#FFA726",
  error: "#EF5350",
  info: "#42A5F5",
  
  // Messages (Chat)
  userMessageBg: "#10A37F",
  userMessageText: "#FFFFFF",
  assistantMessageBg: "#2E2E2E",
  assistantMessageText: "#FFFFFF",
  
  // Composants
  inputBackground: "#2E2E2E",
  inputBorder: "#3A3A3A",
  inputText: "#FFFFFF",
  inputPlaceholder: "#808080",
  
  // Sidebar
  sidebarBackground: "#1A1A1A",
  sidebarItemActive: "#1C3A2E",
  sidebarItemHover: "#242424",
  
  // Overlay
  overlay: "rgba(0, 0, 0, 0.7)",
};

interface AppThemeContextValue {
  theme: ThemeColors;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
  isDark: boolean;
}

const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}

interface AppThemeProviderProps {
  children: ReactNode;
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/context/AppThemeContext.tsx");
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const systemColorScheme = useColorScheme();

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved && (saved === "light" || saved === "dark" || saved === "auto")) {
        setModeState(saved as ThemeMode);
      }
    } catch (error) {
      console.error("[FI9] Error loading theme:", error);
    } finally {
      setLoading(false);
    }
  };

  const setMode = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
      setModeState(newMode);
      console.log(`[FI9] Theme changed to: ${newMode}`);
    } catch (error) {
      console.error("[FI9] Error saving theme:", error);
    }
  };

  // Determine actual theme based on mode
  const getEffectiveTheme = (): ThemeColors => {
    if (mode === "auto") {
      // Auto: follow system or time-based (20h → dark, 07h → light)
      const hour = new Date().getHours();
      const isSystemDark = systemColorScheme === "dark";
      const isTimeDark = hour >= 20 || hour < 7;
      return (isSystemDark || isTimeDark) ? darkTheme : lightTheme;
    }
    return mode === "dark" ? darkTheme : lightTheme;
  };

  const effectiveTheme = getEffectiveTheme();
  // FI9_NAYEK v14: Mémoriser isDark pour éviter recalculs inutiles
  const isDark = React.useMemo(() => {
    if (mode === "dark") return true;
    if (mode === "light") return false;
    // Auto mode: follow system or time-based
    const hour = new Date().getHours();
    return systemColorScheme === "dark" || hour >= 20 || hour < 7;
  }, [mode, systemColorScheme]);

  if (loading) {
    return null;
  }

  return (
    <AppThemeContext.Provider
      value={{
        theme: effectiveTheme,
        mode,
        setMode,
        isDark,
      }}
    >
      {children}
    </AppThemeContext.Provider>
  );
}

