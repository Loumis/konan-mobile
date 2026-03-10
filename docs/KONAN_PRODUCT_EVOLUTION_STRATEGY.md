# 🎯 KONAN MOBILE V2 — STRATÉGIE D'ÉVOLUTION PRODUIT

**Date** : 17 décembre 2025  
**Version** : 1.0  
**Auteur** : Architecte Produit + IA Conversationnelle  

---

## 🎯 VISION PRODUIT

Transformer KONAN en un **agent juridique intelligent**, différencié de ChatGPT, avec une UX premium et une logique conversationnelle avancée.

### Objectifs Business
- ✅ **Monétisation** : Free vs Premium claire
- ✅ **Différenciation** : Agent juridique, pas chatbot générique
- ✅ **Crédibilité** : Zéro hallucination, fiabilité mesurable
- ✅ **UX Premium** : Thème adaptatif, flows modernes

---

## 📦 PHASES DE DÉVELOPPEMENT

### **PHASE A — FONDATIONS UX** (Priorité 1)

#### A.1 — Système de Thème Global
**Objectif** : Implémenter un thème jour/nuit adaptatif.

**Livrables** :
- `src/contexts/ThemeContext.jsx` : Provider global
- `src/hooks/useTheme.js` : Hook d'accès au thème
- `src/styles/themes.js` : Définitions light/dark
- Switch automatique selon heure système
- Toggle manuel dans Settings

**Impact** :
- Tous les composants UI suivent le thème
- Cohérence visuelle totale
- Accessibilité améliorée

---

#### A.2 — Écrans Produit
**Objectif** : Présenter KONAN et ses conditions.

**Écrans à créer** :
1. **AboutKonanScreen.jsx** : Présentation KONAN
   - Qu'est-ce que KONAN ?
   - Pourquoi différent de ChatGPT ?
   - Domaines d'expertise
   - Limites et avertissements

2. **TermsScreen.jsx** : Conditions Générales
   - CGU
   - Politique de confidentialité
   - Avertissements légaux
   - Disclaimers

**Navigation** :
- Accessible depuis Settings
- Accessible depuis Onboarding
- Liens directs depuis modales

---

#### A.3 — Flows Authentification Complets
**Objectif** : Flows UX modernes et professionnels.

**Écrans à créer** :
1. **OnboardingScreen.jsx** : Introduction produit
2. **SignupScreen.jsx** : Création compte (email/password)
3. **EmailVerificationScreen.jsx** : Vérification email
4. **ForgotPasswordScreen.jsx** : Réinitialisation mot de passe
5. **GoogleAuthButton.jsx** : Connexion Gmail (UI only)

**Contraintes** :
- Backend GELÉ : UI prête pour intégration future
- Flows complets mais non connectés à l'API
- Validation frontend uniquement

---

### **PHASE B — AGENT INTELLIGENT** (Priorité 2)

#### B.1 — Logique Agent KONAN
**Objectif** : KONAN ne répond pas immédiatement, il **analyse et pose des questions**.

**Fonctionnalités** :
1. **Analyse d'intention** :
   - Détection domaine juridique (pénal, civil, commercial, etc.)
   - Détection niveau de détail fourni
   - Détection urgence/gravité

2. **Détection manque d'information** :
   - KONAN identifie les informations manquantes
   - Génère des questions ciblées
   - Refuse de répondre si insuffisant

3. **Questions avant réponse** :
   - "Avant de vous répondre, j'ai besoin de préciser..."
   - "Quelle est votre situation exacte ?"
   - "Avez-vous des documents à ce sujet ?"

**Implémentation** :
- Logique frontend uniquement
- Règles métier claires
- Patterns de questions prédéfinies

---

#### B.2 — Rôles Dynamiques
**Objectif** : KONAN change de rôle selon le contexte.

**Rôles** :
1. **Inspecteur** : Collecte d'informations
   - Pose des questions
   - Vérifie la cohérence
   - Demande des précisions

2. **Avocat** : Conseil juridique
   - Analyse la situation
   - Propose des options
   - Explique les risques

