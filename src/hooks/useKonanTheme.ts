/**
 * FI9_NAYEK: KONAN theme hook - Uses FI9 Theme Provider
 */
import { useTheme } from '../theme/ThemeProvider';

export const useKonanTheme = () => {
  const { theme, fi9Mode, setFI9Mode, isDark } = useTheme();

  return {
    ...theme,
    fi9Mode,
    setFI9Mode,
    isDark,
    // Convenience getters
    colors: theme.colors,
    gradients: theme.gradients,
    shadows: theme.shadows,
    spacing: theme.spacing,
    radius: theme.radius,
    typography: theme.typography,
    animations: theme.animations,
  };
};

export type KonanTheme = ReturnType<typeof useKonanTheme>;

