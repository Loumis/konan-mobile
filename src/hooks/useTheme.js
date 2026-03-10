// FI9_NAYEK v14: useTheme hook - wrapper for useAppTheme
import { useAppTheme } from "../context/AppThemeContext";

/**
 * Hook to access theme context
 * @returns {Object} Theme context with theme, mode, setMode, isDark
 */
export function useTheme() {
  return useAppTheme();
}

export default useTheme;

