// Chatbot Widget JavaScript - Pinizzotto

class ChatbotWidget {
    constructor(options = {}) {
        this.apiKey = 'AIzaSyC9uHsuTmS6bcUhzBqjCvFwjstatn8GmdM';
        this.useGemini = true;
        this.sessionId = this.generateSessionId();
        this.isOpen = false;
        this.isWaitingForResponse = false;
        this.messages = [];
        this.conversationHistory = [];
        this.suggestedQuestions = [
            "Quali sono i vostri servizi?",
            "Come richiedere un preventivo?",
            "Quali sono i tempi di consegna?",
            "Servite anche il mio settore?"
        ];
        
        this.companyInfo = `Sei un assistente AI per Pinizzotto, azienda di grafica e stampa professionale.

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
- Fai domande per comprendere meglio le esigenze`;
        
        this.init();
    }

    init() {
        this.createHTML();
        this.attachEventListeners();
        this.showWelcomeMessage();
    }

    createHTML() {
        // Crea il container principale se non esiste
        if (!document.getElementById('chatbot-widget')) {
            const container = document.createElement('div');
            container.id = 'chatbot-widget';
            container.innerHTML = `
                <!-- Button Floating -->
                <button class="chatbot-button" id="chatbotButton" aria-label="Apri chat">
                    <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Antenna -->
                        <line x1="50" y1="15" x2="50" y2="5" stroke="white" stroke-width="3" stroke-linecap="round"/>
                        <circle cx="50" cy="3" r="4" fill="white"/>
                        
                        <!-- Robot Head (rounded rectangle) -->
                        <rect x="20" y="15" width="60" height="50" rx="20" fill="white"/>
                        
                        <!-- Inner face (blue rounded rectangle) -->
                        <rect x="28" y="23" width="44" height="34" rx="14" fill="#e91e63"/>
                        
                        <!-- Eyes (white ovals) -->
                        <ellipse cx="40" cy="38" rx="5" ry="7" fill="white"/>
                        <ellipse cx="60" cy="38" rx="5" ry="7" fill="white"/>
                        
                        <!-- Speech bubble tail -->
                        <path d="M 35 65 L 28 75 L 42 65 Z" fill="white"/>
                    </svg>
                </button>

                <!-- Chatbot Container -->
                <div class="chatbot-container" id="chatbotContainer">
                    <!-- Header -->
                    <div class="chatbot-header">
                        <div>
                            <h3>Supporto</h3>
                            <p>Sempre disponibile</p>
                        </div>
                        <button class="chatbot-close" id="chatbotClose" aria-label="Chiudi chat">✕</button>
                    </div>

                    <!-- Messages Area -->
                    <div class="chatbot-messages" id="chatbotMessages">
                        <!-- Messaggi apparsi qui -->
                    </div>

                    <!-- Input -->
                    <div class="chatbot-input-container">
                        <div class="input-wrapper">
                            <input 
                                type="text" 
                                class="chatbot-input" 
                                id="chatbotInput" 
                                placeholder="Scrivi qui..."
                                autocomplete="off"
                            >
                            <button class="chatbot-send" id="chatbotSend" aria-label="Invia">
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(container);
        }
    }

    attachEventListeners() {
        const button = document.getElementById('chatbotButton');
        const closeBtn = document.getElementById('chatbotClose');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');
        const container = document.getElementById('chatbotContainer');

        // Toggle chat
        button.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());

        // Send message
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isWaitingForResponse) {
                this.sendMessage();
            }
        });

        // Chiude la chat se clicchi fuori (opzionale)
        document.addEventListener('click', (e) => {
            const isClickInside = container.contains(e.target) || button.contains(e.target);
            if (!isClickInside && this.isOpen) {
                // Opzionale: chiudere
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbotContainer');
        const button = document.getElementById('chatbotButton');

        if (this.isOpen) {
            container.classList.add('open');
            button.classList.add('active');
            document.getElementById('chatbotInput').focus();
        } else {
            container.classList.remove('open');
            button.classList.remove('active');
        }
    }

    showWelcomeMessage() {
        const messagesDiv = document.getElementById('chatbotMessages');
        messagesDiv.innerHTML = `
            <div class="welcome-message">
                <h4>Benvenuto in Grafica Pinizzotto</h4>
                <p>Sono qui per aiutarti con informazioni su stampa professionale, design e preventivi. Come posso aiutarti?</p>
                <div class="suggestion-buttons">
                    ${this.suggestedQuestions.map(q => 
                        `<button class="suggestion-btn" onclick="chatbot.sendMessageDirectly('${q}')">${q}</button>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    addMessage(text, isUser = false) {
        const messagesDiv = document.getElementById('chatbotMessages');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;
        
        messageEl.appendChild(bubble);
        messagesDiv.appendChild(messageEl);
        
        // Scroll in fondo
        setTimeout(() => {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 0);
    }

    showTypingIndicator() {
        const messagesDiv = document.getElementById('chatbotMessages');
        const typingEl = document.createElement('div');
        typingEl.id = 'typing-indicator';
        typingEl.className = 'message bot';
        typingEl.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesDiv.appendChild(typingEl);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    removeTypingIndicator() {
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message || this.isWaitingForResponse) return;

        this.sendMessageDirectly(message);
    }

    async sendMessageDirectly(message) {
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');

        // Pulisci input
        if (input) input.value = '';

        // Aggiungi messaggio utente
        this.addMessage(message, true);

        // Disabilita input
        this.isWaitingForResponse = true;
        if (sendBtn) sendBtn.disabled = true;
        if (input) input.disabled = true;

        // Mostra indicatore di typing
        this.showTypingIndicator();

        // Simula un piccolo delay per sembrare più realistico
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const botResponse = this.getSmartResponse(message.toLowerCase());
            
            this.removeTypingIndicator();
            this.addMessage(botResponse, false);
            
            // Aggiungi alla cronologia
            this.conversationHistory.push({
                role: 'user',
                text: message
            });
            this.conversationHistory.push({
                role: 'assistant',
                text: botResponse
            });
            
        } catch (error) {
            console.error('Errore chat:', error);
            this.removeTypingIndicator();
            this.addMessage(
                "Mi dispiace, si è verificato un errore. Puoi contattarci direttamente a +39 0342 683265",
                false
            );
        } finally {
            // Abilita input
            this.isWaitingForResponse = false;
            if (sendBtn) sendBtn.disabled = false;
            if (input) {
                input.disabled = false;
                input.focus();
            }
        }
    }

    getSmartResponse(message) {
        // Risposte intelligenti basate su parole chiave
        
        // Servizi
        if (message.includes('serviz') || message.includes('cosa fate') || message.includes('cosa offrite')) {
            return "Offriamo:\n\n• Stampa professionale (biglietti, brochure, manifesti, etichette)\n• Design grafico e logo (da €150)\n• Packaging personalizzato (da €200)\n• Agende e calendari 2026 (da €3 cad)\n• Partecipazioni ed inviti (da €1,50 cad)\n\n*Prezzi indicativi. Su quale servizio vuoi informazioni?";
        }
        
        // Preventivo
        if (message.includes('preventiv') || message.includes('prezzo') || message.includes('costo') || message.includes('quanto')) {
            return "Stime indicative:\n\n• Biglietti da visita: da €30 (500 pz)\n• Brochure A4: da €0,50 cad\n• Manifesti 70x100: da €15 cad\n• Logo design: da €150\n• Volantini A5: da €0,30 cad\n\n*Prezzi orientativi. I costi variano per quantità e personalizzazioni.\n\nPer preventivo preciso:\n• Email: info@pinizzotto.it\n• Tel: +39 0342 683265\n• Form: pinizzotto.it/preventivo.html";
        }
        
        // Biglietti da visita
        if (message.includes('bigliett')) {
            return "Realizziamo biglietti da visita di alta qualità:\n\n• Classici (da €30 per 500 pz)\n• Personalizzati (da €50 per 500 pz)\n• Con vernice UV (da €70 per 500 pz)\n• Oro 3D e rilievo lucido (da €90 per 500 pz)\n• Plastificati (da €60 per 500 pz)\n\n*Stime indicative. Per preventivo preciso contattaci al +39 0342 683265 o info@pinizzotto.it";
        }
        
        // Tempi di consegna
        if (message.includes('temp') || message.includes('consegn') || message.includes('quanto tempo')) {
            return "Tempi di consegna:\n\n• Lavori standard: 3-5 giorni lavorativi\n• Urgenze: disponibili su richiesta\n\nPer tempi precisi contattaci al +39 0342 683265";
        }
        
        // Contatti
        if (message.includes('contatt') || message.includes('telefon') || message.includes('email') || message.includes('dove')) {
            return "I nostri contatti:\n\nIndirizzo: Via Nazionale, 406/A - 23010 Piantedo SO\nTelefono: +39 0342 683265\nEmail: info@pinizzotto.it\nWeb: pinizzotto.it\n\nAperti dal lunedì al venerdì.";
        }
        
        // Design/Grafica
        if (message.includes('design') || message.includes('logo') || message.includes('grafica')) {
            return "Servizi di design:\n\n• Logo design: da €150\n• Restyling logo: da €100\n• Materiale marketing completo: da €250\n• Brochure design: da €80\n• Revisioni illimitate incluse\n• File sorgente inclusi\n\n*Stime indicative. Contattaci per preventivo personalizzato: +39 0342 683265";
        }
        
        // Packaging
        if (message.includes('packaging') || message.includes('scatol') || message.includes('confezione')) {
            return "Packaging personalizzato:\n\n• Scatole personalizzate: da €1,50 cad\n• Shopper carta: da €0,40 cad\n• Etichette adesive: da €0,15 cad\n• Astucciatura: da €2 cad\n\nPer ristorazione, hotel, abbigliamento e prodotti vari.\n\n*Prezzi indicativi. Preventivo preciso: +39 0342 683265";
        }
        
        // Agende/Calendari
        if (message.includes('agenda') || message.includes('calendar') || message.includes('2026')) {
            return "Disponibili:\n\n• Agende 2026: da €3 cad\n• Calendari da tavolo: da €2,50 cad\n• Calendari da muro: da €4 cad\n• Block notes: da €1,80 cad\n\n*Stime per quantità minime (50+ pz). Ideali per il tuo business.\n\nPreventivo preciso: info@pinizzotto.it";
        }
        
        // Partecipazioni/Eventi
        if (message.includes('partecipazion') || message.includes('matrimonio') || message.includes('evento') || message.includes('invit')) {
            return "Realizziamo:\n\n• Partecipazioni matrimonio: da €1,50 cad\n• Libretti messa: da €2 cad\n• Inviti eventi: da €1 cad\n• Save the date: da €0,80 cad\n\n*Prezzi indicativi per 100+ pz. Cura artigianale e stampa di qualità.\n\nEsempi e preventivi: +39 0342 683265";
        }
        
        // Saluti
        if (message.includes('ciao') || message.includes('buongiorno') || message.includes('salve') || message.includes('hey')) {
            return "Benvenuto in Grafica Pinizzotto! Posso aiutarti con informazioni su stampa professionale, design e preventivi. Di cosa hai bisogno?";
        }
        
        // Ringraziamenti
        if (message.includes('grazie') || message.includes('perfetto') || message.includes('ok')) {
            return "Prego! Per altre informazioni contattaci al +39 0342 683265 o info@pinizzotto.it";
        }
        
        // Risposta generica
        return "Per informazioni precise contattaci:\n\n• Telefono: +39 0342 683265\n• Email: info@pinizzotto.it\n• Form online: pinizzotto.it/preventivo.html\n\nTi interessano servizi di stampa, design o altro?";
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initializzazione globale
let chatbot;

document.addEventListener('DOMContentLoaded', () => {
    chatbot = new ChatbotWidget();
});
