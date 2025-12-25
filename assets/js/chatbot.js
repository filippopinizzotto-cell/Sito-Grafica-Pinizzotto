// Chatbot Widget JavaScript - Pinizzotto

class ChatbotWidget {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || 'http://localhost:5000';
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
                <h4>Pinizzotto</h4>
                <p>Grafica e Stampa Professionale</p>
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

        if (input) input.value = '';
        this.addMessage(message, true);

        this.isWaitingForResponse = true;
        if (sendBtn) sendBtn.disabled = true;
        if (input) input.disabled = true;

        this.showTypingIndicator();

        // Simula un piccolo delay per sembrare più naturale
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.getIntelligentResponse(message);
            this.addMessage(response, false);

            this.isWaitingForResponse = false;
            if (sendBtn) sendBtn.disabled = false;
            if (input) {
                input.disabled = false;
                input.focus();
            }
        }, 800 + Math.random() * 400);
    }

    getIntelligentResponse(message) {
        const msg = message.toLowerCase().trim();
        
        // ========== SALUTI ==========
        if (/^(ciao|salve|buongiorno|buonasera|hey|ehi|hello)$/i.test(msg)) {
            return "Ciao! Benvenuto in Pinizzotto, la tua tipografia di fiducia. Come posso aiutarti oggi? Posso darti informazioni sui nostri servizi, preventivi o metterti in contatto con noi.";
        }

        // ========== SERVIZI GENERALI ==========
        if (/servizi|cosa\s+fate|che\s+cosa|offrite|attivit[aà]|lavori/i.test(msg)) {
            return "Offriamo stampa professionale in digitale, offset e grande formato. Realizziamo biglietti da visita, brochure, depliant, packaging personalizzato, etichette, calendari, manifesti e allestimenti. Vuoi saperne di più su un servizio specifico?";
        }

        // ========== BIGLIETTI DA VISITA ==========
        if (/bigliett[oi]|business\s*card|visita/i.test(msg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(msg)) {
                return "I biglietti da visita partono da circa 25€ per 500 copie (85x55mm). Il prezzo varia in base a carta, plastificazione e finiture. Vuoi richiedere un preventivo personalizzato?";
            }
            return "Realizziamo biglietti da visita personalizzati con carta di alta qualità, plastificazione opaca o lucida, verniciatura UV e stampa fronte/retro. Tempi di consegna: 2-3 giorni lavorativi. Ti serve un preventivo?";
        }

        // ========== BROCHURE / DEPLIANT ==========
        if (/brochure|depliant|pieghevol[ei]|volantini|flyer/i.test(msg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(msg)) {
                return "Le brochure A4 a 3 ante partono da 80€ per 500 copie. I depliant A5 da 60€ per 1000 copie. Prezzi finali dipendono da formato, pieghe e grammatura. Vuoi un preventivo dettagliato?";
            }
            return "Stampiamo brochure e depliant in vari formati (A4, A5, DL) con pieghe personalizzate. Offriamo carta da 135gr a 350gr, con finiture lucide o opache. Consegna in 3-5 giorni. Che formato ti interessa?";
        }

        // ========== PACKAGING ==========
        if (/packaging|scatol[ea]|confezioni|imballagg[io]/i.test(msg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(msg)) {
                return "Il packaging personalizzato varia molto: scatole semplici da 150€ per 100 pz, fino a confezioni premium con finiture speciali. Serve un preventivo su misura in base alle tue esigenze.";
            }
            return "Creiamo packaging su misura: scatole fustellate, astucci, shopper, sacchetti personalizzati. Dalla progettazione grafica alla stampa con laminazioni, vernici UV e rilievi. Che tipo di confezione ti serve?";
        }

        // ========== GRANDE FORMATO ==========
        if (/grande\s*formato|striscioni|banner|manifesti|poster|totem|espositori/i.test(msg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(msg)) {
                return "Grande formato: banner 100x200cm da 40€, manifesti 70x100cm da 8€ cad, roll-up da 120€. Stampiamo anche su forex, pvc, tela e alluminio. Ti serve un preventivo specifico?";
            }
            return "Stampa grande formato per interni ed esterni: banner, roll-up, manifesti, pannelli forex, tele canvas, adesivi murali e vetrofanie. Materiali resistenti agli agenti atmosferici. Che supporto preferisci?";
        }

        // ========== ETICHETTE ==========
        if (/etichet{1,2}[ea]|adesiv[io]/i.test(msg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(msg)) {
                return "Etichette personalizzate da 50€ per 1000 pz (formato standard). Prezzo varia con forma, dimensione e materiale (carta, vinile, polipropilene). Vuoi un preventivo su misura?";
            }
            return "Produciamo etichette adesive in bobina o fogli: personalizzate con il tuo logo, fustellate in qualsiasi forma. Ideali per prodotti alimentari, cosmetici, vini. In che settore operi?";
        }

        // ========== CALENDARI ==========
        if (/calendar[io]/i.test(msg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(msg)) {
                return "Calendari da parete 30x42cm da 4€ cad (min. 50pz), da tavolo da 2,50€ cad. Personalizzabili con logo e foto aziendali. Ti serve una quotazione precisa?";
            }
            return "Stampiamo calendari da parete e da tavolo personalizzati, con grafica su misura, foto e logo aziendale. Perfetti come gadget natalizi o promozionali. Che formato preferisci?";
        }

        // ========== LIBRI / TESI ==========
        if (/libr[io]|tesi|rilegatur[ae]|stampa\s*tesi/i.test(msg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(msg)) {
                return "Rilegatura tesi da 15€ (brossura) a 35€ (copertina rigida). Libri personalizzati con preventivo su numero pagine e tiratura. Vuoi maggiori dettagli?";
            }
            return "Realizziamo tesi di laurea rilegate (brossura, spirale, cartonato), libri fotografici e cataloghi personalizzati. Stampa in bianco/nero o colori con vari tipi di carta. Che rilegatura ti serve?";
        }

        // ========== STAMPA OFFSET vs DIGITALE ==========
        if (/offset|digital[e]?|differenza|tipo\s*di\s*stampa/i.test(msg)) {
            return "Stampa digitale: veloce ed economica per basse tirature (fino a 500 copie). Stampa offset: migliore qualità per grandi quantità (oltre 1000 copie). Ti consiglio in base alle tue esigenze!";
        }

        // ========== TEMPI DI CONSEGNA ==========
        if (/temp[io]|quando|consegna|veloce|urgente|quanto\s*ci\s*vuole/i.test(msg)) {
            return "Tempi standard: biglietti 2-3 giorni, brochure 3-5 giorni, grande formato 1-2 giorni. Per urgenze offriamo servizio express in 24h con piccolo sovrapprezzo. È urgente?";
        }

        // ========== PREVENTIVO ==========
        if (/preventivo|quotazione|stima|budget/i.test(msg)) {
            return "Puoi richiedere un preventivo gratuito compilando il form su https://www.pinizzotto.it/preventivo.html oppure chiamandoci al +39 0342 683265. Ti risponderemo entro 24 ore!";
        }

        // ========== SETTORE / TARGET ==========
        if (/settore|chi\s+siete|clienti|per\s+chi|industria/i.test(msg)) {
            return "Lavoriamo con aziende, professionisti, ristoranti, hotel, associazioni, comuni e privati. Dalla start-up alla grande impresa, personalizziamo ogni progetto. In che settore operi?";
        }

        // ========== GRAFICA / DESIGN ==========
        if (/grafic[ao]|design|progett[oi]|creat[eo]|layout/i.test(msg)) {
            return "Offriamo servizio di grafica professionale: loghi, brochure, packaging, coordinati aziendali. Se hai già i file, stampiamo direttamente. Altrimenti, il nostro team ti affianca nella progettazione!";
        }

        // ========== MATERIALI / CARTE ==========
        if (/carta|materiale|supporto|grammatura|patinata|usomano/i.test(msg)) {
            return "Utilizziamo carte da 80gr a 450gr: patinata lucida/opaca, usomano, offset, marcata, riciclata. Per grande formato: PVC, forex, tela, alluminio dibond. Quale progetto hai in mente?";
        }

        // ========== FINITURE ==========
        if (/plastificazion[e]|verniciatura|uv|rilievo|finitura|laminazion[e]/i.test(msg)) {
            return "Finiture disponibili: plastificazione opaca/lucida, vernice UV a registro, laminazione oro/argento, rilievo a secco, fustellatura. Rendono il tuo stampato unico e di qualità premium!";
        }

        // ========== QUANTITÀ MINIME ==========
        if (/quantit[àa]\s*minim[ae]|minimo|piccol[ae]\s*tiratura|poche\s*copie/i.test(msg)) {
            return "Non abbiamo quantità minime rigide! Con la stampa digitale realizziamo anche 10-20 copie. Per grandi tirature, l'offset garantisce prezzi più vantaggiosi. Quante copie ti servono?";
        }

        // ========== CONTATTI ==========
        if (/contatt[oi]|telefono|email|dove|indirizzo|sede|ubicazione/i.test(msg)) {
            return "Siamo a Piantedo (SO), Via Nazionale 406/A. Tel: +39 0342 683265, Email: info@pinizzotto.it. Orari: Lun-Ven 8:30-12:30 / 14:00-18:00. Passa a trovarci o chiamaci!";
        }

        // ========== ORARI ==========
        if (/orar[io]|aperto|chiuso|quando\s+siete/i.test(msg)) {
            return "Siamo aperti dal lunedì al venerdì, dalle 8:30 alle 12:30 e dalle 14:00 alle 18:00. Chiusi sabato e domenica. Preferisci venire di persona o inviare una richiesta online?";
        }

        // ========== SPEDIZIONI ==========
        if (/spedizion[ie]|consegna|corriere|ricevo|inviate/i.test(msg)) {
            return "Consegniamo in tutta Italia tramite corriere espresso (24-48h). Spedizione gratuita per ordini sopra i 200€. Ritiro in sede sempre disponibile. Dove dobbiamo spedire?";
        }

        // ========== PAGAMENTI ==========
        if (/pagament[oi]|come\s+si\s+paga|carta|bonifico|contanti/i.test(msg)) {
            return "Accettiamo bonifico bancario, carta di credito, PayPal e contanti alla consegna. Per aziende offriamo fatturazione con pagamento a 30 giorni. Come preferisci pagare?";
        }

        // ========== FILE / FORMATI ==========
        if (/file|formato|pdf|illustrator|photoshop|indesign|ai|psd/i.test(msg)) {
            return "Accettiamo file in PDF ad alta risoluzione (300dpi), AI, EPS, InDesign. Inviaceli via email o WeTransfer. Non hai i file pronti? Ti aiutiamo noi con la grafica!";
        }

        // ========== CAMPIONI / PROVE ==========
        if (/campion[ie]|prova|esempio|veder[e]|mostrare/i.test(msg)) {
            return "Possiamo inviarti campioni di carte e finiture, oppure realizzare una prova di stampa prima della tiratura definitiva. Passa in sede per toccare con mano la qualità! Ti interessa?";
        }

        // ========== CATALOGHI / MENU ==========
        if (/catalogo|menu|listino|ristorante|carta/i.test(msg)) {
            return "Stampiamo cataloghi e menu per ristoranti con rilegature varie: spirale, punto metallico, brossura. Carta plastificata lavabile per i menu. Quante pagine ha il tuo progetto?";
        }

        // ========== GADGET / PROMOZIONALI ==========
        if (/gadget|promozional[ie]|penne|tazze|shopper|portachiavi/i.test(msg)) {
            return "Oltre alla stampa, personalizziamo gadget: penne, tazze, shopper, USB, powerbank, portachiavi. Perfetti per fiere ed eventi aziendali. Che tipo di gadget ti serve?";
        }

        // ========== ADESIVI / VETROFANIE ==========
        if (/vetrofani[ae]|adesiv[io]\s+vetro|sticker|decal/i.test(msg)) {
            return "Realizziamo adesivi per vetrine, auto e moto. Materiali: vinile, microforato per vetri, trasparente. Stampa full color con taglio su misura. Per interno o esterno?";
        }

        // ========== RINGRAZIAMENTI ==========
        if (/grazie|perfetto|ok|va\s+bene|ottimo/i.test(msg)) {
            return "Figurati! Se hai altre domande o vuoi un preventivo personalizzato, contattaci al +39 0342 683265 o info@pinizzotto.it. Saremo felici di aiutarti! 😊";
        }

        // ========== URGENZA / EXPRESS ==========
        if (/urgente|subito|veloce|24\s*ore|domani/i.test(msg)) {
            return "Per urgenze offriamo il servizio express: consegna in 24 ore per biglietti da visita, volantini e manifesti. Costo aggiuntivo 30%. Chiamaci subito al +39 0342 683265!";
        }

        // ========== RISPOSTA GENERICA INTELLIGENTE ==========
        return "Interessante! Per darti la risposta più precisa, preferisci parlare di servizi di stampa, preventivi, tempi di consegna o hai bisogno dei nostri contatti? Puoi anche chiamarci al +39 0342 683265.";
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
