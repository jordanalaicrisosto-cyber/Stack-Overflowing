#!/bin/bash

echo "========================================"
echo "Village Numérique Résistant"
echo "Serveur de développement local"
echo "========================================"
echo ""
echo "Démarrage du serveur HTTP sur http://localhost:8000"
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Essayer Python 3 d'abord
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
else
    echo "Python n'est pas installé. Veuillez installer Python 3."
    exit 1
fi

