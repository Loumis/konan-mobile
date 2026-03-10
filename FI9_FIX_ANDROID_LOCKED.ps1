# ============================================================================
# FI9_FIX_ANDROID_LOCKED.ps1
# Script pour débloquer le répertoire android verrouillé
# ============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FI9: DÉBLOQUAGE RÉPERTOIRE ANDROID" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Arrêter les processus Gradle/Java qui pourraient verrouiller
Write-Host "[1/5] Arrêt des processus Gradle..." -ForegroundColor Yellow
$gradleDaemons = Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object {
    try {
        $_.CommandLine -like "*gradle*" -or 
        (Get-WmiObject Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine -like "*gradle*"
    } catch {
        $false
    }
}

if ($gradleDaemons) {
    Write-Host "  - Arrêt de $($gradleDaemons.Count) processus Gradle..." -ForegroundColor Gray
    $gradleDaemons | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✅ Processus Gradle arrêtés" -ForegroundColor Green
} else {
    Write-Host "✅ Aucun processus Gradle actif" -ForegroundColor Green
}

# Étape 2: Arrêter le daemon Gradle explicitement
Write-Host ""
Write-Host "[2/5] Arrêt du daemon Gradle..." -ForegroundColor Yellow
if (Test-Path "android\gradlew.bat") {
    Set-Location "android"
    try {
        .\gradlew --stop 2>&1 | Out-Null
        Write-Host "✅ Daemon Gradle arrêté" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Impossible d'arrêter le daemon (peut être normal)" -ForegroundColor Yellow
    }
    Set-Location ".."
} else {
    Write-Host "⚠️  gradlew.bat introuvable (peut être normal)" -ForegroundColor Yellow
}

# Étape 3: Attendre que les handles soient libérés
Write-Host ""
Write-Host "[3/5] Attente de libération des handles..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Étape 4: Vérifier si le répertoire est accessible
Write-Host ""
Write-Host "[4/5] Vérification de l'accessibilité..." -ForegroundColor Yellow
$androidPath = Resolve-Path "android" -ErrorAction SilentlyContinue
if ($androidPath) {
    try {
        $testFile = Join-Path $androidPath "test_lock.tmp"
        New-Item -ItemType File -Path $testFile -Force -ErrorAction Stop | Out-Null
        Remove-Item $testFile -Force -ErrorAction Stop
        Write-Host "✅ Répertoire accessible" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Répertoire partiellement verrouillé" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Répertoire android introuvable" -ForegroundColor Yellow
}

# Étape 5: Tentative de prebuild avec retry
Write-Host ""
Write-Host "[5/5] Tentative de prebuild..." -ForegroundColor Yellow
Write-Host "  - npx expo prebuild --clean --platform android" -ForegroundColor Gray
Write-Host ""

# Option 1: Prebuild normal
$prebuildSuccess = $false
try {
    npx expo prebuild --clean --platform android
    if ($LASTEXITCODE -eq 0) {
        $prebuildSuccess = $true
        Write-Host ""
        Write-Host "✅ PREBUILD RÉUSSI!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Prebuild a échoué: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Option 2: Si échec, essayer sans --clean d'abord
if (-not $prebuildSuccess) {
    Write-Host ""
    Write-Host "Tentative alternative: prebuild sans --clean..." -ForegroundColor Yellow
    try {
        npx expo prebuild --platform android
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ PREBUILD RÉUSSI (sans --clean)!" -ForegroundColor Green
            Write-Host "⚠️  NOTE: Le répertoire android n'a pas été nettoyé" -ForegroundColor Yellow
            Write-Host "⚠️  Vous pouvez le supprimer manuellement si nécessaire" -ForegroundColor Yellow
        }
    } catch {
        Write-Host ""
        Write-Host "❌ PREBUILD ÉCHOUÉ" -ForegroundColor Red
        Write-Host ""
        Write-Host "SOLUTIONS ALTERNATIVES:" -ForegroundColor Yellow
        Write-Host "1. Fermer tous les éditeurs (Cursor, VS Code, Android Studio)" -ForegroundColor Gray
        Write-Host "2. Redémarrer l'ordinateur" -ForegroundColor Gray
        Write-Host "3. Supprimer manuellement le répertoire android après fermeture des éditeurs" -ForegroundColor Gray
        Write-Host "4. Utiliser: Remove-Item -Recurse -Force android (après fermeture des éditeurs)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SCRIPT TERMINÉ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

