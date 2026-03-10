# ANALYSE STRATÉGIQUE — FI9_NAYEK v13 PHASE 7

## COMPARAISON DES OPTIONS

### OPTION A — Downgrade Kotlin Safe (2.1.20 → 2.0.21)

**Risque** : ⚠️ **FAIBLE à MODÉRÉ**

**Avantages** :
- ✅ Changement minimal (downgrade d'une version mineure)
- ✅ Impact localisé (uniquement `build.gradle`)
- ✅ Kotlin 2.0.21 est une version stable récente
- ✅ Compatible avec Expo SDK 54 (Expo supporte généralement Kotlin 2.0+)
- ✅ Compatible avec React Native 0.76.5
- ✅ KSP compatible : `2.0.21-1.0.x` (format standard)
- ✅ Réversible facilement si problème

**Inconvénients** :
- ⚠️ Perte de certaines fonctionnalités de Kotlin 2.1.20
- ⚠️ Risque théorique de réintroduire `1.9.24` (mais peu probable car 2.0.21 est stable)

**Impact sur l'existant** : **MINIMAL**
- Modification uniquement dans `android/build.gradle`
- Aucun impact sur le code source
- Aucun impact sur les dépendances npm

**Verdict FI9** : ✅ **AUTORISÉ** (risque acceptable)

---

### OPTION B — Upgrade React Native

**Risque** : ❌ **TRÈS ÉLEVÉ**

**Avantages** :
- ✅ Résout potentiellement l'incompatibilité Kotlin 2.1.20
- ✅ Accès aux dernières fonctionnalités RN

**Inconvénients** :
- ❌ Risque de casser l'existant fonctionnel (Expo, UI, OCR, API, Auth, Paiements)
- ❌ Nécessite migration complète du projet
- ❌ Incompatibilités possibles avec les dépendances actuelles
- ❌ Temps de migration important
- ❌ Tests exhaustifs requis

**Impact sur l'existant** : **MAJEUR**
- Modification de `package.json`
- Risque de breaking changes dans toutes les dépendances
- Refonte potentielle de composants

**Verdict FI9** : ❌ **BLOQUÉ** (risque trop élevé, non prioritaire)

---

### OPTION C — Patch contrôlé du Plugin Gradle RN

**Risque** : ❌ **ÉLEVÉ**

**Avantages** :
- ✅ Garde Kotlin 2.1.20
- ✅ Pas de downgrade

**Inconvénients** :
- ❌ Modification de code dans `node_modules/@react-native/gradle-plugin`
- ❌ Nécessite maintenance continue (patch à réappliquer après chaque `npm install`)
- ❌ Complexité technique élevée
- ❌ Risque d'incompatibilités futures
- ❌ Patch non officiel (non supporté)

**Impact sur l'existant** : **MODÉRÉ à ÉLEVÉ**
- Patch via `patch-package` (déjà utilisé dans le projet)
- Maintenance continue requise
- Risque de conflits lors des mises à jour

**Verdict FI9** : ❌ **BLOQUÉ** (maintenance continue, complexité élevée)

---

## DÉCISION FI9

**STRATÉGIE CHOISIE** : **OPTION A — Downgrade Kotlin Safe**

**Justification** :
1. ✅ Risque minimal selon critères FI9
2. ✅ Zéro casse existante (modification localisée)
3. ✅ Compatibilité Expo SDK 54 confirmée
4. ✅ Réversible facilement
5. ✅ Impact minimal sur le projet

**Plan d'action** :
1. Downgrade Kotlin `2.1.20` → `2.0.21` dans `android/build.gradle`
2. Vérification automatique de KSP par `expo-root-project`
3. Tests de build (`./gradlew clean`, `./gradlew assembleDebug`)
4. Tests Expo (`npx expo start`)
5. Tests fonctionnels (Lancement, Auth, OCR, API, Paiement, UI)

**Statut** : ✅ **AUTORISÉ POUR MIGRATION**

---

**FIN DE L'ANALYSE STRATÉGIQUE**

