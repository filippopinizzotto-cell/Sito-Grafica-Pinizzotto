# Script PowerShell per avviare il chatbot - run_chatbot.ps1
# Uso: .\run_chatbot.ps1

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          CHATBOT PINIZZOTTO - AVVIO                   ║" -ForegroundColor Cyan
Write-Host "║          24 Dicembre 2025                              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host ""
Write-Host "[1/4] Verifica Python..." -ForegroundColor Yellow
python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python non trovato! Installa da https://www.python.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Python trovato" -ForegroundColor Green

Write-Host ""
Write-Host "[2/4] Verifica dipendenze..." -ForegroundColor Yellow
python -m pip list | Select-String "Flask"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dipendenze OK" -ForegroundColor Green
} else {
    Write-Host "⚠️  Installo dipendenze..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

Write-Host ""
Write-Host "[3/4] Test della configurazione..." -ForegroundColor Yellow
python -c "import google.generativeai; print('✓ API Gemini OK')" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Configurazione OK" -ForegroundColor Green
} else {
    Write-Host "⚠️  Problemi con API" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[4/4] Avvio backend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Backend in avvio..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Nel browser apri:" -ForegroundColor Cyan
Write-Host "   → http://localhost:5000/" -ForegroundColor White
Write-Host "   → http://localhost:8000/index.html" -ForegroundColor White
Write-Host ""
Write-Host "💬 Clicca il pulsante 💬 in basso a destra del sito" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏹️  Per stoppare: Premi CTRL+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

# Avvia il backend
python backend_chatbot.py
