/**
 * FI9_NAYEK: Dark Theme Palette - ChatGPT Style
 */
export const FI9DarkTheme = {
  colors: {
    // Backgrounds
    bg: '#0d0d0d',
    bgSecondary: '#1a1a1a',
    bgTertiary: '#202020',
    bgElevated: '#252525',
    
    // Surfaces
    surface: '#1a1a1a',
    surfaceHover: '#202020',
    surfaceActive: '#252525',
    
    // Text
    text: '#e5e7eb',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    textDisabled: '#6b7280',
    
    // Primary colors (blue/violet gradient)
    primary: '#4361ee',
    primaryDark: '#3a56d4',
    secondary: '#6930c3',
    secondaryDark: '#5a26a8',
    
    // Accents
    accent: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // Borders
    border: '#2a2a2a',
    borderLight: '#3a3a3a',
    divider: '#2a2a2a',
    
    // Chat bubbles
    bubbleUser: '#1a1a1a',
    bubbleAssistant: 'transparent', // Uses gradient
    bubbleHover: '#202020',
  },
  
  gradients: {
    primary: ['#4361ee', '#6930c3'],
    primaryVertical: ['#4361ee', '#5f3dc4', '#6930c3'],
    primaryHorizontal: ['#4361ee', '#6930c3'],
    subtle: ['rgba(67, 97, 238, 0.1)', 'rgba(105, 48, 195, 0.1)'],
    overlay: ['rgba(13, 13, 13, 0.8)', 'rgba(13, 13, 13, 0.95)'],
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
  },
  
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 22, // ChatGPT style rounded bubbles
    full: 9999,
  },
  
  shadows: {
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
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
    },
  },
  
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    xs: { fontSize: 12, lineHeight: 16 },
    sm: { fontSize: 14, lineHeight: 20 },
    base: { fontSize: 16, lineHeight: 24 },
    lg: { fontSize: 18, lineHeight: 28 },
    xl: { fontSize: 20, lineHeight: 28 },
    '2xl': { fontSize: 24, lineHeight: 32 },
  },
  
  animations: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
} as const;

export type FI9DarkThemeType = typeof FI9DarkTheme;

