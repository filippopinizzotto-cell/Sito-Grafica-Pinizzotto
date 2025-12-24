# 🤖 Chatbot IA Pinizzotto - README

> Assistente IA intelligente integrato nel sito Pinizzotto - Alimentato da Google Gemini

## 📁 File Creati

```
📦 Progetto Pinizzotto
├── 📄 Backend Python:
│   ├── backend_chatbot.py           (Sviluppo locale)
│   ├── backend_chatbot_prod.py      (Produzione)
│   └── requirements.txt              (Dipendenze)
│
├── 🎨 Frontend Widget:
│   └── assets/js/
│       ├── chatbot.js               (Logica JavaScript)
│       └── chatbot.css              (Stili CSS)
│
├── 📚 Documentazione:
│   ├── CHATBOT_GUIDA_COMPLETA.md    (Guida tecnica completa)
│   ├── SETUP_CHATBOT.md             (Setup iniziale)
│   ├── RAILWAY_DEPLOY.md            (Deploy in cloud)
│   └── README.md                    (Questo file)
│
├── 🛠️  Utilities:
│   ├── INSTALL.bat                  (Setup Windows)
│   ├── install.sh                   (Setup Mac/Linux)
│   ├── test_chatbot.py              (Validazione)
│   ├── Procfile                     (Config Railway)
│   └── .env.example                 (Template variabili)
│
└── 🌐 Sito Modificato:
    ├── index.html                   (Con chatbot)
    ├── servizi.html                 (Con chatbot)
    ├── preventivo.html              (Con chatbot)
    └── contatti.html                (Con chatbot)
```

---

## ⚡ Quick Start

### 1️⃣ Opzione A: Windows (Più Facile)

```bash
# 1. Doppio click su INSTALL.bat
# Oppure manualmente:

# 2. Apri PowerShell nella cartella del sito
python backend_chatbot.py

# 3. Apri browser
http://localhost:5000/

# 4. Apri il sito e clicca 💬
```

### 2️⃣ Opzione B: Mac/Linux

```bash
chmod +x install.sh
./install.sh

# Poi:
python3 backend_chatbot.py
```

### 3️⃣ Opzione C: Test Rapido

```bash
# Verifica che tutto sia installato
python test_chatbot.py
```

---

## 🎯 Funzionamento

### Architettura
```
[Utente Browser] 
       ↓ (HTTP)
[JavaScript chatbot.js]
       ↓ (POST /api/chat)
[Backend Flask]
       ↓ (API)
[Google Gemini AI]
       ↓ (Risposta)
[Visualizza nel widget]
```

### Flusso:
1. Utente clicca il pulsante 💬 in basso a destra
2. Scrive un messaggio
3. JavaScript invia al backend
4. Backend elabora con Gemini AI
5. IA risponde intelligentemente
6. Messaggio appare nel chat widget

---

## 🔧 Configurazione

### Per Sviluppo Locale
```python
# backend_chatbot.py
GEMINI_API_KEY = "AIzaSyAJJz2soC2FeI8LpsnVv8pJ-qvZaZqoqRc"
app.run(debug=True, port=5000)
```

### Per Produzione
```bash
# Su Railway:
1. Deploy il codice
2. Aggiungi variabile: GEMINI_API_KEY
3. Modifica chatbot.js con URL di Railway
```

---

## 📋 File Importanti

| File | Cosa Fa | Edita Se... |
|------|---------|-----------|
| `backend_chatbot.py` | Backend Python | Vuoi cambiare risposte bot |
| `assets/js/chatbot.js` | Logica frontend | Vuoi cambiare comportamento |
| `assets/js/chatbot.css` | Stili widget | Vuoi cambiare colori/design |
| `requirements.txt` | Dipendenze Python | Aggiungi librerie |

---

## 🚀 Deploy Produzione

### Consigliato: Railway.app