3. **Juge** : Évaluation objective
   - Analyse neutre
   - Références légales
   - Conclusions mesurées

**UI** :
- Badge de rôle visible dans ChatHeader
- Changement de rôle explicite
- Messages système : "KONAN passe en mode Avocat..."

---

### **PHASE C — VALIDATION & TESTS** (Priorité 3)

#### C.1 — Suite de Tests Pro
**Objectif** : Mesurer la fiabilité de KONAN vs ChatGPT.

**Contenu** :
- 15 cas juridiques réels
- Comparatif KONAN vs ChatGPT
- KPI : fiabilité, pertinence, complétude
- Conclusions objectives

**Livrable** :
- `/docs/KONAN_AGENT_TEST_SUITE.md`

---

## 🛠️ ARCHITECTURE TECHNIQUE

### Structure Dossiers (Nouvelle)
```
src/
├── contexts/
│   └── ThemeContext.jsx          [NOUVEAU]
├── hooks/
│   └── useTheme.js                [NOUVEAU]
├── styles/
│   ├── themes.js                  [NOUVEAU]
│   └── DesignSystem.ts            [EXISTANT]
├── screens/
│   ├── AboutKonanScreen.jsx       [NOUVEAU]
│   ├── TermsScreen.jsx            [NOUVEAU]
│   ├── OnboardingScreen.jsx       [NOUVEAU]
│   ├── SignupScreen.jsx           [NOUVEAU]
│   ├── EmailVerificationScreen.jsx [NOUVEAU]
│   └── ForgotPasswordScreen.jsx   [NOUVEAU]
├── features/
│   └── agent/
│       ├── useAgentLogic.js       [NOUVEAU]
│       ├── intentAnalyzer.js      [NOUVEAU]
│       ├── questionGenerator.js   [NOUVEAU]
│       └── roleManager.js         [NOUVEAU]
└── components/
    └── GoogleAuthButton.jsx       [NOUVEAU]
```

---

## ⚠️ CONTRAINTES ABSOLUES

1. **Backend GELÉ** : Aucune modification API
2. **Zéro Régression** : Chat existant intact
3. **Fiabilité Juridique** : Pas de mensonges, pas d'hallucinations
4. **UX Premium** : Niveau ChatGPT minimum

---

## 📊 KPI DE SUCCÈS

### UX
- [ ] Thème jour/nuit fluide (< 100ms transition)
- [ ] Flows auth complets et intuitifs
- [ ] Zéro friction utilisateur

### Agent
- [ ] KONAN pose au moins 2 questions avant réponse (cas complexes)
- [ ] Taux de refus de réponse si info insuffisante : > 80%
- [ ] Changement de rôle explicite et pertinent

### Fiabilité
- [ ] 15/15 cas tests validés
- [ ] Supériorité KONAN vs ChatGPT : > 70% cas
- [ ] Zéro hallucination juridique

---

## 🚀 ORDRE D'EXÉCUTION

1. **Thème Global** (A.1) → Impacte tout le reste
2. **Écrans Produit** (A.2) → Présentation claire
3. **Flows Auth** (A.3) → UX complète
4. **Agent Logic** (B.1) → Différenciation core
5. **Rôles Dynamiques** (B.2) → Intelligence avancée
6. **Suite Tests** (C.1) → Validation finale

---

## 📅 TIMELINE ESTIMÉE

- **Phase A** : 4-6h (fondations UX)
- **Phase B** : 6-8h (intelligence agent)
- **Phase C** : 2-3h (validation)
- **TOTAL** : 12-17h de développement

---

## ✅ ÉTAT ACTUEL

- [x] Frontend Chat : 100% validé
- [x] Clavier & Input : Parfait
- [x] Sidebar & Sessions : Complet
- [x] Voice Chat : Fonctionnel
- [ ] Thème jour/nuit : À implémenter
- [ ] Écrans produit : À créer
- [ ] Agent intelligent : À implémenter

---

**Prochaine étape** : Démarrer Phase A.1 (Système de Thème Global).

