/**
 * PHASE B.1 - Language Detector
 * Détection de la langue de l'utilisateur (arabe / français)
 * Frontend uniquement - Détection automatique
 */

/**
 * Détecte la langue d'un texte
 * @param {string} text - Texte à analyser
 * @returns {string} - 'ar' pour arabe, 'fr' pour français (par défaut)
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return 'fr'; // Par défaut français
  }

  // Regex pour détecter les caractères arabes
  // Plage Unicode arabe : U+0600 à U+06FF
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  // Compter les caractères arabes dans le texte
  const arabicMatches = text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g);
  const arabicCount = arabicMatches ? arabicMatches.length : 0;
  const totalChars = text.replace(/\s/g, '').length;
  
  // Si plus de 30% de caractères arabes, considérer comme arabe
  const arabicRatio = totalChars > 0 ? arabicCount / totalChars : 0;
  
  if (arabicRatio > 0.3 || arabicRegex.test(text)) {
    return 'ar';
  }

  // Par défaut : français
  return 'fr';
}

/**
 * Formate un message pour forcer une langue de réponse
 * Ajoute une instruction au début du message pour le backend
 * @param {string} message - Message original
 * @param {string} targetLanguage - Langue cible ('ar' ou 'fr')
 * @returns {string} - Message formaté avec instruction de langue
 */
export function formatMessageWithLanguage(message, targetLanguage) {
  if (!message || typeof message !== 'string') {
    return message;
  }

  // Si la langue cible est déjà la langue par défaut (français), ne rien ajouter
  if (targetLanguage === 'fr') {
    return message;
  }

  // Ajouter une instruction discrète pour le backend
  // Format: [LANG:ar] message original
  if (targetLanguage === 'ar') {
    return `[LANG:ar] ${message}`;
  }

  return message;
}

/**
 * Extrait la langue d'un message formaté
 * @param {string} message - Message formaté
 * @returns {string} - Langue détectée ('ar' ou 'fr')
 */
export function extractLanguageFromMessage(message) {
  if (!message || typeof message !== 'string') {
    return 'fr';
  }

  const langMatch = message.match(/\[LANG:(ar|fr)\]/);
  if (langMatch) {
    return langMatch[1];
  }

  return detectLanguage(message);
}

