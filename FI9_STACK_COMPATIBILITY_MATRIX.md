# 📊 MATRICE DE COMPATIBILITÉ DES VERSIONS

## ✅ STACK RECOMMANDÉE (VERROUILLÉE)

| Composant | Version | Statut | Justification |
|-----------|---------|--------|---------------|
| **React Native** | `0.76.5` | ✅ Stable | Dernière version stable, compatible Expo SDK 54 |
| **Expo SDK** | `54.0.22` | ✅ Stable | Version actuelle, supportée |
| **React** | `18.3.1` | ✅ Stable | Version testée avec Expo SDK 54 |
| **react-native-reanimated** | `4.1.1` | ✅ Stable | Compatible avec worklets 0.7.1 |
| **react-native-worklets** | `0.7.1` | ✅ Requis | Nécessaire pour reanimated 4.1.1 |
| **react-native-svg** | `15.12.1` | ✅ Stable | Version actuelle |
| **react-native-gesture-handler** | `2.28.0` | ✅ Stable | Compatible |
| **react-native-screens** | `4.16.0` | ✅ Stable | Compatible |
| **Android Gradle Plugin** | `8.7.3` | ✅ Stable | Compatible Gradle 8.13, RN 0.76 |
| **Gradle** | `8.13` | ✅ Stable | Version recommandée |
| **Kotlin** | `2.1.20` | ✅ Stable | Compatible |
| **NDK** | `27.1.12297006` | ✅ Stable | Version recommandée |

---

## ❌ VERSIONS INCOMPATIBLES (À ÉVITER)

| Composant | Version Problématique | Problème |
|-----------|----------------------|----------|
| **React Native** | `0.81.5` | ❌ Version inexistante |
| **React Native** | `^0.73.6` | ⚠️ Trop ancien pour Expo SDK 54 |
| **React** | `19.1.0` | ⚠️ Trop récent, incompatibilités possibles |
| **react-native-worklets** | `Absent` | ❌ Requis par reanimated 4.1.1 |
| **Android Gradle Plugin** | `Non spécifié` | ❌ Risque d'incompatibilité |

---

## 🔗 CHAÎNES DE DÉPENDANCES

### Expo SDK 54
```
Expo SDK 54.0.22
  └─> React Native 0.76.x (requis)
      └─> React 18.3.1 (recommandé)
      └─> Android Gradle Plugin 8.7.x (compatible)
          └─> Gradle 8.13 (requis)
```

### react-native-reanimated 4.1.1
```
react-native-reanimated 4.1.1
  └─> react-native-worklets 0.7.1 (requis)
      └─> React Native 0.76.x (compatible)
```

### Android Build
```
Gradle 8.13
  └─> Android Gradle Plugin 8.7.3 (compatible)
      └─> Kotlin 2.1.20 (compatible)
      └─> NDK 27.1.12297006 (recommandé)
```

---

## ⚠️ CONFLITS POTENTIELS

### 1. React 19 vs React 18
- **Problème**: React 19 est très récent, certaines librairies peuvent ne pas être compatibles
- **Solution**: Utiliser React 18.3.1 (testé avec Expo SDK 54)

### 2. react-native-worklets manquant
- **Problème**: reanimated 4.1.1 nécessite worklets
- **Solution**: Ajouter worklets 0.7.1 explicitement

### 3. AGP non spécifié
- **Problème**: Version implicite peut varier
- **Solution**: Spécifier AGP 8.7.3 explicitement dans build.gradle

---

## 📝 NOTES IMPORTANTES

1. **Toutes les versions doivent être verrouillées** (sans ^ ou ~) pour garantir la stabilité
2. **react-native-worklets doit être présent** pour que reanimated fonctionne
3. **AGP doit être explicite** pour éviter les surprises de version
4. **Ne jamais modifier node_modules manuellement** - utiliser package.json uniquement
5. **Toujours nettoyer les caches** après modification de versions

---

*Matrice générée automatiquement - Ne pas modifier manuellement*

