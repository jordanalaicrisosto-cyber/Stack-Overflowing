@echo off
echo ========================================
echo Village Numerique Resistant
echo Serveur de developpement local
echo ========================================
echo.
echo Demarrage du serveur HTTP sur http://localhost:8000
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

python -m http.server 8000 2>nul
if errorlevel 1 (
    echo Python n'est pas installe ou pas dans le PATH.
    echo Tentative avec Python 3...
    python3 -m http.server 8000
)

pause

