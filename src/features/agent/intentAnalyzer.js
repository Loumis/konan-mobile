/**
 * PHASE B.1 - Intent Analyzer
 * Analyse l'intention et le domaine juridique de l'utilisateur
 * Frontend uniquement - Logique de détection d'intention
 */

/**
 * Domaines juridiques supportés par KONAN
 */
export const LEGAL_DOMAINS = {
  PENAL: {
    id: 'penal',
    name: 'Droit Pénal',
    keywords: [
      'plainte', 'condamnation', 'prison', 'délit', 'crime', 'infraction',
      'vol', 'agression', 'violence', 'meurtre', 'trafic', 'stupéfiants',
      'garde à vue', 'procès pénal', 'tribunal correctionnel', 'cour d\'assises',
      'parquet', 'procureur', 'jugement pénal', 'peine',
    ],
  },
  CIVIL: {
    id: 'civil',
    name: 'Droit Civil',
    keywords: [
      'contrat', 'responsabilité', 'dommages', 'préjudice', 'indemnisation',
      'succession', 'héritage', 'testament', 'divorce', 'séparation',
      'propriété', 'vente', 'achat', 'loyer', 'bail', 'locataire', 'propriétaire',
      'voisinage', 'servitude', 'usufruit', 'obligation', 'dette', 'créance',
      'pension alimentaire', 'garde', 'droit de visite', 'mariage', 'pacs',
    ],
  },
  COMMERCIAL: {
    id: 'commercial',
    name: 'Droit Commercial',
    keywords: [
      'société', 'entreprise', 'sarl', 'sas', 'auto-entrepreneur', 'eurl',
      'associé', 'statuts', 'capital social', 'immatriculation', 'kbis',
      'commerce', 'concurrence', 'marque', 'brevet', 'franchise',
      'faillite', 'liquidation', 'redressement judiciaire',
    ],
  },
  TRAVAIL: {
    id: 'travail',
    name: 'Droit du Travail',
    keywords: [
      'contrat de travail', 'cdi', 'cdd', 'licenciement', 'démission',
      'salaire', 'congés', 'arrêt maladie', 'accident du travail',
      'harcèlement', 'discrimination', 'prud\'hommes', 'employeur',
      'salarié', 'rupture conventionnelle', 'préavis',
    ],
  },
  ADMINISTRATIF: {
    id: 'administratif',
    name: 'Droit Administratif',
    keywords: [
      'administration', 'permis de construire', 'urbanisme', 'expropriation',
      'recours administratif', 'tribunal administratif', 'fonction publique',
      'fonctionnaire', 'service public', 'marchés publics',
    ],
  },
};

/**
 * Niveaux de confiance dans l'analyse
 */
export const CONFIDENCE_LEVELS = {
  HIGH: 'high',     // > 70%
  MEDIUM: 'medium', // 40-70%
  LOW: 'low',       // < 40%
};

/**
 * Analyse l'intention de l'utilisateur
 * @param {string} message - Message de l'utilisateur
 * @returns {Object} - Résultat de l'analyse
 */
export function analyzeIntent(message) {
  if (!message || typeof message !== 'string') {
    return {
      domain: null,
      confidence: CONFIDENCE_LEVELS.LOW,
      keywords: [],
      needsMoreInfo: true,
      reason: 'Message vide ou invalide',
    };
  }

  const normalizedMessage = message.toLowerCase();
  const domainScores = {};

  // Calculer le score pour chaque domaine
  Object.values(LEGAL_DOMAINS).forEach((domain) => {
    const matchedKeywords = domain.keywords.filter((keyword) =>
      normalizedMessage.includes(keyword.toLowerCase())
    );
    domainScores[domain.id] = {
      score: matchedKeywords.length,
      keywords: matchedKeywords,
      domain: domain,
    };
  });

  // Trouver le domaine avec le meilleur score
  const bestMatch = Object.values(domainScores).reduce(
    (best, current) => (current.score > best.score ? current : best),
    { score: 0, keywords: [], domain: null }
  );

  // Déterminer le niveau de confiance
  const totalWords = normalizedMessage.split(/\s+/).length;
  const confidenceRatio = bestMatch.score / Math.max(totalWords / 10, 1);
  
  let confidence = CONFIDENCE_LEVELS.LOW;
  if (confidenceRatio > 0.7) {
    confidence = CONFIDENCE_LEVELS.HIGH;
  } else if (confidenceRatio > 0.4) {
    confidence = CONFIDENCE_LEVELS.MEDIUM;
  }

  // Déterminer si plus d'informations sont nécessaires
  // Amélioration PHASE B.1: Logique plus fine
  const needsMoreInfo = 
    bestMatch.score === 0 || 
    confidence === CONFIDENCE_LEVELS.LOW ||
    (totalWords < 10 && confidence !== CONFIDENCE_LEVELS.HIGH) ||
    // Détecter les questions vagues
    /^(quoi|comment|que|qui|où|quand|pourquoi)\s/i.test(normalizedMessage.trim());

  return {
    domain: bestMatch.domain,
    confidence,
    keywords: bestMatch.keywords,
    needsMoreInfo,
    reason: needsMoreInfo 
      ? 'Informations insuffisantes pour une analyse complète' 
      : null,
  };
}

/**
 * Détermine si le message contient des éléments factuels suffisants
 * @param {string} message - Message de l'utilisateur
 * @returns {Object} - Résultat de l'analyse factuelle
 */
export function analyzeFactualCompleteness(message) {
  const normalizedMessage = message.toLowerCase();
  
  // Indicateurs de complétude factuelle
  const indicators = {
    hasDate: /\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}|hier|aujourd'hui|demain|récemment/.test(normalizedMessage),
    hasAmount: /\d+\s?(€|euros?|dollars?|\$)/.test(normalizedMessage),
    hasLocation: /à|en|dans|sur|chez/.test(normalizedMessage),
    hasParties: /mon|ma|mes|le|la|les|un|une/.test(normalizedMessage),
    hasContext: normalizedMessage.split(/\s+/).length > 15,
  };

  const score = Object.values(indicators).filter(Boolean).length;
  const maxScore = Object.keys(indicators).length;

  return {
    isComplete: score >= 3,
    score,
    maxScore,
    missingElements: Object.entries(indicators)
      .filter(([key, value]) => !value)
      .map(([key]) => key),
    indicators,
  };
}

/**
 * Détecte le niveau d'urgence du message
 * @param {string} message - Message de l'utilisateur
 * @returns {string} - 'high' | 'medium' | 'low'
 */
export function detectUrgency(message) {
  const normalizedMessage = message.toLowerCase();
  
  const urgentKeywords = [
    'urgent', 'immédiat', 'rapidement', 'vite', 'maintenant',
    'aujourd\'hui', 'demain', 'deadline', 'délai',
  ];

  const hasUrgentKeyword = urgentKeywords.some((keyword) =>
    normalizedMessage.includes(keyword)
  );

  if (hasUrgentKeyword) {
    return 'high';
  }

  // Détection implicite (questions, points d'exclamation)
  const hasExclamation = /!/.test(message);
  const hasMultipleQuestions = (message.match(/\?/g) || []).length > 1;

  if (hasExclamation || hasMultipleQuestions) {
    return 'medium';
  }

  return 'low';
}

