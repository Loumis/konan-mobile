/**
 * FI9_NAYEK: Utilitaire unifié pour la gestion du token JWT
 * Clé unifiée: "KONAN_JWT"
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "KONAN_JWT";

/**
 * Sauvegarde le token dans AsyncStorage (mobile) et localStorage (web)
 */
export async function saveToken(token: string): Promise<void> {
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    console.error("[FI9] ERREUR: Tentative de sauvegarde d'un token invalide");
    throw new Error("Token invalide");
  }

  try {
    // Web: utiliser localStorage
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      console.log("[FI9] Token sauvegardé dans localStorage");
    }

    // Mobile: utiliser SecureStore (préféré) ou AsyncStorage (fallback)
    if (Platform.OS !== "web") {
      try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        console.log("[FI9] Token sauvegardé dans SecureStore");
      } catch (secureError) {
        // SecureStore non disponible, utiliser AsyncStorage
        console.log("[FI9] SecureStore failed → fallback AsyncStorage");
        await AsyncStorage.setItem(TOKEN_KEY, token);
        console.log("[FI9] Token sauvegardé dans AsyncStorage (fallback)");
      }
    }
  } catch (error) {
    console.error("[FI9] Erreur lors de la sauvegarde du token:", error);
    throw error;
  }
}

/**
 * Récupère le token depuis AsyncStorage (mobile) ou localStorage (web)
 */
export async function getToken(): Promise<string | null> {
  try {
    let token: string | null = null;

    // Web: utiliser localStorage
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        console.log("[FI9] Token récupéré depuis localStorage");
        return token;
      }
    }

    // Mobile: utiliser SecureStore (préféré) ou AsyncStorage (fallback)
    if (Platform.OS !== "web") {
      try {
        token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          console.log(`[FI9] Token récupéré depuis SecureStore: ${token.slice(0, 30)}...`);
          return token;
        }
      } catch (secureError) {
        // SecureStore non disponible, utiliser AsyncStorage
        console.log("[FI9] SecureStore.getItemAsync failed → fallback AsyncStorage");
        token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          console.log(`[FI9] Token récupéré depuis AsyncStorage (fallback): ${token.slice(0, 30)}...`);
          return token;
        }
      }
    }

    console.log("[FI9] Aucun token trouvé dans SecureStore/AsyncStorage");
    return null;
  } catch (error) {
    console.warn("[FI9] Erreur lors de la récupération du token:", error);
    return null;
  }
}

/**
 * Supprime le token depuis AsyncStorage (mobile) et localStorage (web)
 */
export async function clearToken(): Promise<void> {
  try {
    // Web: supprimer de localStorage
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      // Nettoyer les anciennes clés obsolètes
      localStorage.removeItem("konan.jwt");
      localStorage.removeItem("konan_token");
      localStorage.removeItem("fi9_token");
      console.log("[FI9] Token supprimé de localStorage");
    }

    // Mobile: supprimer de SecureStore et AsyncStorage
    if (Platform.OS !== "web") {
      try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        console.log("[FI9] Token supprimé de SecureStore");
      } catch (secureError) {
        // SecureStore non disponible, continuer avec AsyncStorage
        console.log("[FI9] SecureStore.deleteItemAsync failed → continuer avec AsyncStorage");
      }
      await AsyncStorage.removeItem(TOKEN_KEY);
      // Nettoyer les anciennes clés obsolètes
      await AsyncStorage.removeItem("konan.jwt");
      await AsyncStorage.removeItem("konan_token");
      await AsyncStorage.removeItem("fi9_token");
      console.log("[FI9] Token supprimé d'AsyncStorage");
      console.log("[FI9] Token supprimé partout (SecureStore + AsyncStorage)");
    }
  } catch (error) {
    console.error("[FI9] Erreur lors de la suppression du token:", error);
    throw error;
  }
}

/**
 * Nettoie tous les anciens tokens (migration)
 */
export async function clearOldTokens(): Promise<void> {
  const oldKeys = [
    "konan.jwt",
    "konan_token",
    "fi9_token",
    "authToken",
    "jwt",
    "token",
  ];

  try {
    // Web: nettoyer localStorage
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      oldKeys.forEach((key) => {
        localStorage.removeItem(key);
      });
      console.log("[FI9] Anciens tokens supprimés de localStorage");
    }

    // Mobile: nettoyer AsyncStorage
    if (Platform.OS !== "web") {
      for (const key of oldKeys) {
        try {
          await AsyncStorage.removeItem(key);
        } catch (error) {
          // Ignorer les erreurs
        }
      }
      console.log("[FI9] Anciens tokens supprimés d'AsyncStorage");
    }
  } catch (error) {
    console.warn("[FI9] Erreur lors du nettoyage des anciens tokens:", error);
  }
}

export { TOKEN_KEY };

