/**
 * PHASE B.1 - Question Generator
 * Génère des questions ciblées pour compléter les informations manquantes
 * Frontend uniquement - UX discrète et fiable
 */

import { LEGAL_DOMAINS } from './intentAnalyzer';

/**
 * Templates de questions par domaine juridique
 */
const QUESTION_TEMPLATES = {
  penal: {
    context: [
      "Pouvez-vous me décrire précisément les faits ?",
      "Quand cette situation s'est-elle produite ?",
      "Où cela s'est-il passé exactement ?",
    ],
    parties: [
      "Qui sont les personnes impliquées ?",
      "Avez-vous déjà porté plainte ?",
      "Y a-t-il des témoins ?",
    ],
    procedure: [
      "Avez-vous été convoqué(e) par la police ou la justice ?",
      "Un avocat vous assiste-t-il déjà ?",
      "Y a-t-il une procédure en cours ?",
    ],
  },
  civil: {
    context: [
      "Pouvez-vous me donner plus de détails sur votre situation ?",
      "Depuis quand cette situation dure-t-elle ?",
      "Quel est l'objet du litige ?",
    ],
    parties: [
      "Qui est l'autre partie concernée ?",
      "Existe-t-il un contrat écrit ?",
      "Avez-vous des preuves ou documents ?",
    ],
    financial: [
      "Quel est le montant en jeu ?",
      "Y a-t-il eu des paiements effectués ?",
      "Quels sont les préjudices subis ?",
    ],
  },
  commercial: {
    context: [
      "Quel type de société envisagez-vous ?",
      "Quelle est votre activité commerciale ?",
      "Combien d'associés serez-vous ?",
    ],
    financial: [
      "Quel capital social prévoyez-vous ?",
      "Quel est votre chiffre d'affaires estimé ?",
    ],
    legal: [
      "Avez-vous déjà rédigé les statuts ?",
      "Souhaitez-vous protéger une marque ou un brevet ?",
    ],
  },
  travail: {
    context: [
      "Quel type de contrat de travail avez-vous ?",
      "Depuis combien de temps êtes-vous employé(e) ?",
      "Quelle est la raison du litige ?",
    ],
    employer: [
      "Quelle est la taille de l'entreprise ?",
      "Y a-t-il eu des avertissements écrits ?",
      "Avez-vous contacté les délégués du personnel ?",
    ],
    procedure: [
      "Souhaitez-vous saisir les prud'hommes ?",
      "Avez-vous des preuves (emails, témoignages) ?",
    ],
  },
  administratif: {
    context: [
      "Quelle administration est concernée ?",
      "Quelle décision contestez-vous ?",
      "Quand avez-vous reçu cette décision ?",
    ],
    procedure: [
      "Avez-vous fait un recours gracieux ?",
      "Quel est le délai pour agir ?",
      "Souhaitez-vous saisir le tribunal administratif ?",
    ],
  },
};

/**
 * Questions génériques (utilisées si domaine non identifié)
 */
const GENERIC_QUESTIONS = [
  "Pouvez-vous me donner plus de détails sur votre situation ?",
  "Quand cette situation a-t-elle commencé ?",
  "Quelles sont les parties impliquées ?",
  "Avez-vous des documents ou preuves à ce sujet ?",
  "Quel est votre objectif principal dans cette affaire ?",
];

/**
 * Génère des questions ciblées selon le domaine et le contexte
 * @param {Object} intent - Résultat de l'analyse d'intention
 * @param {Object} factualAnalysis - Résultat de l'analyse factuelle
 * @param {Array} conversationHistory - Historique de la conversation
 * @returns {Array<string>} - Liste de questions à poser
 */
export function generateQuestions(intent, factualAnalysis, conversationHistory = []) {
  const questions = [];

  // Si aucun domaine identifié, poser des questions génériques
  if (!intent.domain) {
    return GENERIC_QUESTIONS.slice(0, 3);
  }

  const domainId = intent.domain.id;
  const templates = QUESTION_TEMPLATES[domainId] || {};

  // Analyser les éléments manquants
  const missingElements = factualAnalysis.missingElements || [];

  // Sélectionner les questions selon les éléments manquants
  if (missingElements.includes('hasDate') || missingElements.includes('hasContext')) {
    const contextQuestions = templates.context || [];
    questions.push(...contextQuestions.slice(0, 1));
  }

  if (missingElements.includes('hasParties')) {
    const partiesQuestions = templates.parties || [];
    questions.push(...partiesQuestions.slice(0, 1));
  }

  if (missingElements.includes('hasAmount')) {
    const financialQuestions = templates.financial || [];
    questions.push(...financialQuestions.slice(0, 1));
  }

  // Toujours demander si une procédure est en cours
  if (templates.procedure && conversationHistory.length < 3) {
    questions.push(templates.procedure[0]);
  }

  // Si pas assez de questions, ajouter des génériques
  if (questions.length < 2) {
    questions.push(...GENERIC_QUESTIONS.slice(0, 2 - questions.length));
  }

  // PHASE B.1: Limiter à 2-3 questions max pour UX discrète
  // Éviter de surcharger l'utilisateur
  return questions.slice(0, Math.min(3, questions.length));
}

/**
 * Crée un message KONAN avec les questions
 * PHASE B.1: Message plus naturel et discrèt
 * @param {Array<string>} questions - Liste de questions
 * @param {Object} intent - Résultat de l'analyse d'intention
 * @returns {string} - Message formaté pour KONAN
 */
export function formatQuestionsMessage(questions, intent) {
  if (!questions || questions.length === 0) {
    return null;
  }

  const domainName = intent.domain ? intent.domain.name : 'cette situation';
  
  // PHASE B.1: Message plus naturel et moins intrusif
  let message = `Pour mieux vous aider concernant **${domainName}**, pourriez-vous me préciser :\n\n`;
  
  questions.forEach((question, index) => {
    message += `${index + 1}. ${question}\n`;
  });

  message += `\nCes précisions m'aideront à vous donner un conseil plus adapté à votre situation.`;

  return message;
}

/**
 * Détermine si KONAN doit poser des questions ou répondre directement
 * @param {Object} intent - Résultat de l'analyse d'intention
 * @param {Object} factualAnalysis - Résultat de l'analyse factuelle
 * @returns {boolean} - true si des questions sont nécessaires
 */
export function shouldAskQuestions(intent, factualAnalysis) {
  // Si confiance faible, toujours poser des questions
  if (intent.confidence === 'low') {
    return true;
  }

  // Si informations factuelles incomplètes
  if (!factualAnalysis.isComplete) {
    return true;
  }

  // Si confiance moyenne et score factuel < 4
  if (intent.confidence === 'medium' && factualAnalysis.score < 4) {
    return true;
  }

  // Sinon, répondre directement
  return false;
}

