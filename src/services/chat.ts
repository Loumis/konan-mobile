// FI9_NAYEK: DEPRECATED - Utiliser ChatService.js à la place
// Ce fichier est conservé pour compatibilité mais redirige vers ChatService.js
// Tous les appels doivent utiliser: import { sendMessage } from "../services/ChatService";

import { sendMessage as sendMessageFromChatService } from "./ChatService";

type ChatPayload = {
  message: string;
  session_id?: string;
};

/**
 * @deprecated Utiliser sendMessage depuis ChatService.js à la place
 * Cette fonction est conservée pour compatibilité mais utilise maintenant ChatService.js
 */
export async function sendMessage(payload: ChatPayload, token?: string) {
  console.warn("[FI9] services/chat.ts sendMessage() est deprecated. Utiliser ChatService.js");
  
  // Convertir le payload en paramètres pour ChatService
  const message = typeof payload === 'string' ? payload : payload.message;
  const sessionId = typeof payload === 'object' ? payload.session_id : undefined;
  
  // Utiliser ChatService qui passe par l'interceptor FI9
  return await sendMessageFromChatService(message, token, sessionId);
}


