# ✅ CHECKLIST DE VALIDATION - STACK STABILISÉE

## 📋 AVANT BUILD

- [ ] `package.json` corrigé avec versions stables
- [ ] `android/build.gradle` avec AGP 8.7.3 explicite
- [ ] `react-native.config.js` supprimé (worklets géré par autolinking)
- [ ] `node_modules` nettoyé (pas de patches manuels)
- [ ] Caches Gradle nettoyés
- [ ] Script `FI9_STACK_STABILIZATION.ps1` exécuté

## 🔨 PENDANT BUILD

- [ ] `npm install --legacy-peer-deps` réussi
- [ ] `npx expo prebuild --clean` réussi
- [ ] `npx expo run:android` lancé
- [ ] Aucune erreur Gradle critique
- [ ] Aucune erreur de compilation Java
- [ ] Aucune erreur de compilation Kotlin
- [ ] Aucune erreur CMake/native

## ✅ APRÈS BUILD

- [ ] APK généré avec succès
- [ ] App installée sur appareil/émulateur
- [ ] App démarre sans crash
- [ ] UI intact (sidebar visible)
- [ ] UI intact (header fonctionnel)
- [ ] UI intact (input fonctionnel)
- [ ] UI intact (bouton fonctionnel)
- [ ] Backend accessible (API fonctionnelle)
- [ ] Chat fonctionnel (messages s'affichent)
- [ ] Navigation fonctionnelle

## 🚨 VÉRIFICATIONS CRITIQUES

### Versions Installées
```powershell
node -e "console.log('RN:', require('./package.json').dependencies['react-native'])"
node -e "console.log('Expo:', require('./package.json').dependencies['expo'])"
node -e "console.log('Reanimated:', require('./package.json').dependencies['react-native-reanimated'])"
node -e "console.log('Worklets:', require('./package.json').dependencies['react-native-worklets'])"
```

**Résultats attendus:**
- React Native: `0.76.5`
- Expo: `54.0.22`
- Reanimated: `4.1.1`
- Worklets: `0.7.1`

### Build Gradle
```powershell
cd android
.\gradlew --version
```

**Vérifier:**
- Gradle: `8.13`
- AGP: `8.7.3` (dans build.gradle)

### Fichiers Critiques
- [ ] `package.json` - Versions verrouillées (sans ^ ou ~)
- [ ] `android/build.gradle` - AGP 8.7.3 explicite
- [ ] `android/gradle/wrapper/gradle-wrapper.properties` - Gradle 8.13
- [ ] `react-native.config.js` - **SUPPRIMÉ**

## 📊 STATUT FINAL

**Date de validation**: _______________

**Build Status**: 
- [ ] 🟢 BUILD READY
- [ ] 🔴 BUILD NOT READY

**Validé par**: _______________

**Notes**: 
_________________________________________________
_________________________________________________
_________________________________________________

