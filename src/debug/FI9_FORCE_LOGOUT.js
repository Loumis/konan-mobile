// FI9_NAYEK: Fonction de déconnexion forcée - Nettoie TOUS les tokens
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEYS = [
  "konan.jwt",      // Clé principale FI9
  "konan_token",    // Ancienne clé (obsolète)
  "fi9_token",      // Ancienne clé (obsolète)
  "access_token",   // Ancienne clé (obsolète)
];

/**
 * FI9_FORCE_LOGOUT - Nettoie complètement tous les tokens stockés
 * @returns {Promise<void>}
 */
export async function FI9_FORCE_LOGOUT() {
  console.log("[FI9] FORCE_LOGOUT: Début du nettoyage complet");
  
  const isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  
  try {
    if (isWeb) {
      // Web: Nettoyer localStorage
      TOKEN_KEYS.forEach(key => {
        localStorage.removeItem(key);
        console.log(`[FI9] FORCE_LOGOUT: localStorage.removeItem("${key}")`);
      });
      
      // Nettoyer aussi sessionStorage au cas où
      TOKEN_KEYS.forEach(key => {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem(key);
        }
      });
    } else {
      // Mobile: Nettoyer AsyncStorage
      for (const key of TOKEN_KEYS) {
        await AsyncStorage.removeItem(key);
        console.log(`[FI9] FORCE_LOGOUT: AsyncStorage.removeItem("${key}")`);
      }
    }
    
    console.log("[FI9] FORCE_LOGOUT: Nettoyage terminé");
  } catch (error) {
    console.error("[FI9] FORCE_LOGOUT: Erreur lors du nettoyage:", error);
    throw error;
  }
}

/**
 * FI9_CLEAR_ALL_STORAGE - Nettoie tout le storage (utilisé en cas de corruption)
 */
export async function FI9_CLEAR_ALL_STORAGE() {
  console.log("[FI9] CLEAR_ALL_STORAGE: Nettoyage complet du storage");
  
  const isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  
  try {
    if (isWeb) {
      localStorage.clear();
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
      console.log("[FI9] CLEAR_ALL_STORAGE: localStorage et sessionStorage vidés");
    } else {
      await AsyncStorage.clear();
      console.log("[FI9] CLEAR_ALL_STORAGE: AsyncStorage vidé");
    }
  } catch (error) {
    console.error("[FI9] CLEAR_ALL_STORAGE: Erreur:", error);
    throw error;
  }
}

export default FI9_FORCE_LOGOUT;

