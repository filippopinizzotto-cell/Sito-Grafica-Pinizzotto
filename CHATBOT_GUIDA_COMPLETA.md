# 🤖 Chatbot IA Pinizzotto - Guida Completa

## 📊 Struttura del Progetto

```
sito/
├── backend_chatbot.py              ← Backend Python (SVILUPPO)
├── backend_chatbot_prod.py         ← Backend Python (PRODUZIONE)
├── requirements.txt                ← Dipendenze Python
├── Procfile                        ← Deploy Railway/Heroku
├── SETUP_CHATBOT.md               ← Guida di setup
├── INSTALL.bat                     ← Installazione Windows
├── install.sh                      ← Installazione Mac/Linux
│
├── assets/
│   └── js/
│       ├── chatbot.js             ← Widget JavaScript
│       └── chatbot.css            ← Stili CSS
│
├── index.html                      ← Con integrazione chatbot
├── servizi.html                    ← Con integrazione chatbot
├── preventivo.html                 ← Con integrazione chatbot
└── contatti.html                   ← Con integrazione chatbot
```

---

## 🚀 Quick Start (30 secondi)

### Windows
1. Apri PowerShell nella cartella del sito
2. Esegui: `python backend_chatbot.py`
3. Apri: `http://localhost:5000/` nel browser
4. Clicca il pulsante 💬

### Mac/Linux
1. Apri terminale nella cartella del sito
2. Esegui: `python3 backend_chatbot.py`
3. Apri: `http://localhost:5000/` nel browser
4. Clicca il pulsante 💬

---

## 🔧 Installazione Dettagliata

### Step 1: Installa Python
- **Windows**: https://www.python.org/downloads/
- **Mac**: `brew install python3`
- **Linux**: `sudo apt install python3 pip3`

### Step 2: Installa dipendenze
```bash
cd "c:\Users\FilippoPinizzotto\OneDrive - ITS Angelo Rizzoli\Desktop\sito"
pip install -r requirements.txt
```

### Step 3: Avvia il backend
```bash
python backend_chatbot.py
```

Output atteso:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Step 4: Test il chatbot
1. Apri il browser
2. Vai su qualsiasi pagina del vostro sito (index.html)
3. Clicca il pulsante 💬 in basso a destra
4. Scrivi un messaggio

---

## 📱 Come Funziona

```
UTENTE
  │
  └──→ [Chatbot Widget - JavaScript nel browser]
         │
         └──→ [Backend Python - Flask]
              │
              └──→ [Google Gemini AI]
                   │
                   └──→ Risposta
```

### Flusso Tecnico:
1. **Frontend**: `chatbot.js` raccoglie il messaggio
2. **HTTP POST**: Invia a `http://localhost:5000/api/chat`
3. **Backend**: `backend_chatbot.py` riceve e processa
4. **IA**: Invia a Google Gemini con il contesto Pinizzotto
5. **Risposta**: Torna al browser e si visualizza nel widget

---

## 🌍 Deploy in Produzione

### Opzione 1: Railway.app (CONSIGLIATO)

**Passo 1: Crea account**
- Vai su https://railway.app
- Signup con GitHub

**Passo 2: Connetti il repository**
- Nuovo progetto → Deploy from GitHub
- Seleziona il repo con il sito

**Passo 3: Configura variabili d'ambiente**
- In Railway, vai a Variables
- Aggiungi: `GEMINI_API_KEY = AIzaSyAJJz2soC2FeI8LpsnVv8pJ-qvZaZqoqRc`

**Passo 4: Railway deploya automaticamente**
- Ottieni URL come: `https://backend-xyz.railway.app`

**Passo 5: Aggiorna chatbot.js**
```javascript
// Nel file assets/js/chatbot.js, cambia:
apiUrl: 'http://localhost:5000'

// Con la tua URL di Railway:
apiUrl: 'https://backend-xyz.railway.app'
```

**Passo 6: Salva e deploy il frontend**
- Il sito sarà disponibile con il chatbot attivo

---

### Opzione 2: Replit (Gratuito, Facile)

1. Vai su https://replit.com
2. Clicca "Create" → "Import from GitHub"
3. Incolla URL del tuo repo
4. Esegui il file `backend_chatbot.py`
5. Replit genera URL automatico (es: `https://replit.com/@user/project`)
6. Aggiorna `chatbot.js` con questa URL

---

### Opzione 3: Vercel + Serverless (Advanced)

Contattami se preferisci questa soluzione più complessa.

---

## 🛠️ Personalizzazioni

### Cambiare il testo del bot

1. Apri `backend_chatbot.py` o `backend_chatbot_prod.py`
2. Trova la sezione `COMPANY_INFO`
3. Modifica i servizi, prezzi, informazioni
4. Salva e riavvia

