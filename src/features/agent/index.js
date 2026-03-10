/**
 * KONAN Mobile v2 — Agent Module Exports
 * Point d'entrée central pour le module agent intelligent
 */

export { useAgentLogic, AGENT_STATES } from './useAgentLogic';
export { analyzeIntent, analyzeFactualCompleteness, detectUrgency, LEGAL_DOMAINS } from './intentAnalyzer';
export { generateQuestions, formatQuestionsMessage, shouldAskQuestions } from './questionGenerator';
export { selectRole, getRoleTransitionMessage, applyRoleBehavior, AGENT_ROLES } from './roleManager';
export { detectLanguage, formatMessageWithLanguage, extractLanguageFromMessage } from './languageDetector';

