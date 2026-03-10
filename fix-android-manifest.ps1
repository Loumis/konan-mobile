# FI9: Script de correction automatique AndroidManifest.xml
# Usage: .\fix-android-manifest.ps1

$manifestPath = "android\app\src\main\AndroidManifest.xml"

if (-not (Test-Path $manifestPath)) {
    Write-Host "[ERREUR] AndroidManifest.xml introuvable. Executez d'abord: npx expo prebuild --clean" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Modification de AndroidManifest.xml..." -ForegroundColor Yellow

$content = Get-Content $manifestPath -Raw -Encoding UTF8

# Pattern pour trouver la balise activity principale
# Remplacer windowSoftInputMode si présent
if ($content -match 'android:windowSoftInputMode="[^"]*"') {
    $content = $content -replace 'android:windowSoftInputMode="[^"]*"', 'android:windowSoftInputMode="stateAlwaysHidden|adjustResize"'
    Write-Host "[OK] windowSoftInputMode remplace" -ForegroundColor Green
} elseif ($content -match '<activity[^>]*>') {
    # Ajouter windowSoftInputMode si absent
    $content = $content -replace '(<activity[^>]*)(>)', '$1 android:windowSoftInputMode="stateAlwaysHidden|adjustResize"$2'
    Write-Host "[OK] windowSoftInputMode ajoute" -ForegroundColor Green
} else {
    Write-Host "[ATTENTION] Impossible de trouver la balise activity" -ForegroundColor Yellow
}

# Vérifier qu'il n'y a pas adjustPan
if ($content -match 'adjustPan') {
    Write-Host "[ERREUR] adjustPan detecte ! Suppression..." -ForegroundColor Red
    $content = $content -replace 'adjustPan', 'adjustResize'
    Write-Host "[OK] adjustPan remplace par adjustResize" -ForegroundColor Green
}

# Sauvegarder
Set-Content -Path $manifestPath -Value $content -NoNewline -Encoding UTF8

Write-Host "[OK] AndroidManifest.xml modifie avec succes !" -ForegroundColor Green
Write-Host "[INFO] Verification finale..." -ForegroundColor Yellow

# Vérification finale
$finalContent = Get-Content $manifestPath -Raw -Encoding UTF8
if ($finalContent -match 'android:windowSoftInputMode="[^"]*adjustResize[^"]*"') {
    Write-Host "[OK] adjustResize confirme dans AndroidManifest.xml" -ForegroundColor Green
} else {
    Write-Host "[ATTENTION] adjustResize non trouve apres modification" -ForegroundColor Red
}

if ($finalContent -match 'adjustPan') {
    Write-Host "[ERREUR] adjustPan toujours present !" -ForegroundColor Red
    exit 1
} else {
    Write-Host "[OK] Aucun adjustPan detecte" -ForegroundColor Green
}

Write-Host ""
Write-Host "[SUCCES] Pret pour le build: npx expo run:android" -ForegroundColor Cyan

