/**
 * FI9_NAYEK: KONAN Design System
 * ChatGPT-style dark theme with blue/violet gradients
 */

export const FI9Colors = {
  // Backgrounds
  bg: '#0d0f16',
  bgSecondary: '#11131c',
  bgTertiary: '#1a1d29',
  bgElevated: '#1e2130',
  
  // Surfaces
  surface: '#11131c',
  surfaceHover: '#151823',
  surfaceActive: '#1a1d29',
  
  // Text
  text: '#e5e7eb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  textDisabled: '#6b7280',
  
  // Primary gradient (blue → violet)
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  secondary: '#8b5cf6',
  secondaryDark: '#7c3aed',
  
  // Accents
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  // Borders
  border: '#1f2937',
  borderLight: '#374151',
  divider: '#1f2937',
  
  // Chat bubbles
  bubbleUser: '#1a1d29',
  bubbleAssistant: 'transparent', // Uses gradient
  bubbleHover: '#1e2130',
} as const;

export const FI9Gradients = {
  primary: ['#3b82f6', '#8b5cf6'],
  primaryVertical: ['#3b82f6', '#6366f1', '#8b5cf6'],
  primaryHorizontal: ['#3b82f6', '#8b5cf6'],
  subtle: ['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.1)'],
  overlay: ['rgba(13, 15, 22, 0.8)', 'rgba(13, 15, 22, 0.95)'],
} as const;

export const FI9Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const FI9Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const FI9Radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export const FI9Typography = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 36 },
} as const;

export const FI9Animations = {
  fast: 150,
  normal: 250,
  slow: 350,
  spring: {
    damping: 20,
    stiffness: 300,
  },
} as const;

export const DesignSystem = {
  colors: FI9Colors,
  gradients: FI9Gradients,
  shadows: FI9Shadows,
  spacing: FI9Spacing,
  radius: FI9Radius,
  typography: FI9Typography,
  animations: FI9Animations,
} as const;

export type DesignSystemType = typeof DesignSystem;

