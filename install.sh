#!/bin/bash
# Script di installazione per macOS/Linux

echo "========================================"
echo "INSTALLAZIONE CHATBOT PINIZZOTTO"
echo "========================================"

# Verifica Python
python3 --version
if [ $? -ne 0 ]; then
    echo "ERRORE: Python3 non trovato!"
    exit 1
fi

echo ""
echo "[1/3] Installazione dipendenze..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERRORE durante installazione dipendenze"
    exit 1
fi

echo ""
echo "[2/3] Test della configurazione..."
python3 -c "import google.generativeai; print('✓ google-generativeai OK')"
python3 -c "import flask; print('✓ flask OK')"
python3 -c "import flask_cors; print('✓ flask_cors OK')"

echo ""
echo "[3/3] Pronto per l'avvio!"
echo ""
echo "========================================"
echo "PROSSIMI STEP:"
echo "========================================"
echo ""
echo "1. Avvia il backend:"
echo "   python3 backend_chatbot.py"
echo ""
echo "2. Apri il browser su:"
echo "   http://localhost:5000/"
echo ""
echo "3. Apri il sito su:"
echo "   http://localhost:8000/index.html"
echo ""
echo "4. Clicca il pulsante 💬 in basso a destra"
echo ""
