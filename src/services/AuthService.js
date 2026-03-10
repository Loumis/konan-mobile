// FI9_NAYEK: Utilisation du client API avec interceptor Bearer automatique
// FI9_NAYEK: AuthService retourne { access_token, apply: true } pour que AuthContext gère l'application du token
// FI9_NAYEK: NE PAS appeler saveToken() ici - AuthContext gère l'application du token
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/services/AuthService.js");
import { API } from "../api/client";

export async function login(email, password) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/services/AuthService.js (login)");
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();
  if (!trimmedEmail || !trimmedPassword) {
    throw new Error("Identifiants requis");
  }
  
  try {
    const response = await API.post("/api/auth/login", {
      email: trimmedEmail,
      password: trimmedPassword,
    });
    
    // FI9_NAYEK: Retourner access_token avec flag apply: true pour que AuthContext gère l'application
    // NE PAS appeler saveToken() ici - AuthContext.appliqueToken() le fera
    if (response.data?.access_token) {
      console.log("[FI9] Login successful - returning token with apply flag");
      return {
        ...response.data,
        apply: true,
      };
    }
    
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.detail || error?.message || "";
    if (
      message.includes("Failed to fetch") ||
      message.includes("NetworkError") ||
      message.includes("Network request failed")
    ) {
      throw new Error(
        "[AUTH] Erreur réseau API : Impossible de contacter le serveur. Vérifiez votre connexion."
      );
    }
    throw new Error(
      `[AUTH] Erreur réseau API : ${message || "Impossible de contacter le serveur"}`
    );
  }
}

export async function register(email, password) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/services/AuthService.js (register)");
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();
  if (!trimmedEmail || !trimmedPassword) {
    throw new Error("Email et mot de passe requis");
  }
  
  try {
    const response = await API.post("/api/auth/register", {
      email: trimmedEmail,
      password: trimmedPassword,
    });
    
    // FI9_NAYEK: Retourner access_token avec flag apply: true pour que AuthContext gère l'application
    // NE PAS appeler saveToken() ici - AuthContext.appliqueToken() le fera
    if (response.data?.access_token) {
      console.log("[FI9] Register successful - returning token with apply flag");
      return {
        ...response.data,
        apply: true,
      };
    }
    
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.detail || error?.message || "";
    if (
      message.includes("Failed to fetch") ||
      message.includes("NetworkError") ||
      message.includes("Network request failed")
    ) {
      throw new Error(
        "[AUTH] Erreur réseau API : Impossible de contacter le serveur. Vérifiez votre connexion."
      );
    }
    throw new Error(
      `[AUTH] Erreur réseau API : ${message || "Impossible de contacter le serveur"}`
    );
  }
}
