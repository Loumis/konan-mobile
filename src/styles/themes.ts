/**
 * PHASE A.1 - Thème global Jour/Nuit
 * Définitions des thèmes light et dark pour toute l'UI
 */

export interface ThemeColors {
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
  
  // Navigation
  navBackground: string;
  navBorder: string;
}

export const lightTheme: ThemeColors = {
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
  
  // Navigation
  navBackground: "#FFFFFF",
  navBorder: "rgba(31,31,31,0.1)",
};

export const darkTheme: ThemeColors = {
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
  
  // Navigation
  navBackground: "#0B0B0B",
  navBorder: "rgba(255,255,255,0.1)",
};

export type ThemeMode = "light" | "dark" | "auto";

