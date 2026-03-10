/**
 * FI9_NAYEK: Universal API Client with Axios
 * Auto-injects Bearer token in all requests
 */
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getAPIBaseURL } from "../utils/getAPIBaseURL";
import { getToken, clearToken } from "../utils/token";

/**
 * Create axios instance with base URL
 */
export const API: AxiosInstance = axios.create({
  baseURL: getAPIBaseURL(),
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * FI9_NAYEK: Trace global pour diagnostiquer les requêtes sans token
 * Capture la stack trace et l'état du token au moment exact de la requête
 */
function getCallerStack(): string {
  try {
    const stack = new Error().stack;
    if (!stack) return "Stack trace unavailable";
    
    const lines = stack.split('\n');
    // Ignorer les lignes de l'interceptor et de cette fonction
    const relevantLines = lines.slice(4, 8); // Prendre les 4 premières lignes pertinentes
    return relevantLines.map(line => line.trim()).join(' → ');
  } catch (e) {
    return "Stack trace error";
  }
}

/**
 * Request interceptor: Add Bearer token to all requests
 */
API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // FI9_NAYEK: TRACE - Capturer la stack trace de l'appelant
    const callerStack = getCallerStack();
    
    // FI9_NAYEK: Récupérer le token depuis le storage unifié
    const token = await getToken();
    
    // FI9_NAYEK: Logs FI9 pour Android/Web
    console.log(`[FI9] Interceptor token (Android/Web): ${token ? `${token.slice(0, 30)}...` : 'NULL'}`);
    
    // FI9_NAYEK: TRACE - Logger l'état du token au moment exact de la requête
    console.log(`[FI9-TRACE] Request triggered from: ${callerStack}`);
    console.log(`[FI9-TRACE] Token at call time: ${token ? `${token.slice(0, 20)}...` : 'NULL'}`);
    console.log(`[FI9-TRACE] Authorization header: ${token ? `Bearer ${token.slice(0, 20)}...` : 'NULL'}`);
    console.log(`[FI9-TRACE] Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    if (token) {
      // FI9_NAYEK: Injecter le Bearer token dans les headers
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[FI9] Header Authorization SET: Bearer ${token.slice(0, 30)}...`);
      console.log(`[FI9] Bearer injecté: ${token.slice(0, 10)}...`);
      console.log(`[FI9] API Request: ${config.method?.toUpperCase()} ${config.url} - Token présent`);
      
      // FI9_NAYEK: Vérification supplémentaire pour /api/chat
      if (config.url?.includes('/api/chat')) {
        console.log(`[FI9] ✅ /api/chat - Token présent dans headers: ${config.headers.Authorization ? 'OUI' : 'NON'}`);
        console.log(`[FI9] ✅ /api/chat - Header complet: ${config.headers.Authorization?.slice(0, 30)}...`);
      }
    } else {
      console.log(`[FI9] Header Authorization NOT SET → token NULL`);
      console.log(`[FI9] Aucun token -> pas d'Authorization`);
      console.log(`[FI9] API Request: ${config.method?.toUpperCase()} ${config.url} - No token`);
      
      // FI9_NAYEK: Pour les endpoints qui nécessitent un token, avertir avec stack trace
      if (config.url?.includes('/api/auth/me') || config.url?.includes('/api/chat')) {
        console.warn(`[FI9] ⚠️ ATTENTION: ${config.url} nécessite un token mais aucun token trouvé`);
        console.warn(`[FI9] ⚠️ Appelant: ${callerStack}`);
        console.warn(`[FI9] ⚠️ Cette requête sera rejetée par le backend avec 401`);
        console.warn(`[FI9] ⚠️ Vérifiez que le token est bien sauvegardé via saveToken() après login`);
      }
    }
    
    return config;
  },
  (error) => {
    console.error("[FI9] API Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle 401 errors and refresh token
 */
API.interceptors.response.use(
  (response) => {
    // Log successful auth requests
    if (response.config.url?.includes("/api/auth/me")) {
      const sub = response.data?.id || response.data?.sub || "unknown";
      console.log(`[FI9] /api/auth/me → OK (sub: ${sub})`);
    }
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;

    // Handle 401 on /api/auth/me
    if (status === 401 && url?.includes("/api/auth/me")) {
      console.log("[FI9] 401 détecté sur /api/auth/me → Token invalide ou expiré");
      console.log("[FI9] /api/auth/me → 401, clearing token...");
      
      try {
        await clearToken();
        console.log("[FI9] Token cleared after 401");
        
        // Note: Navigation should be handled by the component using this interceptor
        // For web, components can use window.location.href if needed
        // For RN, components should use navigation.navigate('Login')
      } catch (err) {
        console.error("[FI9] Error clearing token:", err);
      }
    }

    // Handle 401 on /api/chat
    if (status === 401 && url?.includes("/api/chat")) {
      console.log("[FI9] 401 détecté sur /api/chat → Token invalide ou expiré");
      console.log("[FI9] /api/chat → 401 Unauthorized");
      console.log("[FI9] ⚠️ Token manquant ou invalide pour /api/chat");
      
      // Log du token qui était utilisé (si disponible)
      const tokenUsed = error?.config?.headers?.Authorization;
      if (tokenUsed) {
        console.log(`[FI9] Token utilisé dans la requête: ${tokenUsed.slice(0, 30)}...`);
      } else {
        console.warn("[FI9] ⚠️ Aucun token dans les headers de la requête");
      }
      
      // Vérifier le token actuel dans le storage
      const currentToken = await getToken();
      if (!currentToken) {
        console.warn("[FI9] ⚠️ Aucun token trouvé dans le storage");
        try {
          await clearToken();
          console.log("[FI9] Token cleared after 401 on /api/chat");
        } catch (err) {
          console.error("[FI9] Error clearing token:", err);
        }
      } else {
        console.warn(`[FI9] ⚠️ Token présent dans storage mais requête rejetée: ${currentToken.slice(0, 30)}...`);
        console.warn("[FI9] ⚠️ Le token pourrait être expiré ou invalide");
      }
    }

    // Log error
    if (url?.includes("/api/auth/me")) {
      console.log(`[FI9] /api/auth/me → FAIL (${status})`);
    }
    if (url?.includes("/api/chat")) {
      console.log(`[FI9] /api/chat → FAIL (${status})`);
    }

    return Promise.reject(error);
  }
);

export default API;
