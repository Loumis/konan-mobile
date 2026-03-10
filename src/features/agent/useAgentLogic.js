/**
 * PHASE B.1 - useAgentLogic Hook
 * Hook principal pour orchestrer la logique de l'agent intelligent
 * Frontend uniquement - Intégration Chat sans régression
 */

import { useState, useCallback, useRef } from 'react';
import { 
  analyzeIntent, 
  analyzeFactualCompleteness, 
  detectUrgency 
} from './intentAnalyzer';
import { 
  generateQuestions, 
  formatQuestionsMessage, 
  shouldAskQuestions 
} from './questionGenerator';
import { 
  selectRole, 
  getRoleTransitionMessage, 
  applyRoleBehavior,
  shouldChangeRole,
  AGENT_ROLES,
} from './roleManager';
import { detectLanguage, formatMessageWithLanguage } from './languageDetector';

/**
 * États de l'agent
 */
export const AGENT_STATES = {
  COLLECTING_INFO: 'collecting_info',  // L'agent pose des questions
  READY_TO_ANSWER: 'ready_to_answer',  // L'agent peut répondre
};

/**
 * Hook principal pour la logique agent
 */
export function useAgentLogic() {
  const [currentRole, setCurrentRole] = useState(null);
  const [agentState, setAgentState] = useState(AGENT_STATES.READY_TO_ANSWER);
  const [userLanguage, setUserLanguage] = useState('fr'); // Langue détectée de l'utilisateur
  const [pendingQuestions, setPendingQuestions] = useState([]); // Questions posées en attente de réponse
  const conversationHistoryRef = useRef([]);

  /**
   * Analyse un message utilisateur et détermine la stratégie de réponse
   * @param {string} userMessage - Message de l'utilisateur
   * @param {Array} existingMessages - Messages existants dans la conversation
   * @returns {Object} - Stratégie de réponse
   */
  const analyzeUserMessage = useCallback((userMessage, existingMessages = []) => {
    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return {
        intent: { domain: null, confidence: 'low', needsMoreInfo: true },
        factualAnalysis: { isComplete: false, score: 0 },
        urgency: 'low',
        needsQuestions: true,
        questions: [],
        questionsMessage: null,
        role: AGENT_ROLES.INSPECTEUR,
        roleChanged: false,
        roleTransitionMessage: null,
        userLanguage: 'fr',
        agentState: AGENT_STATES.COLLECTING_INFO,
      };
    }

    // Mettre à jour l'historique
    conversationHistoryRef.current = existingMessages;

    // 1. Détecter la langue de l'utilisateur
    const detectedLanguage = detectLanguage(userMessage);
    setUserLanguage(detectedLanguage);

    // 2. Analyser l'intention
    const intent = analyzeIntent(userMessage);

    // 3. Analyser la complétude factuelle
    const factualAnalysis = analyzeFactualCompleteness(userMessage);

    // 4. Détecter l'urgence
    const urgency = detectUrgency(userMessage);

    // 5. PHASE B.1 FIX: Gérer l'état de l'agent
    // Si on est en mode COLLECTING_INFO et que l'utilisateur répond, passer en READY_TO_ANSWER
    const isAnsweringQuestions = agentState === AGENT_STATES.COLLECTING_INFO &&
      existingMessages.length > 0 &&
      existingMessages[existingMessages.length - 1]?.role === 'assistant' &&
      (existingMessages[existingMessages.length - 1]?.isAgentQuestions || 
       existingMessages[existingMessages.length - 1]?.content?.includes('?'));

    // Si l'utilisateur répond aux questions, on passe en mode réponse
    if (isAnsweringQuestions) {
      setAgentState(AGENT_STATES.READY_TO_ANSWER);
      setPendingQuestions([]); // Réinitialiser les questions en attente
    }

    // 6. Déterminer si des questions sont nécessaires
    // Ne pas poser de questions si :
    // - On est déjà en mode READY_TO_ANSWER (l'utilisateur a répondu)
    // - L'utilisateur répond déjà à des questions
    // - Les informations sont complètes
    let shouldAsk = agentState === AGENT_STATES.READY_TO_ANSWER 
      ? false // Ne plus poser de questions si on est prêt à répondre
      : !isAnsweringQuestions && shouldAskQuestions(intent, factualAnalysis);

    // 7. Sélectionner le rôle approprié
    const newRole = selectRole(intent, factualAnalysis, existingMessages);

    // 8. Vérifier si changement de rôle
    const roleChanged = shouldChangeRole(currentRole, newRole);
    if (roleChanged) {
      setCurrentRole(newRole);
    }

    // 9. Générer les questions si nécessaire
    let questions = [];
    let questionsMessage = null;
    let finalAgentState = agentState;
    
    if (shouldAsk) {
      // Éviter de reposer les mêmes questions
      const previousQuestions = pendingQuestions;
      questions = generateQuestions(intent, factualAnalysis, existingMessages);
      
      // Filtrer les questions déjà posées
      const newQuestions = questions.filter(q => 
        !previousQuestions.some(pq => pq.toLowerCase() === q.toLowerCase())
      );

      if (newQuestions.length > 0) {
        questions = newQuestions;
        questionsMessage = formatQuestionsMessage(questions, intent);
        setPendingQuestions([...previousQuestions, ...questions]);
        finalAgentState = AGENT_STATES.COLLECTING_INFO;
      } else {
        // Si toutes les questions ont déjà été posées, passer en mode réponse
        setAgentState(AGENT_STATES.READY_TO_ANSWER);
        finalAgentState = AGENT_STATES.READY_TO_ANSWER;
        shouldAsk = false;
      }
    } else {
      // Si on ne pose pas de questions, on est prêt à répondre
      if (agentState === AGENT_STATES.COLLECTING_INFO) {
        setAgentState(AGENT_STATES.READY_TO_ANSWER);
        finalAgentState = AGENT_STATES.READY_TO_ANSWER;
      }
    }

    return {
      intent,
      factualAnalysis,
      urgency,
      needsQuestions: shouldAsk,
      questions,
      questionsMessage,
      role: newRole,
      roleChanged,
      roleTransitionMessage: roleChanged ? getRoleTransitionMessage(newRole, currentRole) : null,
      userLanguage: detectedLanguage,
      agentState: finalAgentState,
    };
  }, [currentRole, agentState, pendingQuestions]);

  /**
   * Prépare un message KONAN avec le bon formatage selon le rôle
   * @param {string} baseMessage - Message de base (réponse API)
   * @param {Object} analysis - Résultat de l'analyse
   * @param {Object} context - Contexte additionnel
   * @returns {string} - Message formaté
   */
  const formatKonanMessage = useCallback((baseMessage, analysis, context = {}) => {
    if (!analysis.role) {
      return baseMessage;
    }

    // Si KONAN doit poser des questions, retourner le message de questions
    if (analysis.needsQuestions && analysis.questionsMessage) {
      return analysis.questionsMessage;
    }

    // Sinon, appliquer le comportement du rôle
    return applyRoleBehavior(analysis.role, baseMessage, context);
  }, []);

  /**
   * Formate un message utilisateur avec la langue détectée
   * @param {string} message - Message de l'utilisateur
   * @returns {string} - Message formaté avec instruction de langue
   */
  const formatUserMessageWithLanguage = useCallback((message) => {
    return formatMessageWithLanguage(message, userLanguage);
  }, [userLanguage]);

  /**
   * Obtient le rôle actuel
   * @returns {Object|null} - Rôle actuel
   */
  const getCurrentRole = useCallback(() => {
    return currentRole;
  }, [currentRole]);

  /**
   * Force un changement de rôle (pour debug ou cas spécifiques)
   * @param {string} roleId - ID du rôle
   */
  const forceRole = useCallback((roleId) => {
    const role = Object.values(AGENT_ROLES).find((r) => r.id === roleId);
    if (role) {
      setCurrentRole(role);
    }
  }, []);

  /**
   * Réinitialise l'état de l'agent (nouvelle conversation)
   */
  const resetAgent = useCallback(() => {
    setCurrentRole(null);
    setAgentState(AGENT_STATES.READY_TO_ANSWER);
    setUserLanguage('fr');
    setPendingQuestions([]);
    conversationHistoryRef.current = [];
  }, []);

  /**
   * Force l'agent à passer en mode réponse (pour éviter les blocages)
   */
  const forceReadyToAnswer = useCallback(() => {
    setAgentState(AGENT_STATES.READY_TO_ANSWER);
    setPendingQuestions([]);
  }, []);

  return {
    analyzeUserMessage,
    formatKonanMessage,
    formatUserMessageWithLanguage,
    getCurrentRole,
    forceRole,
    resetAgent,
    forceReadyToAnswer,
    currentRole,
    agentState,
    userLanguage,
  };
}

