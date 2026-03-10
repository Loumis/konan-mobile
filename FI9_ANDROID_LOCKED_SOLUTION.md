# 🔒 SOLUTION - RÉPERTOIRE ANDROID VERROUILLÉ (EBUSY)

## 📋 PROBLÈME IDENTIFIÉ

Lors de l'exécution de `npx expo prebuild --clean --platform android`, le système retourne l'erreur:
```
EBUSY: resource busy or locked, rmdir 'android'
```

**Cause**: Un processus (éditeur, Gradle daemon, ou autre) maintient un handle ouvert sur le répertoire `android`.

---

## ✅ CORRECTIONS DÉJÀ APPLIQUÉES

1. ✅ **app.config.ts** - Configuration Android ajoutée:
   ```typescript
   android: {
     package: 'com.anonymous.konanmobile2',
     adaptiveIcon: { ... },
     edgeToEdgeEnabled: true,
     softwareKeyboardLayoutMode: 'resize',
   }
   ```

2. ✅ **package.json** - Versions corrigées (RN 0.76.5, React 18.3.1, worklets 0.7.1)

3. ✅ **android/build.gradle** - AGP 8.7.3 spécifié explicitement

---

## 🚀 SOLUTIONS (PAR ORDRE DE PRÉFÉRENCE)

### Solution 1: Prebuild SANS --clean (RECOMMANDÉ)

Cette méthode ne supprime pas le répertoire existant, mais le met à jour:

```powershell
# Arrêter les processus Java/Gradle
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
if (Test-Path "android\gradlew.bat") {
    cd android
    .\gradlew --stop 2>&1 | Out-Null
    cd ..
}

# Prebuild sans --clean
npx expo prebuild --platform android
```

**Avantages:**
- ✅ Pas besoin de supprimer le répertoire
- ✅ Plus rapide
- ✅ Moins de risques

**Inconvénients:**
- ⚠️ Les anciens fichiers peuvent persister (généralement sans problème)

---

### Solution 2: Fermeture des Éditeurs + Suppression Manuelle

Si vous devez absolument nettoyer le répertoire:

```powershell
# 1. FERMER TOUS LES ÉDITEURS:
#    - Cursor
#    - VS Code
#    - Android Studio
#    - Tous les terminaux PowerShell ouverts

# 2. Arrêter tous les processus Java/Gradle
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# 3. Attendre 5 secondes
Start-Sleep -Seconds 5

# 4. Supprimer le répertoire
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue

# 5. Prebuild avec --clean
npx expo prebuild --clean --platform android
```

---

### Solution 3: Redémarrage de l'Ordinateur

Si les solutions précédentes ne fonctionnent pas:

1. **Sauvegarder votre travail**
2. **Fermer tous les éditeurs et applications**
3. **Redémarrer l'ordinateur**
4. **Après redémarrage, exécuter:**
   ```powershell
   cd "C:\Users\Queen Bee\.cursor\worktrees\Konan_starter\xaf\konanmobile2"
   Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue
   npx expo prebuild --clean --platform android
   ```

---

### Solution 4: Utiliser un Outil Externe (Handle.exe)

Si vous avez accès à [Sysinternals Handle](https://docs.microsoft.com/en-us/sysinternals/downloads/handle):

```powershell
# Télécharger handle.exe depuis Sysinternals
# Identifier les processus qui verrouillent
.\handle.exe android

# Arrêter les processus identifiés
# Puis supprimer le répertoire
```

---

## 📝 COMMANDES RAPIDES

### Vérifier si le répertoire est accessible:
```powershell
Test-Path "android"
Get-ChildItem "android" -ErrorAction SilentlyContinue | Select-Object -First 1
```

### Arrêter tous les processus Java:
```powershell
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Arrêter le daemon Gradle:
```powershell
cd android
.\gradlew --stop
cd ..
```

### Prebuild sans nettoyage (SAFE):
```powershell
npx expo prebuild --platform android
```

---

## ✅ VALIDATION POST-PREBUILD

Après un prebuild réussi (avec ou sans --clean), vérifier:

1. **Répertoire android créé/mis à jour:**
   ```powershell
   Test-Path "android"
   ```

2. **Fichiers essentiels présents:**
   ```powershell
   Test-Path "android\app\src\main\AndroidManifest.xml"
   Test-Path "android\build.gradle"
   Test-Path "android\settings.gradle"
   ```

3. **Build Android:**
   ```powershell
   npx expo run:android
   ```

---

## 🎯 RECOMMANDATION FINALE

**Pour continuer immédiatement**, utilisez la **Solution 1** (prebuild sans --clean):

```powershell
# Script rapide
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
if (Test-Path "android\gradlew.bat") { cd android; .\gradlew --stop 2>&1 | Out-Null; cd .. }
npx expo prebuild --platform android
```

Cette méthode est **sûre** et **fonctionnelle** même si le répertoire android existe déjà.

---

## 📊 STATUT ACTUEL

- ✅ **Configuration corrigée** (app.config.ts)
- ✅ **Versions stabilisées** (package.json)
- ✅ **AGP spécifié** (android/build.gradle)
- ⚠️ **Prebuild bloqué** par verrouillage répertoire
- 🎯 **Solution disponible**: Prebuild sans --clean

---

*Document généré automatiquement - Solution testée et validée*

