# Fix Phase B.1 - Agent KONAN : Questions et Réponses

## Problèmes Identifiés

### 1. L'agent pose des questions mais ne répond jamais
**Symptôme** : L'agent pose des questions à l'utilisateur mais reste bloqué en mode "questions" et ne génère jamais de réponse finale.

**Cause** : 
- Pas de gestion d'état pour suivre si l'agent est en mode "collecte d'informations" ou "prêt à répondre"
- L'agent ne détecte pas quand l'utilisateur répond aux questions
- Pas de transition automatique entre mode questions et mode réponse

### 2. L'agent ne détecte pas la langue de l'utilisateur
**Symptôme** : L'agent répond toujours en français, même si l'utilisateur écrit en arabe.

**Cause** :
- Pas de module de détection de langue
- Pas de formatage du message avec instruction de langue pour le backend

## Corrections Appliquées

### 1. Ajout d'états agent (`AGENT_STATES`)

**Fichier** : `src/features/agent/useAgentLogic.js`

```javascript
export const AGENT_STATES = {
  COLLECTING_INFO: 'collecting_info',  // L'agent pose des questions
  READY_TO_ANSWER: 'ready_to_answer',  // L'agent peut répondre
};
```

**Fonctionnalité** :
- L'agent suit maintenant son état actuel
- Transition automatique de `COLLECTING_INFO` vers `READY_TO_ANSWER` quand l'utilisateur répond

### 2. Détection de langue (`languageDetector.js`)

**Fichier** : `src/features/agent/languageDetector.js`

**Fonctionnalités** :
- `detectLanguage(text)` : Détecte la langue d'un texte (arabe ou français)
  - Utilise regex pour détecter les caractères arabes (Unicode U+0600-U+06FF)
  - Si > 30% de caractères arabes → langue arabe
  - Sinon → français (par défaut)

- `formatMessageWithLanguage(message, targetLanguage)` : Formate un message avec instruction de langue
  - Ajoute `[LANG:ar]` au début du message si langue arabe
  - Permet au backend de répondre dans la bonne langue

**Exemple** :
```javascript
detectLanguage("مرحبا") // → 'ar'
detectLanguage("Bonjour") // → 'fr'
formatMessageWithLanguage("مرحبا", 'ar') // → '[LANG:ar] مرحبا'
```

### 3. Gestion de la transition Questions → Réponse

**Fichier** : `src/features/agent/useAgentLogic.js`

**Logique améliorée** :

1. **Détection de réponse aux questions** :
   ```javascript
   const isAnsweringQuestions = agentState === AGENT_STATES.COLLECTING_INFO &&
     existingMessages.length > 0 &&
     existingMessages[existingMessages.length - 1]?.role === 'assistant' &&
     (existingMessages[existingMessages.length - 1]?.isAgentQuestions || 
      existingMessages[existingMessages.length - 1]?.content?.includes('?'));
   ```

2. **Transition automatique** :
   - Si l'utilisateur répond aux questions → `READY_TO_ANSWER`
   - Si toutes les questions ont été posées → `READY_TO_ANSWER`
   - Si informations complètes → `READY_TO_ANSWER`

3. **Éviter les questions répétées** :
   - Suivi des questions déjà posées (`pendingQuestions`)
   - Filtrage des questions déjà posées avant de générer de nouvelles

### 4. Formatage des messages avec langue

**Fichier** : `src/screens/ChatScreen.jsx`

**Modification** :
```javascript
// Avant envoi au backend, formater avec la langue détectée
const messageWithLanguage = formatUserMessageWithLanguage(content);
const messageToSend = agentAnalysis.role 
  ? formatKonanMessage(messageWithLanguage, agentAnalysis, {})
  : messageWithLanguage;
```

### 5. Garantie de réponse après questions

**Fichier** : `src/screens/ChatScreen.jsx`

**Sécurité ajoutée** :
```javascript
// Si on était en mode questions mais qu'on ne pose plus de questions, forcer le mode réponse
if (agentState === 'collecting_info' && !agentAnalysis.needsQuestions) {
  forceReadyToAnswer();
}
```

## Exemples Avant / Après

### Cas 1 : Message vague → Questions → Réponse

**AVANT** :
```
User: "J'ai un problème"
Agent: "Pouvez-vous me donner plus de détails ?"
User: "C'est un problème de contrat"
Agent: "Pouvez-vous me donner plus de détails ?" (bloqué, re-pose la même question)
```

**APRÈS** :
```
User: "J'ai un problème"
Agent: "Pour mieux vous aider concernant cette situation, pourriez-vous me préciser :
1. Pouvez-vous me donner plus de détails sur votre situation ?
2. Quand cette situation a-t-elle commencé ?"
User: "C'est un problème de contrat qui a commencé il y a 2 mois"
Agent: [Réponse complète avec conseil juridique]
```

### Cas 2 : Message complet → Réponse directe

**AVANT** :
```
User: "Mon employeur m'a licencié sans préavis, que puis-je faire ?"
Agent: "Pouvez-vous me donner plus de détails ?" (pose des questions inutiles)
```

**APRÈS** :
```
User: "Mon employeur m'a licencié sans préavis, que puis-je faire ?"
Agent: [Réponse directe avec conseil juridique]
```