Esempio:
```python
COMPANY_INFO = """
Sei un assistente AI per Pinizzotto...

**SERVIZI PRINCIPALI:**
1. STAMPA - Aggiungi qui i vostri servizi
2. DESIGN - Aggiorna con le vostre specifiche
...
"""
```

### Cambiare il colore del bot

Nel file `assets/js/chatbot.css`, cerca `.chatbot-button` e modifica:

```css
.chatbot-button {
    background: linear-gradient(135deg, #c41e5f 0%, #ff1f77 100%);
    /* Cambia questi colori hex con i tuoi */
}
```

### Cambiare il messaggio di benvenuto

Nel file `assets/js/chatbot.js`, modifica:

```javascript
this.suggestedQuestions = [
    "Quali sono i vostri servizi?",  ← Cambia questi
    "Come richiedere un preventivo?",
    "Quali sono i tempi di consegna?",
    "Servite anche il mio settore?"
];
```

---

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'google'"
```bash
pip install google-generativeai
```

### "Connection refused - localhost:5000"
Il backend non è attivo. Esegui:
```bash
python backend_chatbot.py
```

### "CORS error"
Verifica che il backend sia in esecuzione e che `CORS(app)` sia nel codice (è già presente).

### "La risposta è vuota o errore"
1. Verifica che la API key sia corretta: `AIzaSyAJJz2soC2FeI8LpsnVv8pJ-qvZaZqoqRc`
2. Verifica la quota API di Google
3. Controlla i log del backend: `python backend_chatbot.py`

### "Il widget non appare nel sito"
1. Verifica che nel HTML ci siano:
   ```html
   <link rel="stylesheet" href="assets/js/chatbot.css">
   <script src="assets/js/chatbot.js" defer></script>
   ```
2. Apri la console del browser (F12) e cerca errori
3. Verifica che i file CSS/JS siano nel percorso giusto

### "Errore: Failed to fetch"
1. Il backend non è in esecuzione
2. L'URL nel `chatbot.js` non è corretta
3. CORS non è abilitato (ma dovrebbe esserlo)

---

## 📊 Analytics (Opzionale)

Per tracciare le conversazioni, puoi aggiungere un database. Contattami per:
- Integrare MongoDB
- Salvare le conversazioni
- Creare dashboard analytics

---

## 🔒 Sicurezza

### API Key
- La API key è memorizzata nel backend (non esposta nel frontend)
- Non è visibile nel codice JavaScript
- ✅ Sicura

### Validazione
- Messaggi limitati a 1000 caratteri
- Rate limiting opzionale
- Sessioni limitate a 50 messaggi

### Privacy
- Conversazioni memorie solo durante la sessione
- Non salvate in database (per ora)
- In produzione: considerare GDPR compliance

---

## 📈 Prossimi Passi Suggeriti

### Fase 2 (Facile)
- ✅ Aggiungere database per cronologia conversazioni
- ✅ Integrazione con sistema CRM
- ✅ Notifiche email per conversazioni importanti

### Fase 3 (Intermedia)
- ✅ Training personalizzato con vostri documenti
- ✅ Multi-lingua (inglese, francese, tedesco)
- ✅ Integrazione con WhatsApp

### Fase 4 (Advanced)
- ✅ Chatbot su Telegram
- ✅ Integrazione con calendario prenotazioni
- ✅ AI per recommendation prodotti

---

## 📞 Supporto

**Per problemi o domande:**
- Email: info@pinizzotto.it
- Telefono: +39 0342 683265
- Chat del bot stessa! 😄

---

## 📝 Changelog

### v1.0 (24 Dicembre 2025)
- ✅ Chatbot base con Gemini AI
- ✅ Widget floating button
- ✅ Integrazione su tutte le pagine
- ✅ Backend Python Flask
- ✅ Deploy guidato

---

## 🎓 Spiegazione Tecnica

### Perché Python + Flask?
- ✅ Facile da imparare e mantenere
- ✅ Ottimo per API semplici
- ✅ Scalabile con Gunicorn
- ✅ Deploy facile su Railway/Heroku

### Perché Google Gemini?
- ✅ API gratuita (60 req/min)
- ✅ Qualità eccellente
- ✅ Nessun costo nascosto
- ✅ Modello aggiornato

### Architettura
```
HTML/CSS/JS (Frontend)
      ↓ (HTTP)
   Flask Server
      ↓ (API REST)
   Google Gemini
      ↓ (IA)
   Risposta Intelligente
```

---

**Creato il:** 24 Dicembre 2025  
**Per:** Pinizzotto - Azienda Grafica  
**Versione:** 1.0 Stable