1. Carica su GitHub
2. Accedi a https://railway.app
3. Deploy from GitHub
4. Configura `GEMINI_API_KEY`
5. Ottieni URL
6. Aggiorna `chatbot.js`

**Costo:** GRATIS (fino a $5/mese incluso)

Vedi `RAILWAY_DEPLOY.md` per dettagli.

---

## 🧪 Testing

```bash
# Esegui i test
python test_chatbot.py

# Dovresti vedere:
# ✅ Python version OK
# ✅ Flask installato
# ✅ google-generativeai installato
# ✅ Tutti i file presenti
# ✅ HTML integrato
```

---

## 🎨 Personalizzazioni

### Cambiare il Testo del Bot
Apri `backend_chatbot.py` e modifica `COMPANY_INFO`:
```python
COMPANY_INFO = """
Sei un assistente per Pinizzotto...
**SERVIZI:** Aggiungi i tuoi servizi qui
**PREZZI:** Aggiungi informazioni prezzi
"""
```

### Cambiare i Colori
Nel file `assets/js/chatbot.css`:
```css
.chatbot-button {
    background: linear-gradient(135deg, #c41e5f 0%, #ff1f77 100%);
    /* Cambia questi colori */
}
```

### Aggiungere Domande Suggerite
Nel file `assets/js/chatbot.js`:
```javascript
this.suggestedQuestions = [
    "Quale domanda 1?",
    "Quale domanda 2?",
];
```

---

## 🐛 Troubleshooting

| Problema | Soluzione |
|----------|-----------|
| "ModuleNotFoundError: No module named 'flask'" | `pip install -r requirements.txt` |
| "Connection refused localhost:5000" | Avvia il backend: `python backend_chatbot.py` |
| "Widget non appare" | Verifica `<link>` e `<script>` nel HTML |
| "Chat non risponde" | Verifica che il backend sia in esecuzione |
| "CORS error" | Backend deve avere `CORS(app)` (è già presente) |

Vedi `CHATBOT_GUIDA_COMPLETA.md` per troubleshooting avanzato.

---

## 📊 Costi

| Servizio | Costo | Note |
|----------|-------|------|
| Google Gemini AI | GRATIS | 60 req/min free |
| Railway.app | GRATIS | $5/mese free |
| JavaScript/CSS | GRATIS | Incluso sito |
| **TOTALE** | **GRATIS** | ✅ |

---

## 🔐 Sicurezza

- ✅ API Key nascosta nel backend (non visibile nel browser)
- ✅ CORS abilitato solo per il tuo sito
- ✅ Messaggi limitati a 1000 caratteri
- ✅ Rate limiting configurabile
- ✅ Nessun dato salvato per default

---

## 📈 Prossimi Step

### Ora (Fase 1) ✅
- Chatbot funzionante
- Deploy in cloud
- Integrazione sito

### Prossimamente (Fase 2)
- [ ] Database persistente (MongoDB)
- [ ] Storico conversazioni
- [ ] Analytics
- [ ] Multi-lingua
- [ ] Integrazione CRM

### Futuro (Fase 3)
- [ ] WhatsApp Bot
- [ ] Telegram Bot
- [ ] AI Training personalizzato
- [ ] Calcolatore prezzi automatico

---

## 📞 Supporto

**Domande o Problemi?**
- Email: info@pinizzotto.it
- Telefono: +39 0342 683265
- Sito: https://www.pinizzotto.it

---

## 📜 Licenza

Progetto creato per Pinizzotto - Azienda Grafica  
24 Dicembre 2025 - v1.0

---

## 🎓 Stack Tecnologico

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Python 3.8+, Flask 3.0
- **IA:** Google Gemini Pro
- **Deploy:** Railway.app, Heroku-compatible
- **Hosting:** Gratuito (Railway $5/mese)

---

**Fatto per Pinizzotto con ❤️**

Ultimo aggiornamento: 24 Dicembre 2025
