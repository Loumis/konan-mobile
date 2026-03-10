# PHASE B.1 - Logique Agent KONAN

**Date**: 2025-12-17  
**Version**: 1.0.0  
**Status**: Frontend uniquement - Prêt pour intégration backend

---

## Vue d'ensemble

L'agent KONAN est un système intelligent frontend qui :
1. **Détecte l'intention** de l'utilisateur et le domaine juridique
2. **Pose des questions** avant de répondre si nécessaire
3. **Adopte dynamiquement un rôle** (Inspecteur/Avocat/Juge) selon le contexte

---

## Architecture

```
src/features/agent/
├── intentAnalyzer.js      → Détection intention + domaine juridique
├── questionGenerator.js   → Génération questions ciblées
├── roleManager.js         → Gestion rôles dynamiques
├── useAgentLogic.js       → Hook principal orchestration
└── index.js              → Exports centralisés
```

---

## 1. Détection d'Intention (`intentAnalyzer.js`)

### Domaines juridiques supportés

- **Droit Pénal** : plainte, condamnation, prison, délit, crime...
- **Droit Civil** : contrat, responsabilité, divorce, succession...
- **Droit Commercial** : société, entreprise, SARL, SAS...
- **Droit du Travail** : contrat de travail, licenciement, prud'hommes...
- **Droit Administratif** : administration, permis, urbanisme...

### Fonctions principales

#### `analyzeIntent(message)`
Analyse le message utilisateur et détermine :
- Le domaine juridique (ou `null` si non identifié)
- Le niveau de confiance (`high` | `medium` | `low`)
- Les mots-clés détectés
- Si plus d'informations sont nécessaires

**Exemple** :
```javascript
const intent = analyzeIntent("J'ai reçu une plainte pour vol");
// {
//   domain: { id: 'penal', name: 'Droit Pénal', ... },
//   confidence: 'high',
//   keywords: ['plainte', 'vol'],
//   needsMoreInfo: false
// }
```

#### `analyzeFactualCompleteness(message)`
Vérifie si le message contient suffisamment d'informations factuelles :
- Date (`hasDate`)
- Montant (`hasAmount`)
- Lieu (`hasLocation`)
- Parties (`hasParties`)
- Contexte (`hasContext`)

**Retourne** :
- `isComplete` : boolean
- `score` : nombre d'indicateurs présents (0-5)
- `missingElements` : liste des éléments manquants

#### `detectUrgency(message)`
Détecte le niveau d'urgence : `high` | `medium` | `low`

---

## 2. Génération de Questions (`questionGenerator.js`)

### Logique

KONAN pose des questions **avant de répondre** si :
- Confiance faible (`confidence === 'low'`)
- Informations factuelles incomplètes (`!factualAnalysis.isComplete`)
- Confiance moyenne + score factuel < 4

### Templates de questions

Chaque domaine juridique a des templates de questions spécifiques :

**Exemple Droit Pénal** :
- Context : "Pouvez-vous me décrire précisément les faits ?"
- Parties : "Qui sont les personnes impliquées ?"
- Procedure : "Avez-vous été convoqué(e) par la police ?"

### Fonctions principales

#### `generateQuestions(intent, factualAnalysis, conversationHistory)`
Génère 2-3 questions ciblées selon :
- Le domaine juridique détecté
- Les éléments factuels manquants
- L'historique de conversation

#### `formatQuestionsMessage(questions, intent)`
Formate les questions en message naturel pour KONAN.

**Exemple** :
```
Pour mieux vous aider concernant **Droit Pénal**, pourriez-vous me préciser :

1. Pouvez-vous me décrire précisément les faits ?
2. Quand cette situation s'est-elle produite ?
3. Qui sont les personnes impliquées ?

Ces précisions m'aideront à vous donner un conseil plus adapté à votre situation.
```

---

## 3. Rôles Dynamiques (`roleManager.js`)

### Les 3 rôles de KONAN

#### 🔍 **INSPECTEUR** (Phase 1 : Collecte)
- **Comportement** : Pose des questions, collecte des informations
- **Quand** : Informations insuffisantes, début de conversation
- **Couleur** : `#4A90E2` (Bleu)

