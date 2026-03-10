// FI9_NAYEK: Client HTTP avec getAPIBaseURL et token Bearer
import axios from "axios";
import { getAPIBaseURL } from "../utils/getAPIBaseURL";
import { getToken, clearToken } from "../utils/token";

// Création du client HTTP principal avec getAPIBaseURL
const http = axios.create({
  baseURL: getAPIBaseURL(),
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Intercepteur : ajoute automatiquement le token Bearer au header
http.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[FI9] Bearer injecté: ${token.slice(0, 10)}...`);
        console.log(`[FI9] API Request: ${config.method?.toUpperCase()} ${config.url} - Token présent`);
      } else {
        console.log(`[FI9] Aucun token -> pas d'Authorization`);
        console.log(`[FI9] API Request: ${config.method?.toUpperCase()} ${config.url} - No token`);
      }
    } catch (err) {
      console.warn("[FI9] Erreur lecture token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur : gère les réponses et erreurs globales avec logs FI9
http.interceptors.response.use(
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
      console.log("[FI9] /api/auth/me → 401, clearing token...");
      
      try {
        await clearToken();
        console.log("[FI9] Token cleared after 401");
        
        // Note: Navigation should be handled by the component using this interceptor
        // For web, components can use window.location.href if needed
        // For RN, components should use navigation.navigate('Login')
      } catch (err) {
        console.warn("[FI9] Erreur suppression token:", err);
      }
    }

    // Log error
    if (url?.includes("/api/auth/me")) {
      console.log(`[FI9] /api/auth/me → FAIL (${status})`);
    }

    return Promise.reject(error);
  }
);

export default http;

