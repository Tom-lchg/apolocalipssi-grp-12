#!/bin/bash

echo "🚀 Démarrage en mode DÉVELOPPEMENT avec hot reload..."
echo ""

# Arrêter les conteneurs existants s'ils tournent
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down 2>/dev/null

# Démarrer en mode développement
echo "🔧 Démarrage des services en mode développement..."
docker-compose -f docker-compose.dev.yml up --build

echo ""
echo "✅ Mode développement terminé" 