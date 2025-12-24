# Guida Setup Chatbot Pinizzotto

## 📋 Prerequisiti
- Python 3.8+ installato
- pip (gestore pacchetti Python)

## 🚀 Installazione Passo per Passo

### 1. Installa le dipendenze
```bash
# Apri terminale nella cartella del progetto
cd "c:\Users\FilippoPinizzotto\OneDrive - ITS Angelo Rizzoli\Desktop\sito"

# Installa i pacchetti
pip install -r requirements.txt
```

### 2. Avvia il backend
```bash
# Sempre dalla stessa cartella
python backend_chatbot.py
```

Dovresti vedere:
```
* Running on http://127.0.0.1:5000
* Press CTRL+C to quit
```

### 3. Integra il chatbot nel tuo sito

Aggiungi al `<head>` di TUTTE le pagine HTML (index.html, servizi.html, etc):

```html
<link rel="stylesheet" href="assets/js/chatbot.css">
<script src="assets/js/chatbot.js" defer></script>
```

Esempio in index.html:
```html
<head>
    <!-- ... altri tag ... -->
    <link rel="stylesheet" href="css/style.css?v=9">
    
    <!-- AGGIUNGI QUESTE DUE RIGHE -->
    <link rel="stylesheet" href="assets/js/chatbot.css">
    <script src="assets/js/chatbot.js" defer></script>
    <!-- FINE AGGIUNTE -->
</head>
```

### 4. Test in locale
1. Apri il backend (python backend_chatbot.py)
2. Apri il browser su `http://localhost:8000/index.html` (o apri direttamente il file HTML)
3. Dovresti vedere un pulsante 💬 in basso a destra
4. Clicca per provare il chatbot

---

## 📦 Deploy in Produzione

### Opzione A: Railway.app (CONSIGLIATO - Gratuito)

1. Vai su https://railway.app
2. Crea account gratuito
3. Nuovo progetto → Deploy from GitHub
4. Connetti il tuo repo GitHub
5. Aggiungi `environment variables`:
   - `GEMINI_API_KEY` = `AIzaSyAJJz2soC2FeI8LpsnVv8pJ-qvZaZqoqRc`

6. Nel file `backend_chatbot.py` modifica:
```python
# Usa variabile ambiente
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyAJJz2soC2FeI8LpsnVv8pJ-qvZaZqoqRc')
```

7. Railway genererà un URL tipo: `https://backend-xyz.railway.app`

### Opzione B: Replit.com (GRATIS)

1. Vai su https://replit.com
2. Import repo GitHub o carica file
3. Esegui il backend
4. Ottieni URL pubblico automatico

### Opzione C: Vercel + Serverless

1. Deploy backend come serverless function
2. Modifica il file per serverless

---

## 🔧 Modifica URL Backend

Una volta in produzione, modifica in `chatbot.js`:

```javascript
// CAMBIA QUESTA RIGA:
apiUrl: 'http://localhost:5000'

// CON LA TUA URL DI PRODUZIONE:
apiUrl: 'https://backend-xyz.railway.app'
```

---

## 🛠️ Troubleshooting

### "Errore di CORS"
→ Assicurati che il backend abbia `CORS` abilitato (è già abilitato nel file)

### "API not found"
→ Verifica che il backend sia in esecuzione (python backend_chatbot.py)

### "Modulo google.generativeai non trovato"
→ Esegui: `pip install google-generativeai`

### Il chatbot non appare nel sito
→ Verifica che:
1. I file CSS e JS siano nel percorso giusto
2. I `<link>` e `<script>` siano aggiunti all'HTML
3. Non ci siano errori nella console (F12)

---

## 📝 Personalizzazioni

Per modificare le risposte del bot:
1. Apri `backend_chatbot.py`
2. Modifica la variabile `COMPANY_INFO` con i vostri dati
3. Salva e riavvia

---

## 🎯 Prossimi Step Opzionali

- Aggiungere database per memorizzare conversazioni
- Integrare con sistema di ticketing
- Aggiungere analytics
- Training personalizzato con documenti specifici
- Multi-lingua

---

Contatti: info@pinizzotto.it | +39 0342 683265
