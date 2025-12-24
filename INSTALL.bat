@echo off
REM Script di installazione veloce del chatbot Pinizzotto

echo ========================================
echo INSTALLAZIONE CHATBOT PINIZZOTTO
echo ========================================

REM Verifica Python
python --version
if errorlevel 1 (
    echo ERRORE: Python non trovato! Installa Python da https://www.python.org
    pause
    exit /b 1
)

echo.
echo [1/3] Installazione dipendenze...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERRORE durante installazione dipendenze
    pause
    exit /b 1
)

echo.
echo [2/3] Test della configurazione...
python -c "import google.generativeai; print('✓ google-generativeai OK')"
python -c "import flask; print('✓ flask OK')"
python -c "import flask_cors; print('✓ flask_cors OK')"

echo.
echo [3/3] Pronto per l'avvio!
echo.
echo ========================================
echo PROSSIMI STEP:
echo ========================================
echo.
echo 1. Avvia il backend:
echo    python backend_chatbot.py
echo.
echo 2. Apri il browser su:
echo    http://localhost:5000/
echo.
echo 3. Apri il sito su:
echo    http://localhost:8000/index.html
echo.
echo 4. Clicca il pulsante 💬 in basso a destra
echo.
pause
