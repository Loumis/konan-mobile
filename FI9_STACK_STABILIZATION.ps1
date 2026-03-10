# ============================================================================
# FI9_STACK_STABILIZATION.ps1
# Script de stabilisation complète de la stack Android/React Native
# ============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FI9: STACK STABILIZATION SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérification de l'environnement
Write-Host "[1/8] Vérification de l'environnement..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERREUR: package.json introuvable" -ForegroundColor Red
    exit 1
}
Write-Host "✅ package.json trouvé" -ForegroundColor Green

# Nettoyage des caches
Write-Host ""
Write-Host "[2/8] Nettoyage des caches..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  - Suppression node_modules..." -ForegroundColor Gray
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
}
if (Test-Path ".expo") {
    Write-Host "  - Suppression .expo..." -ForegroundColor Gray
    Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
}
if (Test-Path "android\.gradle") {
    Write-Host "  - Suppression android\.gradle..." -ForegroundColor Gray
    Remove-Item -Recurse -Force "android\.gradle" -ErrorAction SilentlyContinue
}
if (Test-Path "android\build") {
    Write-Host "  - Suppression android\build..." -ForegroundColor Gray
    Remove-Item -Recurse -Force "android\build" -ErrorAction SilentlyContinue
}
if (Test-Path "android\app\build") {
    Write-Host "  - Suppression android\app\build..." -ForegroundColor Gray
    Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue
}
Write-Host "✅ Caches nettoyés" -ForegroundColor Green

# Suppression des patches manuels node_modules
Write-Host ""
Write-Host "[3/8] Vérification des patches manuels..." -ForegroundColor Yellow
$workletsStubPath = "node_modules\react-native-reanimated\android\src\main\java\com\swmansion\worklets"
if (Test-Path $workletsStubPath) {
    Write-Host "  - Suppression des stubs worklets manuels..." -ForegroundColor Gray
    Remove-Item -Recurse -Force $workletsStubPath -ErrorAction SilentlyContinue
}
Write-Host "✅ Patches manuels supprimés" -ForegroundColor Green

# Installation des dépendances
Write-Host ""
Write-Host "[4/8] Installation des dépendances..." -ForegroundColor Yellow
Write-Host "  - npm install..." -ForegroundColor Gray
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERREUR: npm install a échoué" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dépendances installées" -ForegroundColor Green

# Vérification des versions installées
Write-Host ""
Write-Host "[5/8] Vérification des versions..." -ForegroundColor Yellow
$rnVersion = node -e "console.log(require('./package.json').dependencies['react-native'])"
$expoVersion = node -e "console.log(require('./package.json').dependencies['expo'])"
$reanimatedVersion = node -e "console.log(require('./package.json').dependencies['react-native-reanimated'])"
$workletsVersion = node -e "try { console.log(require('./package.json').dependencies['react-native-worklets']); } catch(e) { console.log('ABSENT'); }"

Write-Host "  - React Native: $rnVersion" -ForegroundColor Gray
Write-Host "  - Expo: $expoVersion" -ForegroundColor Gray
Write-Host "  - Reanimated: $reanimatedVersion" -ForegroundColor Gray
Write-Host "  - Worklets: $workletsVersion" -ForegroundColor Gray

if ($rnVersion -notmatch "0\.76") {
    Write-Host "⚠️  ATTENTION: React Native version doit être 0.76.x" -ForegroundColor Yellow
}
if ($workletsVersion -eq "ABSENT") {
    Write-Host "❌ ERREUR: react-native-worklets manquant" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Versions vérifiées" -ForegroundColor Green

# Nettoyage Gradle
Write-Host ""
Write-Host "[6/8] Nettoyage Gradle..." -ForegroundColor Yellow
Set-Location "android"
.\gradlew clean --no-daemon
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  ATTENTION: gradlew clean a échoué (peut être normal)" -ForegroundColor Yellow
}
Set-Location ".."
Write-Host "✅ Gradle nettoyé" -ForegroundColor Green

# Prebuild Expo
Write-Host ""
Write-Host "[7/8] Prebuild Expo..." -ForegroundColor Yellow
Write-Host "  - npx expo prebuild --clean..." -ForegroundColor Gray
npx expo prebuild --clean --platform android
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERREUR: expo prebuild a échoué" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prebuild réussi" -ForegroundColor Green

# Build Android
Write-Host ""
Write-Host "[8/8] Build Android..." -ForegroundColor Yellow
Write-Host "  - npx expo run:android..." -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  NOTE: Le build peut prendre plusieurs minutes" -ForegroundColor Yellow
Write-Host "⚠️  NOTE: Assurez-vous qu'un appareil/émulateur est connecté" -ForegroundColor Yellow
Write-Host ""
$buildChoice = Read-Host "Voulez-vous lancer le build maintenant? (O/N)"
if ($buildChoice -eq "O" -or $buildChoice -eq "o") {
    npx expo run:android
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✅ BUILD RÉUSSI!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "❌ BUILD ÉCHOUÉ" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "Consultez les erreurs ci-dessus" -ForegroundColor Yellow
    }
} else {
    Write-Host "Build ignoré. Lancez manuellement avec: npx expo run:android" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SCRIPT TERMINÉ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

