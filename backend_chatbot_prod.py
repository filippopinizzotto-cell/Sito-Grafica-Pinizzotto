"""
Backend Chatbot Pinizzotto - Versione Semplificata
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# Config
app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBZPQzQlyBQe94KFrACMu832anJi7g5kQY")
genai.configure(api_key=API_KEY)

# System prompt
SYSTEM_PROMPT = """Sei un assistente AI per Pinizzotto - Grafica e Stampa.
Rispondi in italiano, sii professionale e conciso (max 3-4 frasi).
Dati: Via Nazionale 406/A, Piantedo (SO), Tel: +39 0342 683265, Email: info@pinizzotto.it
Servizi: stampa digitale, offset, grande formato, packaging, depliant, biglietti da visita."""

model = genai.GenerativeModel(model_name="gemini-1.5-flash")

conversations = {}

@app.route("/", methods=["GET"])
def index():
    return jsonify({"status": "ok", "service": "Pinizzotto Chatbot"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/api/chat", methods=["POST"])
def chat():
    print("📨 Ricevuta richiesta chat")
    try:
        data = request.json
        print(f"📝 Dati: {data}")
        message = data.get("message", "").strip()
        session_id = data.get("session_id", "default")
        print(f"💬 Messaggio: {message}, Session: {session_id}")

        if not message:
            return jsonify({"success": False, "error": "Messaggio vuoto"}), 400

        # Inizializza conversazione con system prompt
        if session_id not in conversations:
            print("🆕 Nuova conversazione")
            conversations[session_id] = model.start_chat(history=[
                {"role": "user", "parts": [SYSTEM_PROMPT]},
                {"role": "model", "parts": ["Certo! Sono qui per aiutarti con i servizi di Pinizzotto."]}
            ])

        # Invia messaggio
        print("🤖 Invio a Gemini...")
        chat_session = conversations[session_id]
        response = chat_session.send_message(message)
        print(f"✅ Risposta: {response.text[:50]}...")

        return jsonify({
            "success": True,
            "response": response.text
        })

    except Exception as e:
        print("❌ ERRORE:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": "Errore server"
        }), 500

@app.route("/api/reset", methods=["POST"])
def reset():
    try:
        session_id = request.json.get("session_id", "default")
        conversations.pop(session_id, None)
        return jsonify({"success": True})
    except:
        return jsonify({"success": False}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"🚀 Server starting on http://localhost:{port}")
    print(f"📡 API endpoint: http://localhost:{port}/api/chat")
    app.run(host="0.0.0.0", port=port, debug=False)
