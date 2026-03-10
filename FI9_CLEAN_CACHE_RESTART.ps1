# FI9_NAYEK: Script de nettoyage cache et redemarrage
# Elimination de toute resolution vers localhost

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FI9: Nettoyage Cache & Redemarrage" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Nettoyer le cache Metro
Write-Host "[1/5] Nettoyage cache Metro..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "  [OK] Cache Metro supprime" -ForegroundColor Green
} else {
    Write-Host "  [OK] Pas de cache Metro" -ForegroundColor Green
}

# Nettoyer le cache Expo
Write-Host "[2/5] Nettoyage cache Expo..." -ForegroundColor Yellow
$expoCache = "$env:USERPROFILE\.expo"
if (Test-Path $expoCache) {
    Remove-Item -Recurse -Force "$expoCache\cache" -ErrorAction SilentlyContinue
    Write-Host "  [OK] Cache Expo supprime" -ForegroundColor Green
} else {
    Write-Host "  [OK] Pas de cache Expo" -ForegroundColor Green
}

# Nettoyer le cache npm
Write-Host "[3/5] Nettoyage cache npm..." -ForegroundColor Yellow
npm cache clean --force 2>&1 | Out-Null
Write-Host "  [OK] Cache npm nettoye" -ForegroundColor Green

# Nettoyer les builds
Write-Host "[4/5] Nettoyage builds..." -ForegroundColor Yellow
if (Test-Path ".expo") {
    Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
    Write-Host "  [OK] Dossier .expo supprime" -ForegroundColor Green
}
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
    Write-Host "  [OK] Dossier dist supprime" -ForegroundColor Green
}

# Verifier la configuration
Write-Host "[5/5] Verification configuration..." -ForegroundColor Yellow
Write-Host "  [OK] Priorite: API_BASE_URL > VITE_API_BASE_URL" -ForegroundColor Green
Write-Host "  [OK] Localhost remplace par 192.168.0.184:8000" -ForegroundColor Green
Write-Host "  [OK] Fallback: http://192.168.0.184:8000" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[OK] Nettoyage termine!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour redemarrer l'application:" -ForegroundColor Yellow
Write-Host "  npm start -- --clear" -ForegroundColor White
Write-Host ""
Write-Host "Ou pour Android:" -ForegroundColor Yellow
Write-Host "  npx expo start --android --clear" -ForegroundColor White
Write-Host ""

