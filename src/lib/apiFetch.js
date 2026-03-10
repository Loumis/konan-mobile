// FI9_NAYEK: DEPRECATED - Utiliser API depuis api/client.ts à la place
// Ce fichier est conservé pour compatibilité mais ne doit plus être utilisé
// Tous les appels doivent utiliser: import { API } from "../api/client";

import { API } from "../api/client";

/**
 * @deprecated Utiliser API.get(), API.post(), etc. depuis api/client.ts
 * Cette fonction est conservée pour compatibilité mais utilise maintenant le client API FI9
 */
export async function apiFetch(method, url, body = null, token) {
  console.warn("[FI9] apiFetch() est deprecated. Utiliser API depuis api/client.ts");
  
  try {
    let response;
    switch (method.toUpperCase()) {
      case "GET":
        response = await API.get(url);
        break;
      case "POST":
        response = await API.post(url, body);
        break;
      case "PUT":
        response = await API.put(url, body);
        break;
      case "PATCH":
        response = await API.patch(url, body);
        break;
      case "DELETE":
        response = await API.delete(url);
        break;
      default:
        throw new Error(`Méthode HTTP non supportée: ${method}`);
    }
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.detail || error?.message || "";
    if (message.includes("Failed to fetch") || message.includes("NetworkError") || message.includes("Network request failed")) {
      throw new Error("[API] Erreur réseau : Impossible de contacter le serveur. Vérifiez votre connexion.");
    }
    throw error;
  }
}

// Export de fonctions helpers pour chaque méthode HTTP (deprecated)
export const api = {
  get: (url, token) => API.get(url).then(r => r.data),
  post: (url, body, token) => API.post(url, body).then(r => r.data),
  put: (url, body, token) => API.put(url, body).then(r => r.data),
  patch: (url, body, token) => API.patch(url, body).then(r => r.data),
  delete: (url, token) => API.delete(url).then(r => r.data),
};

