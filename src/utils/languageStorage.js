// FI9_NAYEK v13: Language storage avec AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "KONAN_LANGUAGE";

export const LANGUAGES = {
  FR: "fr",
  EN: "en",
  AR: "ar",
};

const DEFAULT_LANGUAGE = LANGUAGES.FR;

/**
 * Sauvegarde la langue sélectionnée
 */
export async function saveLanguage(language) {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    console.log(`[FI9] Langue sauvegardée: ${language}`);
  } catch (error) {
    console.error("[FI9] Erreur sauvegarde langue:", error);
  }
}

/**
 * Récupère la langue sélectionnée
 */
export async function getLanguage() {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language || DEFAULT_LANGUAGE;
  } catch (error) {
    console.error("[FI9] Erreur récupération langue:", error);
    return DEFAULT_LANGUAGE;
  }
}

