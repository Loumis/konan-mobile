// FI9_NAYEK: Chat Service - Utilise le client API avec axios
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/services/ChatService.js");
import { API } from "../api/client";
import { getAPIBaseURL } from "../utils/getAPIBaseURL";

function normalizeMessages(payload) {
  if (!payload) return [];
  const source = Array.isArray(payload?.messages)
    ? payload.messages
    : Array.isArray(payload)
    ? payload
    : [];
  return source.map((msg, index) => ({
    id: msg?.id || `${Date.now()}-${index}`,
    role: msg?.role === "user" || msg?.role === "assistant" ? msg.role : "assistant",
    content: msg?.content ?? msg?.message ?? "",
  }));
}

/**
 * Send message to /api/chat endpoint
 * FI9_NAYEK: Le token est ajouté automatiquement par l'interceptor API
 * @param {string} message - Message text
 * @param {string} token - DEPRECATED: Token non utilisé, l'interceptor le gère automatiquement
 * @param {string} sessionId - Optional session ID
 * @returns {Promise<Array>} Array of normalized messages
 */
export async function sendMessage(message, token, sessionId) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/services/ChatService.js");
  // FI9_NAYEK: Le paramètre token est conservé pour compatibilité mais non utilisé
  // L'interceptor API ajoute automatiquement le Bearer token depuis le storage
  const text = message?.trim();
  if (!text) {
    throw new Error("Message vide");
  }

  // FI9_NAYEK: Log du message envoyé
  console.log("[FI9] Sending message to /api/chat:", text);
  console.log("[FI9] API Base URL:", getAPIBaseURL());
  
  // FI9_NAYEK: Vérifier le token avant l'appel (pour diagnostic)
  const { getToken } = await import("../utils/token");
  const currentToken = await getToken();
  if (!currentToken) {
    console.error("[FI9] ⚠️ ERREUR: Aucun token trouvé dans le storage avant l'appel /api/chat");
    console.error("[FI9] ⚠️ L'appel va échouer avec 401 Unauthorized");
    throw new Error("Token manquant. Veuillez vous reconnecter.");
  }
  console.log(`[FI9] ChatService sendMessage token: ${currentToken.slice(0, 30)}...`);
  console.log(`[FI9] Token vérifié avant appel: ${currentToken.slice(0, 30)}...`);

  try {
    // FI9_NAYEK: Utilise le client API axios avec interceptor Bearer
    // Le token est automatiquement ajouté par l'interceptor si fourni
    const payload = {
      message: text,
      ...(sessionId ? { session_id: sessionId } : {}),
    };

    console.log("[FI9] Chat payload:", JSON.stringify(payload));

    const response = await API.post("/api/chat", payload);

    console.log("[FI9] Chat response:", response.data);

    // FI9_NAYEK: Backend returns { reply, citation_block, fi9_proof, fi9 }
    // Extract reply field (pure conversational text) and store citations/proof separately
    const body = response.data;
    const reply = body?.reply || body?.message || body?.text || body?.response || body?.answer || body?.content || "Réponse vide du backend.";
    const responseFingerprint = body?.response_fingerprint ?? null;
    const responseSessionId = body?.session_id ?? body?.id ?? null;
    
    return [
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply, // Pure conversational text only
        reply: reply, // Store separately for clarity
        citation_block: body?.citation_block || null, // Citations stored separately
        fi9_proof: body?.fi9_proof || null, // Proof stored separately
        fi9: body?.fi9 || null, // FI9 metadata stored separately
        session_id: responseSessionId,
        response_fingerprint: responseFingerprint,
      },
    ];
  } catch (error) {
    console.error("[FI9] Chat error:", error);
    
    // FI9_NAYEK: Message d'erreur réseau amélioré
    const message = error?.response?.data?.detail || error?.message || "";
    if (String(error?.response?.status || "").includes("401")) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
    if (message.includes("Failed to fetch") || message.includes("NetworkError") || message.includes("Network request failed")) {
      throw new Error("[CHAT] Erreur réseau API : Impossible de contacter le serveur. Vérifiez votre connexion.");
    }
    throw new Error(`[CHAT] Erreur API : ${message || "Serveur injoignable"}`);
  }
}