### Cas 3 : Message arabe → Réponse arabe

**AVANT** :
```
User: "مرحبا، لدي مشكلة قانونية"
Agent: "Bonjour, comment puis-je vous aider ?" (répond en français)
```

**APRÈS** :
```
User: "مرحبا، لدي مشكلة قانونية"
Agent: [Réponse en arabe]
```

### Cas 4 : Message français → Réponse française

**AVANT** :
```
User: "Bonjour, j'ai un problème juridique"
Agent: [Réponse en français - OK]
```

**APRÈS** :
```
User: "Bonjour, j'ai un problème juridique"
Agent: [Réponse en français - OK]
```

## Flux de Logique Corrigé

### État Initial
```
agentState = READY_TO_ANSWER
userLanguage = 'fr'
pendingQuestions = []
```

### Étape 1 : Message vague
```
User: "J'ai un problème"
→ detectLanguage() → 'fr'
→ analyzeIntent() → confidence: 'low'
→ shouldAskQuestions() → true
→ agentState = COLLECTING_INFO
→ Questions générées et affichées
```

### Étape 2 : Réponse aux questions
```
User: "C'est un problème de contrat"
→ detectLanguage() → 'fr'
→ isAnsweringQuestions = true (dernier message assistant contenait '?')
→ agentState = READY_TO_ANSWER
→ shouldAskQuestions() → false (informations maintenant complètes)
→ Message envoyé au backend avec [LANG:fr]
→ Réponse générée et affichée
```

### Étape 3 : Message complet
```
User: "Mon employeur m'a licencié sans préavis"
→ detectLanguage() → 'fr'
→ analyzeIntent() → confidence: 'high'
→ shouldAskQuestions() → false
→ agentState = READY_TO_ANSWER
→ Message envoyé directement au backend
→ Réponse générée immédiatement
```

## Fichiers Modifiés

1. **`src/features/agent/languageDetector.js`** (NOUVEAU)
   - Détection de langue (arabe/français)
   - Formatage de message avec instruction de langue

2. **`src/features/agent/useAgentLogic.js`**
   - Ajout de `AGENT_STATES`
   - Ajout de `agentState`, `userLanguage`, `pendingQuestions`
   - Logique de transition questions → réponse
   - Fonction `formatUserMessageWithLanguage()`
   - Fonction `forceReadyToAnswer()`

3. **`src/features/agent/index.js`**
   - Export de `AGENT_STATES`
   - Export des fonctions de détection de langue

4. **`src/screens/ChatScreen.jsx`**
   - Utilisation de `formatUserMessageWithLanguage()`
   - Gestion de l'état `agentState`
   - Sécurité pour forcer le mode réponse si nécessaire

## Tests Effectués

### ✅ Cas vague → questions → réponse
- Message vague déclenche des questions
- Réponse aux questions déclenche une réponse finale
- Pas de blocage en mode questions

### ✅ Cas complet → réponse directe
- Message complet avec informations suffisantes → réponse directe
- Pas de questions inutiles

### ✅ Message arabe → réponse arabe
- Détection correcte de la langue arabe
- Formatage du message avec `[LANG:ar]`
- Backend reçoit l'instruction de langue

### ✅ Message français → réponse française
- Détection correcte de la langue française
- Pas d'instruction de langue ajoutée (français par défaut)

### ✅ Pas de questions répétées
- Les questions déjà posées ne sont pas reposées
- Transition automatique vers réponse si toutes les questions ont été posées

## Garanties

1. **L'agent répond TOUJOURS après enquête**
   - Transition automatique `COLLECTING_INFO` → `READY_TO_ANSWER`
   - Sécurité avec `forceReadyToAnswer()` si nécessaire

2. **L'agent n'est jamais bloqué en mode questions**
   - Détection automatique des réponses aux questions
   - Vérification que les informations sont complètes
   - Force le mode réponse si toutes les questions ont été posées

3. **Détection de langue fiable**
   - Regex Unicode pour caractères arabes
   - Seuil de 30% pour éviter les faux positifs
   - Formatage avec instruction pour le backend

## Prochaines Étapes

1. ✅ Tester avec différents scénarios
2. ⏳ Ajouter support pour d'autres langues (anglais, etc.)
3. ⏳ Améliorer la détection de langue avec ML si nécessaire
4. ⏳ Ajouter analytics pour tracker l'efficacité des questions

## Notes Techniques

- **Détection de langue** : Basée sur regex Unicode, simple et efficace
- **États agent** : Gérés avec `useState` dans le hook
- **Questions en attente** : Stockées dans `pendingQuestions` pour éviter les répétitions
- **Formatage langue** : Instruction `[LANG:ar]` ajoutée au début du message pour le backend

## Impact

### ✅ Résolution des problèmes
- L'agent répond maintenant après avoir posé des questions
- La langue de l'utilisateur est détectée et respectée

### ✅ Améliorations UX
- Expérience plus fluide et naturelle
- Pas de blocage en mode questions
- Réponses dans la langue de l'utilisateur

### ✅ Aucune régression
- Chat fonctionne normalement
- Authentification non affectée
- Rôles Inspecteur/Avocat/Juge toujours fonctionnels

