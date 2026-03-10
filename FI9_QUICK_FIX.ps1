# ============================================================================
# FI9_QUICK_FIX.ps1
# Solution rapide pour débloquer et continuer le prebuild
# ============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FI9: QUICK FIX - PREBUILD SANS CLEAN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Arrêter les processus Java
Write-Host "[1/3] Arrêt des processus Java..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    $javaProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "✅ $($javaProcesses.Count) processus Java arrêtés" -ForegroundColor Green
} else {
    Write-Host "✅ Aucun processus Java actif" -ForegroundColor Green
}

# Étape 2: Arrêter le daemon Gradle
Write-Host ""
Write-Host "[2/3] Arrêt du daemon Gradle..." -ForegroundColor Yellow
if (Test-Path "android\gradlew.bat") {
    Set-Location "android"
    .\gradlew --stop 2>&1 | Out-Null
    Set-Location ".."
    Write-Host "✅ Daemon Gradle arrêté" -ForegroundColor Green
} else {
    Write-Host "⚠️  gradlew.bat introuvable (peut être normal)" -ForegroundColor Yellow
}

# Étape 3: Prebuild SANS --clean
Write-Host ""
Write-Host "[3/3] Prebuild Expo (sans --clean)..." -ForegroundColor Yellow
Write-Host "  Cette méthode met à jour le répertoire android sans le supprimer" -ForegroundColor Gray
Write-Host ""

npx expo prebuild --platform android

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ PREBUILD RÉUSSI!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaine étape: npx expo run:android" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ PREBUILD ÉCHOUÉ" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Consultez FI9_ANDROID_LOCKED_SOLUTION.md pour d'autres solutions" -ForegroundColor Yellow
}

