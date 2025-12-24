# Configurazione Railway.app per Deploy Automatico

## 📋 File Necessari per Railway

Questo progetto include tutto ciò che serve per il deploy su Railway:

### ✅ File Presenti:
1. **requirements.txt** - Dipendenze Python
2. **Procfile** - Comando di avvio
3. **backend_chatbot_prod.py** - Backend ottimizzato per produzione

## 🚀 Procedure di Deploy

### Metodo 1: Deploy Automatico da GitHub (CONSIGLIATO)

1. **Carica il progetto su GitHub**
   ```bash
   git init
   git add .
   git commit -m "Chatbot Pinizzotto v1.0"
   git push origin main
   ```

2. **Accedi a Railway**
   - Vai su https://railway.app
   - Accedi con GitHub

3. **Crea Nuovo Progetto**
   - Clicca "Create" → "New Project"
   - Seleziona "Deploy from GitHub"
   - Connetti il repository

4. **Railway Deploya Automaticamente**
   - Legge `requirements.txt` e installa dipendenze
   - Legge `Procfile` e avvia il backend
   - Genera URL pubblico (es: `https://backend-xyz.railway.app`)

5. **Configura Variabili d'Ambiente**
   - Nel progetto Railway, vai a "Variables"
   - Aggiungi: `GEMINI_API_KEY=AIzaSyAJJz2soC2FeI8LpsnVv8pJ-qvZaZqoqRc`
   - Salva e Railway fa redeploy automatico

6. **Aggiorna il Frontend**
   - Nel file `assets/js/chatbot.js`, cambia:
     ```javascript
     apiUrl: 'https://TUAURL-railway.app'  // Inserisci URL di Railway
     ```

### Metodo 2: Deploy Manuale via CLI

```bash
# Installa Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# Ottieni URL
railway open
```

## 🔐 Variabili d'Ambiente

Railway scaricherà `requirements.txt` e installerà automaticamente:
- Flask==3.0.0
- Flask-CORS==4.0.0
- google-generativeai==0.3.0
- python-dotenv==1.0.0
- gunicorn==21.2.0

La API key di Gemini va settata come variabile:
- **Nome:** `GEMINI_API_KEY`
- **Valore:** `AIzaSyAJJz2soC2FeI8LpsnVv8pJ-qvZaZqoqRc`

## 📊 Costi su Railway

**Buone notizie:** Railway offre **$5 gratis al mese**.

Il vostro chatbot costerà circa:
- **API Calls**: Incluse nei $5 (500+ richieste)
- **Bandwidth**: Incluso
- **Database**: Opzionale (non necessario per ora)

**Totale:** GRATIS per il vostro traffico previsto

## ✔️ Checklist di Deploy

- [ ] File `requirements.txt` presenti
- [ ] File `Procfile` presente
- [ ] File `backend_chatbot_prod.py` presente
- [ ] Repository su GitHub
- [ ] Account Railway creato
- [ ] GEMINI_API_KEY configurata
- [ ] `chatbot.js` aggiornato con URL di Railway
- [ ] Test della chat

## 🧪 Test Dopo Deploy

1. Vai a: `https://TUAURL-railway.app/`
2. Dovresti vedere:
   ```json
   {
     "status": "ok",
     "service": "Pinizzotto Chatbot API",
     "version": "1.0.0",
     "timestamp": "..."
   }
   ```

3. Testa il chat widget nel sito
4. Invia un messaggio
5. Dovresti ricevere risposta da Gemini AI

## 🐛 Debugging

### Log in Tempo Reale
```bash
railway logs
```

### Problemi Comuni

**"Build failed"**
- Verifica che `requirements.txt` non abbia errori
- Controlla la sintassi

**"502 Bad Gateway"**
- Il backend è crashato
- Verifica con `railway logs`
- Controlla se GEMINI_API_KEY è settata

**"No CORS"**
- Assicurati che `CORS(app)` sia nel codice (è già presente)

## 📈 Scalabilità Futura

Con Railway potrai facilmente:
- ✅ Aumentare il database di contesti
- ✅ Aggiungere cache Redis
- ✅ Multi-regione per latenza bassa
- ✅ Auto-scaling

## 💾 Backup del Database

Se in futuro aggiungerai un database:
- Railway fa backup automatico
- Esporta facilmente i dati
- No vendor lock-in

---

**Pronto per il deploy?** Contatta info@pinizzotto.it
