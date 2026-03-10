// FI9_NAYEK v13: Language Context Provider avec i18n (FR/EN/AR)
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/context/LanguageContext.tsx");
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fr from "../i18n/fr.json";
import en from "../i18n/en.json";
import ar from "../i18n/ar.json";

export type Language = "fr" | "en" | "ar";

export const LANGUAGES = {
  FR: "fr" as Language,
  EN: "en" as Language,
  AR: "ar" as Language,
};

const LANGUAGE_KEY = "KONAN_LANGUAGE";
const DEFAULT_LANGUAGE: Language = "fr";

const translations = {
  fr,
  en,
  ar,
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/context/LanguageContext.tsx");
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [loading, setLoading] = useState(true);

  // Load language from storage on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved && (saved === "fr" || saved === "en" || saved === "ar")) {
        setLanguageState(saved as Language);
      }
    } catch (error) {
      console.error("[FI9] Error loading language:", error);
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setLanguageState(lang);
      console.log(`[FI9] Language changed to: ${lang}`);
    } catch (error) {
      console.error("[FI9] Error saving language:", error);
    }
  };

  const t = (key: string): string => {
    const dict = translations[language];
    return dict[key as keyof typeof dict] || key;
  };

  // Don't render children until language is loaded
  if (loading) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

