/**
 * PHASE A.1 - ThemeContext global Jour/Nuit
 * Détection automatique heure système + préférence utilisateur
 * Transition fluide <100ms
 */
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { lightTheme, darkTheme, ThemeColors, ThemeMode } from '../styles/themes';

// Import conditionnel pour React Native
let useColorScheme: (() => 'light' | 'dark' | null) | null = null;
try {
  const RN = require('react-native');
  if (RN.useColorScheme) {
    useColorScheme = RN.useColorScheme;
  }
} catch (e) {
  // React Native non disponible (web)
}

const THEME_STORAGE_KEY = 'KONAN_THEME_MODE';

interface ThemeContextValue {
  theme: ThemeColors;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Helper pour détecter si on est en mode nuit selon l'heure système
const isNightTime = (): boolean => {
  const hour = new Date().getHours();
  // Nuit: 20h (20:00) à 7h (07:00)
  return hour >= 20 || hour < 7;
};

// Helper pour détecter la préférence système (web)
const getSystemPreference = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialMode = 'auto' 
}) => {
  const [mode, setModeState] = useState<ThemeMode>(initialMode);
  const [loading, setLoading] = useState(true);
  
  // Utiliser useColorScheme de React Native si disponible
  const rnColorScheme = useColorScheme ? useColorScheme() : null;
  
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(() => {
    // Priorité: React Native useColorScheme
    if (rnColorScheme) {
      return rnColorScheme === 'dark' ? 'dark' : 'light';
    }
    // Sinon: Web matchMedia
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // Fallback: heure système
    return isNightTime() ? 'dark' : 'light';
  });

  // Charger la préférence depuis le storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Pour web, utiliser localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
          if (saved && (saved === 'light' || saved === 'dark' || saved === 'auto')) {
            setModeState(saved as ThemeMode);
          }
        }
        // Pour mobile, utiliser AsyncStorage si disponible
        else if (typeof require !== 'undefined') {
          try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (saved && (saved === 'light' || saved === 'dark' || saved === 'auto')) {
              setModeState(saved as ThemeMode);
            }
          } catch (e) {
            // AsyncStorage non disponible, ignorer
          }
        }
      } catch (error) {
        console.error('[Theme] Error loading theme:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Écouter les changements de préférence système
  useEffect(() => {
    // React Native: useColorScheme se met à jour automatiquement
    if (rnColorScheme) {
      setSystemPreference(rnColorScheme === 'dark' ? 'dark' : 'light');
    }
    // Web: écouter matchMedia
    else if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemPreference(e.matches ? 'dark' : 'light');
      };

      // Support moderne
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
      // Fallback pour anciens navigateurs
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [rnColorScheme]);

  // Mettre à jour selon l'heure toutes les minutes (pour mode auto)
  useEffect(() => {
    if (mode !== 'auto') return;

    const interval = setInterval(() => {
      // Forcer un re-render pour mettre à jour le thème selon l'heure
      setSystemPreference(prev => {
        const newPref = isNightTime() ? 'dark' : 'light';
        return newPref !== prev ? newPref : prev;
      });
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(interval);
  }, [mode]);

  // Calculer le thème effectif
  const effectiveTheme = useMemo((): ThemeColors => {
    if (mode === 'light') return lightTheme;
    if (mode === 'dark') return darkTheme;
    
    // Mode auto: combiner préférence système + heure système
    const hourBased = isNightTime() ? 'dark' : 'light';
    const systemBased = systemPreference;
    
    // Priorité: heure système (plus précis pour jour/nuit)
    const autoTheme = hourBased === 'dark' || systemBased === 'dark' ? darkTheme : lightTheme;
    return autoTheme;
  }, [mode, systemPreference]);

  // Calculer isDark
  const isDark = useMemo(() => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    // Auto: combiner heure + préférence système
    // Priorité: heure système (plus précis pour jour/nuit)
    const hourBased = isNightTime();
    return hourBased || systemPreference === 'dark';
  }, [mode, systemPreference]);

  // Sauvegarder la préférence
  const setMode = useCallback(async (newMode: ThemeMode) => {
    try {
      setModeState(newMode);
      
      // Sauvegarder dans localStorage (web)
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(THEME_STORAGE_KEY, newMode);
      }
      // Sauvegarder dans AsyncStorage (mobile)
      else if (typeof require !== 'undefined') {
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
        } catch (e) {
          // AsyncStorage non disponible, ignorer
        }
      }
    } catch (error) {
      console.error('[Theme] Error saving theme:', error);
    }
  }, []);

  // Appliquer les variables CSS pour les transitions fluides
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const colors = effectiveTheme;

    // Appliquer toutes les couleurs comme variables CSS
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Ajouter une classe pour les transitions
    root.classList.add('theme-transition');
  }, [effectiveTheme]);

  if (loading) {
    return null; // Ou un loader si nécessaire
  }

  const value: ThemeContextValue = {
    theme: effectiveTheme,
    mode,
    setMode,
    isDark,
    isLight: !isDark,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

