# 📋 LISTE DES MODIFICATIONS REQUISES - FI9_NAYEK v13

## ⚠️ ATTENTION: VALIDATION KING OBLIGATOIRE AVANT APPLICATION

**Protocole**: FI9_NAYEK v13 - PRODUCTION CRITIQUE  
**Statut**: ⏳ EN ATTENTE VALIDATION KING

---

## 📝 FICHIERS À MODIFIER

### 1. `package.json` — VERROUILLAGE VERSIONS + UPGRADE RN

**Fichier source**: `FI9_NAYEK_V13_PACKAGE_JSON_CORRECTED.json`

**Modifications**:
- `expo`: `~54.0.22` → `54.0.22` (verrouillage)
- `react`: `19.1.0` → `18.3.1` (downgrade compatible)
- `react-native`: `^0.73.6` → `0.76.5` (upgrade requis Expo SDK 54)
- `react-native-reanimated`: `~4.1.1` → `4.1.1` (verrouillage)
- `react-native-gesture-handler`: `~2.28.0` → `2.28.0` (verrouillage)
- `react-native-screens`: `~4.16.0` → `4.16.0` (verrouillage)
- `react-native-worklets`: `^0.7.1` → `0.7.1` (verrouillage)
- `react-dom`: `19.1.0` → `18.3.1` (alignement avec React)
- `@types/react`: `~19.1.10` → `18.3.12` (alignement avec React)
- Ajout script `postinstall`: `"patch-package"` (pour persister patches)

**Justification**: Stabilité des builds, compatibilité Expo SDK 54

---

### 2. `node_modules/react-native-reanimated/android/build.gradle` — AGP ALIGNMENT

**Ligne 139**:
- **AVANT**: `classpath "com.android.tools.build:gradle:8.2.1"`
- **APRÈS**: `classpath "com.android.tools.build:gradle:8.7.3"`

**Justification**: Alignement avec AGP du projet root, évite conflits

**Action requise**: Créer patch via `patch-package` après modification

---

## 🔧 COMMANDES À EXÉCUTER (APRÈS VALIDATION KING)

### Étape 1: Sauvegarder package.json actuel
```powershell
Copy-Item package.json package.json.backup
```

### Étape 2: Appliquer package.json corrigé
```powershell
Copy-Item FI9_NAYEK_V13_PACKAGE_JSON_CORRECTED.json package.json
```

### Étape 3: Nettoyer et réinstaller
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
npm install --legacy-peer-deps
```

### Étape 4: Corriger reanimated AGP
```powershell
# Modifier manuellement node_modules/react-native-reanimated/android/build.gradle
# Ligne 139: 8.2.1 → 8.7.3
# Puis créer le patch:
npx patch-package react-native-reanimated
```

### Étape 5: Prebuild Expo
```powershell
npx expo prebuild --platform android
```

### Étape 6: Build Android
```powershell
cd android
.\gradlew clean
.\gradlew assembleDebug
cd ..
```

---

## ✅ VALIDATION POST-MODIFICATIONS

- [ ] `package.json` versions verrouillées
- [ ] React Native 0.76.5 installé
- [ ] React 18.3.1 installé
- [ ] Patch reanimated créé
- [ ] `gradlew clean` réussi
- [ ] `gradlew assembleDebug` réussi
- [ ] App Android fonctionnelle
- [ ] UI intacte
- [ ] Backend accessible

---

## 🚨 RÈGLES ABSOLUES

1. ❌ **JAMAIS** appliquer sans validation KING
2. ❌ **JAMAIS** modifier sans sauvegarde
3. ✅ **TOUJOURS** tester après chaque modification
4. ✅ **TOUJOURS** vérifier UI et backend intacts

---

**STATUT**: ⏳ EN ATTENTE VALIDATION KING  
**PROTOCOLE**: FI9_NAYEK v13  
**MODE**: PRODUCTION CRITIQUE

---

*Liste générée automatiquement - Ne pas modifier sans validation KING*









