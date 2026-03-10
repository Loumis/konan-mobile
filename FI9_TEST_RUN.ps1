<# =====================================================================
      FI9_TEST_RUN.ps1
      Test propre FI9_NAYEK v14 — KONAN Mobile
      Auteur : KING
      Objectif : Lancer un test propre, reproductible et FI9-certifié
===================================================================== #>

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "       [FI9] DÉMARRAGE DU TEST PROPRE (v14)"
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# --- PHASE 0 : Vérification environnement -------------------------------------
Write-Host "[FI9] Vérification Node, npm, Java, adb..." -ForegroundColor Yellow

$node = node -v
$npm  = npm -v
$java = java -version 2>&1 | Select-String "version"

Write-Host " - Node : $node"
Write-Host " - npm  : $npm"
Write-Host " - Java : $java"

# --- PHASE 1 : fermeture Metro ------------------------------------------------
Write-Host "`n[FI9] Fermeture de Metro & serveurs" -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process expo -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# --- PHASE 2 : nettoyage caches ----------------------------------------------
Write-Host "`n[FI9] Nettoyage des caches Metro / npm" -ForegroundColor Yellow
npm cache clean --force

Write-Host "`n[FI9] Suppression .expo & .expo-shared" -ForegroundColor Yellow
Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".expo-shared" -ErrorAction SilentlyContinue

# --- PHASE 3 : réinstallation modules ----------------------------------------
Write-Host "`n[FI9] Réinstallation des modules" -ForegroundColor Yellow
Write-Host "   (Arrêt des processus Node pour libérer les fichiers...)" -ForegroundColor Gray
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Tentative de suppression avec retry
$retryCount = 0
$maxRetries = 3
while ($retryCount -lt $maxRetries) {
    try {
        Remove-Item -Recurse -Force "node_modules" -ErrorAction Stop
        Write-Host "   node_modules supprimé avec succès" -ForegroundColor Green
        break
    } catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "   Tentative $retryCount/$maxRetries échouée, nouvelle tentative dans 2s..." -ForegroundColor Yellow
            Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
            Start-Sleep -Seconds 2
        } else {
            Write-Host "   Attention: Certains fichiers sont verrouillés, mais on continue..." -ForegroundColor Yellow
        }
    }
}

# Configuration npm pour timeout réseau
npm config set fetch-timeout 600000
npm config set fetch-retries 5

# Installation avec gestion d'erreur
Write-Host "   Installation des dépendances..." -ForegroundColor Gray
$installResult = npm install 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Erreur lors de l'installation, nouvelle tentative..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    npm install --legacy-peer-deps
}

# --- PHASE 4 : nettoyage Gradle (si dossier android existe) ------------------
if (Test-Path "android") {
    Write-Host "`n[FI9] Nettoyage Gradle (Android)" -ForegroundColor Yellow
    Push-Location android
    if (Test-Path "gradlew.bat") {
        .\gradlew.bat clean
    } elseif (Test-Path "gradlew") {
        ./gradlew clean
    }
    Pop-Location
} else {
    Write-Host "`n[FI9] Projet Expo managed - pas de dossier android" -ForegroundColor Gray
}

# --- PHASE 5 : redémarrage Metro ---------------------------------------------
Write-Host "`n[FI9] Démarrage Metro avec reset-cache" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "npm start -- --reset-cache" 

Start-Sleep -Seconds 3

# --- PHASE 6 : build sur appareil Android ------------------------------------
Write-Host "`n[FI9] Lancement du build Android" -ForegroundColor Yellow
npm run android

# --- PHASE 7 : suivi runtime FI9 ---------------------------------------------
Write-Host "`n[FI9] Surveillance des logs FI9_RUNTIME..." -ForegroundColor Cyan
Write-Host "   (Recherche des chemins anormaux, legacy_ui, conflits shadow)"
Write-Host ""

# Vérifier si adb est disponible
$adbAvailable = $false
try {
    $null = adb version 2>&1
    $adbAvailable = $true
} catch {
    $adbAvailable = $false
}

if ($adbAvailable) {
    Write-Host "   Lancement de la surveillance adb logcat..." -ForegroundColor Gray
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "adb logcat | Select-String 'FI9_RUNTIME'"
} else {
    Write-Host "   adb non disponible - surveillance des logs désactivée" -ForegroundColor Yellow
    Write-Host "   (Vous pouvez surveiller les logs Metro dans la fenêtre ouverte)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "        [FI9] TEST PROPRE TERMINE - READY"
Write-Host "====================================================" -ForegroundColor Green