#### ⚖️ **AVOCAT** (Phase 2 : Conseil)
- **Comportement** : Donne des conseils, propose des stratégies
- **Quand** : Utilisateur demande "que faire", "comment", "conseil"
- **Couleur** : `#10A37F` (Vert)

#### ⚡ **JUGE** (Phase 3 : Évaluation)
- **Comportement** : Analyse neutre, évaluation objective
- **Quand** : Utilisateur demande "avis", "chances", "risques"
- **Couleur** : `#7B61FF` (Violet)

### Logique de sélection

```javascript
// Phase 1 : Collecte → INSPECTEUR
if (intent.needsMoreInfo || !factualAnalysis.isComplete) {
  return AGENT_ROLES.INSPECTEUR;
}

// Phase 2 : Conseil → AVOCAT
if (isAskingForAdvice) {
  return AGENT_ROLES.AVOCAT;
}

// Phase 3 : Évaluation → JUGE
if (isAskingForEvaluation) {
  return AGENT_ROLES.JUGE;
}

// Par défaut : AVOCAT
return AGENT_ROLES.AVOCAT;
```

### Transitions de rôles

Les changements de rôle sont annoncés discrètement :
```
🔍 KONAN passe en mode Inspecteur
Collecte d'informations et analyse des faits
```

---

## 4. Hook Principal (`useAgentLogic.js`)

### Utilisation

```javascript
import { useAgentLogic } from '../features/agent';

const { 
  analyzeUserMessage,    // Analyser un message utilisateur
  formatKonanMessage,   // Formater réponse selon rôle
  getCurrentRole,        // Obtenir rôle actuel
  resetAgent,            // Réinitialiser (nouvelle conversation)
  currentRole            // Rôle actuel (state)
} = useAgentLogic();
```

### `analyzeUserMessage(userMessage, existingMessages)`

Analyse complète d'un message utilisateur et retourne :

```javascript
{
  intent: {
    domain: { id, name, keywords },
    confidence: 'high' | 'medium' | 'low',
    needsMoreInfo: boolean
  },
  factualAnalysis: {
    isComplete: boolean,
    score: number,
    missingElements: string[]
  },
  urgency: 'high' | 'medium' | 'low',
  needsQuestions: boolean,
  questions: string[],
  questionsMessage: string | null,
  role: AGENT_ROLES.*,
  roleChanged: boolean,
  roleTransitionMessage: string | null
}
```

### `formatKonanMessage(baseMessage, analysis, context)`

Formate un message selon le rôle :
- Si `needsQuestions` : retourne le message de questions
- Sinon : applique le comportement du rôle (préfixe, formatage)

---

## 5. Intégration dans ChatScreen

### Flux de traitement

```
1. Utilisateur envoie message
   ↓
2. analyzeUserMessage() analyse le message
   ↓
3. Si needsQuestions === true
   → Afficher questionsMessage (pas d'appel API)
   ↓
4. Sinon
   → Appeler API avec message formaté
   → Appliquer formatKonanMessage() à la réponse
   ↓
5. Afficher réponse formatée selon rôle
```

### Code d'intégration

```javascript
// Dans handleSendMessage
const agentAnalysis = analyzeUserMessage(content, existingMessages);

// Si questions nécessaires, les afficher
if (agentAnalysis.needsQuestions && agentAnalysis.questionsMessage) {
  // Afficher questionsMessage (pas d'appel API)
  return;
}

// Sinon, envoyer à l'API avec contexte
const messageToSend = formatKonanMessage(content, agentAnalysis, {});
const response = await sendMessage(messageToSend, token, sessionId);

// Formater la réponse selon le rôle
const formattedResponse = formatKonanMessage(response.content, agentAnalysis, {});
```

---

## 6. Comportements par Rôle

### Inspecteur 🔍
- **Préfixe** : "🔍 **Analyse en cours...**"
- **Action** : Pose des questions ciblées
- **Message** : Questions formatées

### Avocat ⚖️
- **Préfixe** : "⚖️ **Conseil juridique**"
- **Action** : Donne des conseils et recommandations
- **Message** : Réponse + section "Mes recommandations" (si contexte)

### Juge ⚡
- **Préfixe** : "⚡ **Évaluation juridique**"
- **Action** : Analyse neutre et objective
- **Message** : Réponse + section "Points clés" (si contexte)

---

## 7. Exemples d'utilisation

