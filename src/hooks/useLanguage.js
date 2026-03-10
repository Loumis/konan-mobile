// FI9_NAYEK v14: useLanguage hook - wrapper for LanguageContext
// Re-export useLanguage from LanguageContext for consistency
export { useLanguage } from "../context/LanguageContext";

// Default export for convenience
import { useLanguage as useLanguageHook } from "../context/LanguageContext";
export default useLanguageHook;

