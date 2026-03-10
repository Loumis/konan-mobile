# ============================================================================
# FI9_FORCE_UNLOCK_ANDROID.ps1
# Script pour forcer le déblocage du répertoire android
# ============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FI9: FORCE UNLOCK ANDROID DIRECTORY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Identifier les processus qui verrouillent le répertoire
Write-Host "[1/6] Identification des processus verrouillants..." -ForegroundColor Yellow

# Utiliser Handle.exe si disponible, sinon utiliser une méthode alternative
$androidPath = Resolve-Path "android" -ErrorAction SilentlyContinue
if (-not $androidPath) {
    Write-Host "⚠️  Répertoire android introuvable" -ForegroundColor Yellow
    exit 0
}

# Arrêter tous les processus Java/Gradle
Write-Host "[2/6] Arrêt des processus Java/Gradle..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "  - Arrêt de $($javaProcesses.Count) processus Java..." -ForegroundColor Gray
    $javaProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Write-Host "✅ Processus Java arrêtés" -ForegroundColor Green
} else {
    Write-Host "✅ Aucun processus Java actif" -ForegroundColor Green
}

# Arrêter le daemon Gradle
Write-Host ""
Write-Host "[3/6] Arrêt du daemon Gradle..." -ForegroundColor Yellow
if (Test-Path "android\gradlew.bat") {
    Set-Location "android"
    try {
        .\gradlew --stop 2>&1 | Out-Null
        Write-Host "✅ Daemon Gradle arrêté" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Impossible d'arrêter le daemon" -ForegroundColor Yellow
    }
    Set-Location ".."
    Start-Sleep -Seconds 2
}

# Attendre que les handles soient libérés
Write-Host ""
Write-Host "[4/6] Attente de libération des handles (10 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Tentative de suppression manuelle des sous-répertoires
Write-Host ""
Write-Host "[5/6] Tentative de nettoyage des sous-répertoires..." -ForegroundColor Yellow
$subdirs = @("android\.gradle", "android\build", "android\app\build", "android\app\.cxx")
foreach ($dir in $subdirs) {
    if (Test-Path $dir) {
        try {
            Remove-Item -Recurse -Force $dir -ErrorAction Stop
            Write-Host "  ✅ Supprimé: $dir" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️  Impossible de supprimer: $dir" -ForegroundColor Yellow
        }
    }
}

# Solution alternative: Prebuild sans --clean
Write-Host ""
Write-Host "[6/6] Tentative de prebuild SANS --clean..." -ForegroundColor Yellow
Write-Host "  (Cette méthode ne supprime pas le répertoire android existant)" -ForegroundColor Gray
Write-Host ""

try {
    npx expo prebuild --platform android 2>&1 | Tee-Object -Variable prebuildOutput
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✅ PREBUILD RÉUSSI!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  NOTE: Le répertoire android n'a pas été nettoyé" -ForegroundColor Yellow
        Write-Host "⚠️  Si vous rencontrez des problèmes, vous pouvez:" -ForegroundColor Yellow
        Write-Host "   1. Fermer tous les éditeurs (Cursor, VS Code, Android Studio)" -ForegroundColor Gray
        Write-Host "   2. Redémarrer l'ordinateur" -ForegroundColor Gray
        Write-Host "   3. Puis exécuter: Remove-Item -Recurse -Force android" -ForegroundColor Gray
        Write-Host "   4. Puis relancer: npx expo prebuild --clean --platform android" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "❌ PREBUILD ÉCHOUÉ" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "SOLUTIONS ALTERNATIVES:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. FERMER TOUS LES ÉDITEURS:" -ForegroundColor Cyan
        Write-Host "   - Cursor" -ForegroundColor Gray
        Write-Host "   - VS Code" -ForegroundColor Gray
        Write-Host "   - Android Studio" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. REDÉMARRER L'ORDINATEUR" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "3. APRÈS REDÉMARRAGE, EXÉCUTER:" -ForegroundColor Cyan
        Write-Host "   Remove-Item -Recurse -Force android" -ForegroundColor Gray
        Write-Host "   npx expo prebuild --clean --platform android" -ForegroundColor Gray
    }
} catch {
    Write-Host ""
    Write-Host "❌ ERREUR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SCRIPT TERMINÉ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

