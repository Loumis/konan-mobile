// FI9_NAYEK v13: Chat persistence avec AsyncStorage (sessions + messages)
// Persistance simple et stable des sessions + messages
import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSIONS_KEY = "KONAN_CHAT_SESSIONS";
const MESSAGES_PREFIX = "KONAN_CHAT_MESSAGES_";
const CURRENT_SESSION_KEY = "KONAN_CURRENT_SESSION";

/**
 * Sauvegarde une session de chat
 */
export async function saveSession(session) {
  try {
    const sessions = await getSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);

    if (existingIndex >= 0) {
      sessions[existingIndex] = { ...sessions[existingIndex], ...session };
    } else {
      sessions.push(session);
    }

    // Trier par updatedAt (plus récent en premier)
    sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    console.log(`[FI9] Session sauvegardée: ${session.id}`);
  } catch (error) {
    console.error("[FI9] Erreur sauvegarde session:", error);
  }
}

/**
 * Récupère toutes les sessions
 */
export async function getSessions() {
  try {
    const data = await AsyncStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("[FI9] Erreur récupération sessions:", error);
    return [];
  }
}

/**
 * Supprime une session et ses messages
 */
export async function deleteSession(sessionId) {
  try {
    const sessions = await getSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));

    await AsyncStorage.removeItem(`${MESSAGES_PREFIX}${sessionId}`);
    console.log(`[FI9] Session supprimée: ${sessionId}`);
  } catch (error) {
    console.error("[FI9] Erreur suppression session:", error);
  }
}

/**
 * PHASE 3.3: Renomme une session
 */
export async function renameSession(sessionId, newTitle) {
  try {
    const sessions = await getSessions();
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

    if (sessionIndex >= 0) {
      sessions[sessionIndex] = {
        ...sessions[sessionIndex],
        title: newTitle,
        updatedAt: Date.now(),
      };

      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      console.log(`[FI9] Session renommée: ${sessionId} → "${newTitle}"`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("[FI9] Erreur renommage session:", error);
    return false;
  }
}

/**
 * FI9_NAYEK v13: Sauvegarde TOUJOURS le tableau complet, jamais d'écrasement par vide
 * Sauvegarde les messages d'une session
 */
export async function saveMessages(sessionId, messages) {
  try {
    if (!sessionId || !Array.isArray(messages)) {
      console.warn("[FI9] saveMessages: sessionId ou messages invalides");
      return;
    }

    // FI9_NAYEK v13: Ne jamais sauvegarder un tableau vide (protéger contre écrasement accidentel)
    if (messages.length === 0) {
      console.warn("[FI9] saveMessages: tentative de sauvegarde tableau vide, ignorée");
      return;
    }

    const key = `${MESSAGES_PREFIX}${sessionId}`;
    await AsyncStorage.setItem(key, JSON.stringify(messages));

    console.log(
      `[FI9] ${messages.length} messages sauvegardés pour session ${sessionId}`
    );
  } catch (error) {
    console.error("[FI9] Erreur sauvegarde messages:", error);
  }
}

/**
 * FI9_NAYEK v13: Récupère TOUJOURS un tableau (jamais null/undefined), sans troncature
 * Charger les messages d'une session
 */
export async function getMessages(sessionId) {
  try {
    if (!sessionId) {
      return [];
    }

    const key = `${MESSAGES_PREFIX}${sessionId}`;
    const data = await AsyncStorage.getItem(key);

    if (!data) {
      return [];
    }

    const messages = JSON.parse(data);

    // FI9_NAYEK v13: Toujours retourner un array, valider le format
    if (!Array.isArray(messages)) {
      console.warn("[FI9] getMessages: données invalides, retour []");
      return [];
    }

    // FI9_NAYEK v13: Retourner le tableau complet sans modification
    console.log(
      `[FI9] ${messages.length} messages chargés pour session ${sessionId}`
    );
    return messages;
  } catch (error) {
    console.error("[FI9] Erreur récupération messages:", error);
    return [];
  }
}

/**
 * Sauvegarde la session courante
 */
export async function saveCurrentSession(sessionId) {
  try {
    await AsyncStorage.setItem(CURRENT_SESSION_KEY, sessionId || "");
    console.log(`[FI9] Session courante sauvegardée: ${sessionId}`);
  } catch (error) {
    console.error("[FI9] Erreur sauvegarde session courante:", error);
  }
}

/**
 * Récupère la session courante
 */
export async function getCurrentSession() {
  try {
    const sessionId = await AsyncStorage.getItem(CURRENT_SESSION_KEY);
    if (sessionId) {
      console.log(`[FI9] Session courante chargée: ${sessionId}`);
    }
    return sessionId;
  } catch (error) {
    console.error("[FI9] Erreur récupération session courante:", error);
    return null;
  }
}

/**
 * PHASE 3.5: Génère un titre intelligent basé sur les messages
 * Logique inspirée de ChatGPT: court, descriptif, basé sur le contenu
 */
export function generateChatTitle(messages) {
  if (!messages || messages.length === 0) {
    return "Nouveau Chat";
  }

  // Trouver le premier message utilisateur
  const firstUserMessage = messages.find((msg) => msg.role === "user");
  if (!firstUserMessage || !firstUserMessage.content) {
    return "Nouveau Chat";
  }

  const content = firstUserMessage.content.trim();

  // Stop words français (à ignorer pour le titre)
  const stopWords = [
    "le", "la", "les", "un", "une", "des", "de", "du", "je", "tu", "il", "elle",
    "nous", "vous", "ils", "elles", "mon", "ma", "mes", "ton", "ta", "tes",
    "son", "sa", "ses", "ce", "cette", "ces", "et", "ou", "donc", "or", "ni",
    "car", "mais", "est", "sont", "ai", "as", "a", "avons", "avez", "ont",
    "suis", "es", "sommes", "êtes", "dans", "sur", "pour", "par", "avec",
  ];

  // Nettoyer et extraire les mots significatifs
  let words = content
    .toLowerCase()
    .replace(/[?!.,;:()]/g, "") // Enlever ponctuation
    .split(/\s+/) // Séparer par espaces
    .filter((word) => word.length > 2 && !stopWords.includes(word)); // Filtrer stop words

  // Limiter à 3-6 mots pour le titre
  if (words.length > 6) {
    words = words.slice(0, 6);
  }

  // Si aucun mot significatif, utiliser les premiers mots du message
  if (words.length === 0) {
    words = content.split(/\s+/).slice(0, 4);
  }

  // Capitaliser la première lettre de chaque mot
  const title = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Limiter la longueur totale à 40 caractères
  if (title.length > 40) {
    return title.slice(0, 37) + "...";
  }

  return title || "Nouveau Chat";
}

/**
 * Crée une nouvelle session
 */
export async function createNewSession(title = "Nouveau Chat") {
  const sessionId = `session_${Date.now()}`;
  const session = {
    id: sessionId,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastMessage: null,
  };
  await saveSession(session);
  await saveCurrentSession(sessionId);
  return session;
}