### Exemple 1 : Message vague → Questions

**Input** : "J'ai un problème juridique"

**Analyse** :
- Domain: `null` (non identifié)
- Confidence: `low`
- NeedsQuestions: `true`

**Réponse KONAN** :
```
Pour mieux vous aider, pourriez-vous me préciser :

1. Pouvez-vous me donner plus de détails sur votre situation ?
2. Quand cette situation a-t-elle commencé ?
3. Quelles sont les parties impliquées ?

Ces précisions m'aideront à vous donner un conseil plus adapté.
```

### Exemple 2 : Message complet → Rôle Avocat

**Input** : "Mon employeur m'a licencié sans motif, que faire ?"

**Analyse** :
- Domain: `travail` (Droit du Travail)
- Confidence: `high`
- NeedsQuestions: `false`
- Role: `AVOCAT`

**Réponse KONAN** :
```
⚖️ **Conseil juridique**

[Réponse API formatée avec préfixe Avocat]
```

### Exemple 3 : Transition de rôle

**Conversation** :
1. User: "J'ai un problème" → KONAN (Inspecteur) pose questions
2. User: "Mon voisin fait du bruit" → KONAN (Inspecteur) pose questions
3. User: "Que puis-je faire ?" → KONAN passe en mode **Avocat**

**Message système** :
```
⚖️ KONAN passe en mode Avocat
Conseil juridique et stratégie de défense
```

---

## 8. Configuration et Personnalisation

### Ajouter un domaine juridique

Dans `intentAnalyzer.js` :
```javascript
export const LEGAL_DOMAINS = {
  // ... domaines existants
  NOUVEAU_DOMAINE: {
    id: 'nouveau',
    name: 'Droit Nouveau',
    keywords: ['mot-clé1', 'mot-clé2', ...],
  },
};
```

### Ajouter des templates de questions

Dans `questionGenerator.js` :
```javascript
const QUESTION_TEMPLATES = {
  // ... templates existants
  nouveau: {
    context: ["Question contexte..."],
    parties: ["Question parties..."],
  },
};
```

### Personnaliser les rôles

Dans `roleManager.js` :
```javascript
export const AGENT_ROLES = {
  // Modifier comportement, couleur, description...
  INSPECTEUR: {
    // ...
    behavior: {
      askQuestions: true,
      // ...
    },
  },
};
```

---

## 9. Limitations Frontend

⚠️ **Frontend uniquement** - Limitations actuelles :

- Pas de contexte sémantique profond (analyse basée sur mots-clés)
- Pas de mémoire conversationnelle avancée
- Pas d'apprentissage des préférences utilisateur
- Questions génériques si domaine non identifié

✅ **Prêt pour intégration backend** :
- Tous les hooks sont structurés pour accepter des données backend
- La logique peut être enrichie avec IA/ML backend
- Les questions peuvent être générées par LLM backend

---

## 10. Tests et Validation

### Scénarios de test

1. **Message vague** → Doit poser des questions
2. **Message complet** → Doit répondre directement
3. **Changement de contexte** → Doit changer de rôle
4. **Réponse aux questions** → Ne doit pas reposer les mêmes questions
5. **Nouvelle conversation** → Doit réinitialiser l'agent

### Validation UX

- ✅ Questions discrètes (2-3 max)
- ✅ Transitions de rôles fluides
- ✅ Messages naturels et non intrusifs
- ✅ Pas de régression Chat/Voice

---

## 11. Roadmap Future

### Backend Integration
- [ ] Enrichir analyse d'intention avec NLP/ML
- [ ] Générer questions avec LLM
- [ ] Mémoire conversationnelle persistante
- [ ] Apprentissage des préférences utilisateur

### Améliorations UX
- [ ] Suggestions de réponses rapides
- [ ] Indicateur visuel du rôle actif
- [ ] Historique des rôles dans la conversation
- [ ] Personnalisation des rôles par utilisateur

---

## Conclusion

L'agent KONAN est un système intelligent frontend qui améliore l'expérience utilisateur en :
- Posant des questions pertinentes avant de répondre
- S'adaptant au contexte avec des rôles dynamiques
- Fournissant des conseils plus précis et adaptés

**Status** : ✅ Prêt pour production (frontend)  
**Next** : Intégration backend pour enrichir l'intelligence

