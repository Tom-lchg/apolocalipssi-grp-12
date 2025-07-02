# Script PowerShell pour nettoyer Docker sur Windows
Write-Host "========================================" -ForegroundColor Green
Write-Host "Nettoyage Docker pour Windows" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "1. Arrêt de tous les conteneurs..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down

Write-Host ""
Write-Host "2. Suppression des conteneurs orphelins..." -ForegroundColor Yellow
docker container prune -f

Write-Host ""
Write-Host "3. Suppression des volumes non utilisés..." -ForegroundColor Yellow
docker volume prune -f

Write-Host ""
Write-Host "4. Suppression des images non utilisées..." -ForegroundColor Yellow
docker image prune -f

Write-Host ""
Write-Host "5. Nettoyage complet du système Docker..." -ForegroundColor Yellow
docker system prune -af

Write-Host ""
Write-Host "6. Vérification des fichiers tsconfig..." -ForegroundColor Yellow
if (Test-Path "tsconfig.json") {
    Write-Host "✓ tsconfig.json trouvé" -ForegroundColor Green
} else {
    Write-Host "✗ tsconfig.json manquant" -ForegroundColor Red
}

if (Test-Path "tsconfig.app.json") {
    Write-Host "✓ tsconfig.app.json trouvé" -ForegroundColor Green
} else {
    Write-Host "✗ tsconfig.app.json manquant" -ForegroundColor Red
}

if (Test-Path "tsconfig.node.json") {
    Write-Host "✓ tsconfig.node.json trouvé" -ForegroundColor Green
} else {
    Write-Host "✗ tsconfig.node.json manquant" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Nettoyage terminé !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Vous pouvez maintenant relancer avec :" -ForegroundColor Cyan
Write-Host "docker-compose -f docker-compose.dev.yml up --build" -ForegroundColor White
Write-Host "" 