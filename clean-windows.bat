@echo off
echo ========================================
echo Nettoyage Docker pour Windows
echo ========================================

echo.
echo 1. Arrêt de tous les conteneurs...
docker-compose -f docker-compose.dev.yml down

echo.
echo 2. Suppression des conteneurs orphelins...
docker container prune -f

echo.
echo 3. Suppression des volumes non utilisés...
docker volume prune -f

echo.
echo 4. Suppression des images non utilisées...
docker image prune -f

echo.
echo 5. Nettoyage du cache Docker...
docker system prune -f

echo.
echo ========================================
echo Nettoyage terminé !
echo ========================================
echo.
echo Vous pouvez maintenant relancer avec :
echo docker-compose -f docker-compose.dev.yml up --build
echo.
pause 