/**
 * PHASE B.1 - Role Manager
 * Gestion des rôles dynamiques de KONAN (Inspecteur, Avocat, Juge)
 * Frontend uniquement - Transitions fluides et discrètes
 */

/**
 * Rôles disponibles pour KONAN
 */
export const AGENT_ROLES = {
  INSPECTEUR: {
    id: 'inspecteur',
    name: 'Inspecteur',
    icon: '🔍',
    description: 'Collecte d\'informations et analyse des faits',
    color: '#4A90E2',
    behavior: {
      askQuestions: true,
      provideAdvice: false,
      analyzeFacts: true,
      giveOpinion: false,
    },
  },
  AVOCAT: {
    id: 'avocat',
    name: 'Avocat',
    icon: '⚖️',
    description: 'Conseil juridique et stratégie de défense',
    color: '#10A37F',
    behavior: {
      askQuestions: false,
      provideAdvice: true,
      analyzeFacts: true,
      giveOpinion: true,
    },
  },
  JUGE: {
    id: 'juge',
    name: 'Juge',
    icon: '⚡',
    description: 'Analyse neutre et évaluation objective',
    color: '#7B61FF',
    behavior: {
      askQuestions: false,
      provideAdvice: false,
      analyzeFacts: true,
      giveOpinion: true,
    },
  },
};

/**
 * Détermine le rôle approprié selon le contexte
 * @param {Object} intent - Résultat de l'analyse d'intention
 * @param {Object} factualAnalysis - Résultat de l'analyse factuelle
 * @param {Array} conversationHistory - Historique de la conversation
 * @returns {Object} - Rôle sélectionné
 */
export function selectRole(intent, factualAnalysis, conversationHistory = []) {
  // Phase 1 : Collecte d'informations → INSPECTEUR
  if (intent.needsMoreInfo || !factualAnalysis.isComplete) {
    return AGENT_ROLES.INSPECTEUR;
  }

  // Phase 2 : Conseil et stratégie → AVOCAT
  // Détecter si l'utilisateur demande un conseil ou une action
  const userMessage = conversationHistory[conversationHistory.length - 1]?.text || '';
  const isAskingForAdvice = /que faire|comment|dois-je|puis-je|conseil|aide|recommand/i.test(userMessage);
  
  if (isAskingForAdvice) {
    return AGENT_ROLES.AVOCAT;
  }

  // Phase 3 : Évaluation neutre → JUGE
  // Détecter si l'utilisateur demande une évaluation ou un avis neutre
  const isAskingForEvaluation = /avis|pensez-vous|selon vous|chances|risques|évaluation/i.test(userMessage);
  
  if (isAskingForEvaluation) {
    return AGENT_ROLES.JUGE;
  }

  // Par défaut : AVOCAT (conseil)
  return AGENT_ROLES.AVOCAT;
}

/**
 * Génère un message système pour annoncer le changement de rôle
 * @param {Object} role - Nouveau rôle
 * @param {Object} previousRole - Rôle précédent (optionnel)
 * @returns {string} - Message système
 */
export function getRoleTransitionMessage(role, previousRole = null) {
  if (!previousRole) {
    return `${role.icon} **KONAN • Mode ${role.name}**\n${role.description}`;
  }

  if (previousRole.id === role.id) {
    return null; // Pas de changement
  }

  return `${role.icon} **KONAN passe en mode ${role.name}**\n${role.description}`;
}

/**
 * Applique le comportement du rôle au message de réponse
 * @param {Object} role - Rôle actuel
 * @param {string} baseMessage - Message de base
 * @param {Object} context - Contexte additionnel
 * @returns {string} - Message adapté au rôle
 */
export function applyRoleBehavior(role, baseMessage, context = {}) {
  // FI9_NAYEK: ChatGPT-style - no prefixes, no markdown headers
  // Role behavior is UI-only (badge/indicator), not in message text
  return baseMessage;
}

/**
 * Détermine si un changement de rôle est nécessaire
 * @param {Object} currentRole - Rôle actuel
 * @param {Object} newRole - Nouveau rôle suggéré
 * @returns {boolean} - true si changement nécessaire
 */
export function shouldChangeRole(currentRole, newRole) {
  return currentRole?.id !== newRole.id;
}

/**
 * Obtient des exemples de questions/actions par rôle
 * @param {Object} role - Rôle
 * @returns {Array<string>} - Exemples
 */
export function getRoleExamples(role) {
  const examples = {
    inspecteur: [
      "Pouvez-vous me donner plus de détails ?",
      "Quand cela s'est-il produit ?",
      "Avez-vous des preuves ?",
    ],
    avocat: [
      "Je vous conseille de...",
      "Voici les options qui s'offrent à vous...",
      "Les risques juridiques sont les suivants...",
    ],
    juge: [
      "D'un point de vue juridique objectif...",
      "Les chances de succès sont estimées à...",
      "Les points faibles de votre dossier sont...",
    ],
  };

  return examples[role.id] || [];
}

