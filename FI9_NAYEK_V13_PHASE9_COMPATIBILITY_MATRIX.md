# MATRICE DE COMPATIBILITÉ EXPO/RN/KOTLIN/EXPO-MODULES-CORE

## VERSIONS ACTUELLES DU PROJET

- **Expo SDK** : `54.0.22`
- **expo-modules-core** : `3.0.24` (dépendance d'Expo 54.0.22)
- **React Native** : `0.76.5`
- **Kotlin** : `2.0.21`
- **KSP** : `2.0.21-1.0.28`

## MATRICE DE COMPATIBILITÉ

| Expo SDK | React Native | Kotlin recommandé | expo-modules-core | Compatible | Notes |
|----------|--------------|-------------------|-------------------|-----------|-------|
| 54.0.22 | 0.76.5 | 2.0.21 | 3.0.24 | ❌ **NON** | Erreurs compilation Kotlin (CSSProps, ReactNativeFeatureFlags) |
| 54.0.27 | 0.76.5 | 2.0.21 | 3.0.28 | ⚠️ **À TESTER** | Version plus récente, pourrait corriger les erreurs |
| 54.0.x | 0.76.5 | 2.0.21 | 3.0.28+ | ⚠️ **PROBABLE** | Versions récentes Expo 54 avec expo-modules-core mis à jour |

## ANALYSE DES ERREURS

### Erreur #1 : CSSProps.kt
- **Fichier** : `expo-modules-core/android/src/main/java/expo/modules/kotlin/views/decorators/CSSProps.kt:146`
- **Erreur** : `Too many arguments for 'fun parse(boxShadow: ReadableMap): BoxShadow?'.`
- **Cause** : Signature de fonction incompatible avec Kotlin 2.0.21 ou RN 0.76.5

### Erreur #2 : ReactNativeFeatureFlags.kt
- **Fichier** : `expo-modules-core/android/src/main/java/expo/modules/rncompatibility/ReactNativeFeatureFlags.kt:11`
- **Erreur** : `Unresolved reference 'enableBridgelessArchitecture'.`
- **Cause** : API React Native changée dans RN 0.76.5 (`enableBridgelessArchitecture` renommé/supprimé)

## RECOMMANDATION

**OPTION A — Mise à jour Expo SDK 54.0.22 → 54.0.27** (PRIORITAIRE)

- Mise à jour mineure (patch)
- `expo-modules-core` passerait de `3.0.24` → `3.0.28`
- Risque : **FAIBLE** (mise à jour patch, pas de breaking changes majeurs)
- Impact : Modification de `package.json` uniquement

**Justification** :
- Les versions récentes d'Expo SDK 54 incluent des corrections de bugs dans `expo-modules-core`
- `expo-modules-core 3.0.28` pourrait avoir corrigé les incompatibilités avec RN 0.76.5
- Mise à jour patch (54.0.22 → 54.0.27) = risque minimal

---

**STATUT** : ⚠️ **EN ATTENTE DE VALIDATION STRATÉGIE**

