"""
Backend Chatbot Pinizzotto - Flask Server
Integrazione con Google Gemini AI
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from datetime import datetime
import os

# Configurazione Flask
app = Flask(__name__)
CORS(app)

# Configurazione API Gemini
GEMINI_API_KEY = "AIzaSyAJJz2soC2FeI8LpsnVv8pJ-qvZaZqoqRc"
genai.configure(api_key=GEMINI_API_KEY)

# Knowledge Base di Pinizzotto
COMPANY_INFO = """
Sei un assistente AI per Pinizzotto, azienda di grafica e stampa professionale.

**INFORMAZIONI AZIENDA:**
- Nome: Pinizzotto - Azienda Grafica
- Indirizzo: Via Nazionale, 406/A - 23010 Piantedo SO Italy
- Telefono: +39 0342 683265
- Email: info@pinizzotto.it
- P. IVA: 01035420148
- Sito: https://www.pinizzotto.it

**SERVIZI PRINCIPALI:**

1. **STAMPA PROFESSIONALE**
   - Biglietti da visita (Classici, Personalizzati, Vernice UV, Oro 3D, Rilievo lucido, Plastificati)
   - Brochure e dépliant
   - Manifesti e locandine
   - Etichette
   - Packaging personalizzato
   - Badge e pass

2. **DESIGN PERSONALIZZATO**
   - Logo design
   - Materiale marketing completo
   - Design creativo su misura
   - File sorgente inclusi
   - Revisioni illimitate

3. **COMUNICAZIONE AZIENDALE**
   - Cartelline personalizzate
   - Fustellatura (stampati sagomati)
   - Fascicoli e dispense
   - Fogli macchina
   - Inviti e cartoncini

4. **BLOCCHI E AGENDE**
   - Block Notes personalizzati
   - Quaderni a spirale e punto metallico
   - Agende 2026
   - Calendari da tavolo, tascabili, muro

5. **SETTORI SPECIFICI**
   - Partecipazioni e libretti messa
   - Packaging per ristorazione/hotel
   - Cartellini per abbigliamento
   - Biglietti di Natale

**CARATTERISTICHE SERVIZI:**
- ✓ Alta qualità di stampa
- ✓ Carta premium
- ✓ Consegna rapida
- ✓ Design originale
- ✓ Revisioni illimitate
- ✓ File sorgente inclusi

**FORME DI CONTATTO:**
1. Telefono: +39 0342 683265
2. Email: info@pinizzotto.it
3. Modulo preventivo: https://www.pinizzotto.it/preventivo.html
4. Chat (questo assistente)

**ISTRUZIONI PER IL BOT:**
- Sei amichevole e professionale
- Rispondi in italiano
- Se non conosci qualcosa, suggerisci di contattarli direttamente
- Aiuta gli utenti a trovare il servizio adatto
- Fornisci informazioni su prezzi solo su richiesta (sono personalizzati)
- Guida verso la richiesta di preventivo per progetti specifici
- Sii breve nelle risposte (max 3-4 frasi per volta)
- Fai domande per comprendere meglio le esigenze
"""

# Conversazioni memorizzate
conversations = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    """Endpoint principale per la chat"""
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id', 'default')
        
        if not user_message:
            return jsonify({'error': 'Messaggio vuoto'}), 400
        
        # Inizializza conversazione se non esiste
        if session_id not in conversations:
            conversations[session_id] = []
        
        # Aggiunge messaggio utente alla cronologia
        conversations[session_id].append({
            'role': 'user',
            'content': user_message
        })
        
        # Crea il modello chat
        model = genai.GenerativeModel('gemini-pro')
        
        # Costruisce il prompt con contexto
        system_prompt = COMPANY_INFO
        
        # Converte cronologia nel formato giusto
        chat_history = []
        for msg in conversations[session_id][:-1]:  # Esclude l'ultimo messaggio (quello corrente)
            chat_history.append({
                'role': msg['role'],
                'parts': [msg['content']]
            })
        
        # Crea la sessione chat
        chat = model.start_chat(history=chat_history)
        
        # Invia il messaggio con system prompt
        full_prompt = f"{system_prompt}\n\nUtente: {user_message}"
        response = chat.send_message(full_prompt)
        
        bot_response = response.text
        
        # Memorizza risposta
        conversations[session_id].append({
            'role': 'model',
            'content': bot_response
        })
        
        # Mantiene solo gli ultimi 20 messaggi per non overloadare memoria
        if len(conversations[session_id]) > 20:
            conversations[session_id] = conversations[session_id][-20:]
        
        return jsonify({
            'success': True,
            'response': bot_response,
            'session_id': session_id
        })
    
    except Exception as e:
        print(f"Errore: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Errore nel processamento del messaggio',
            'details': str(e)
        }), 500

@app.route('/api/reset', methods=['POST'])
def reset_chat():
    """Reset della conversazione"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        if session_id in conversations:
            del conversations[session_id]
        
        return jsonify({'success': True, 'message': 'Conversazione resettata'})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    # Per sviluppo locale
    app.run(debug=True, port=5000, host='0.0.0.0')
