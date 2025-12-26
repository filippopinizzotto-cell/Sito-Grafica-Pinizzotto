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
        const normalized = msg.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents
        const softMsg = normalized.replace(/([a-z])\1{2,}/g, '$1$1'); // collapse long repeated letters (es. ciao->ciao, ciaooo->ciaoo)
        
        // ========== SALUTI ==========
        if (/(ciao|salve|buongiorno|buon\s*giorno|buonasera|buona\s*sera|buonaserata|buon\s*pomeriggio|buond[ìi]|buon\s*d[ìi]|hey|ehi|hello|hi|hola)/i.test(softMsg)) {
            return "Ciao! Benvenuto in Pinizzotto, la tua tipografia di fiducia. Come posso aiutarti oggi? Posso darti informazioni sui nostri servizi, preventivi o metterti in contatto con noi.";
        }

        // ========== SERVIZI GENERALI ==========
        if (/servizi|cosa\s+fate|che\s+cosa|offrite|attivit[aà]|lavori/i.test(softMsg)) {
            return "Offriamo stampa professionale in digitale, offset e grande formato. Realizziamo biglietti da visita, brochure, depliant, packaging personalizzato, etichette, calendari, manifesti e allestimenti. Vuoi saperne di più su un servizio specifico?";
        }

        // ========== BIGLIETTI DA VISITA ==========
        if (/bigliett[oi]|business\s*card|visita/i.test(softMsg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(softMsg)) {
                return "I biglietti da visita partono da circa 25€ per 500 copie (85x55mm). Il prezzo varia in base a carta, plastificazione e finiture. Vuoi richiedere un preventivo personalizzato?";
            }
            return "Realizziamo biglietti da visita personalizzati con carta di alta qualità, plastificazione opaca o lucida, verniciatura UV e stampa fronte/retro. Tempi di consegna: 2-3 giorni lavorativi. Ti serve un preventivo?";
        }

        // ========== BROCHURE / DEPLIANT ==========
        if (/brochure|depliant|pieghevol[ei]|volantini|flyer/i.test(softMsg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(softMsg)) {
                return "Le brochure A4 a 3 ante partono da 80€ per 500 copie. I depliant A5 da 60€ per 1000 copie. Prezzi finali dipendono da formato, pieghe e grammatura. Vuoi un preventivo dettagliato?";
            }
            return "Stampiamo brochure e depliant in vari formati (A4, A5, DL) con pieghe personalizzate. Offriamo carta da 135gr a 350gr, con finiture lucide o opache. Consegna in 3-5 giorni. Che formato ti interessa?";
        }

        // ========== PACKAGING ==========
        if (/packaging|scatol[ea]|confezioni|imballagg[io]/i.test(softMsg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(softMsg)) {
                return "Il packaging personalizzato varia molto: scatole semplici da 150€ per 100 pz, fino a confezioni premium con finiture speciali. Serve un preventivo su misura in base alle tue esigenze.";
            }
            return "Creiamo packaging su misura: scatole fustellate, astucci, shopper, sacchetti personalizzati. Dalla progettazione grafica alla stampa con laminazioni, vernici UV e rilievi. Che tipo di confezione ti serve?";
        }

        // ========== GRANDE FORMATO ==========
        if (/grande\s*formato|striscioni|banner|manifesti|poster|totem|espositori/i.test(softMsg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(softMsg)) {
                return "Grande formato: banner 100x200cm da 40€, manifesti 70x100cm da 8€ cad, roll-up da 120€. Stampiamo anche su forex, pvc, tela e alluminio. Ti serve un preventivo specifico?";
            }
            return "Stampa grande formato per interni ed esterni: banner, roll-up, manifesti, pannelli forex, tele canvas, adesivi murali e vetrofanie. Materiali resistenti agli agenti atmosferici. Che supporto preferisci?";
        }

        // ========== ETICHETTE ==========
        if (/etichet{1,2}[ea]|adesiv[io]/i.test(softMsg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(softMsg)) {
                return "Etichette personalizzate da 50€ per 1000 pz (formato standard). Prezzo varia con forma, dimensione e materiale (carta, vinile, polipropilene). Vuoi un preventivo su misura?";
            }
            return "Produciamo etichette adesive in bobina o fogli: personalizzate con il tuo logo, fustellate in qualsiasi forma. Ideali per prodotti alimentari, cosmetici, vini. In che settore operi?";
        }

        // ========== CALENDARI ==========
        if (/calendar[io]/i.test(softMsg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(softMsg)) {
                return "Calendari da parete 30x42cm da 4€ cad (min. 50pz), da tavolo da 2,50€ cad. Personalizzabili con logo e foto aziendali. Ti serve una quotazione precisa?";
            }
            return "Stampiamo calendari da parete e da tavolo personalizzati, con grafica su misura, foto e logo aziendale. Perfetti come gadget natalizi o promozionali. Che formato preferisci?";
        }

        // ========== LIBRI / TESI ==========
        if (/libr[io]|tesi|rilegatur[ae]|stampa\s*tesi/i.test(softMsg)) {
            if (/prezz[oi]|cost[oa]|quanto/i.test(softMsg)) {
                return "Rilegatura tesi da 15€ (brossura) a 35€ (copertina rigida). Libri personalizzati con preventivo su numero pagine e tiratura. Vuoi maggiori dettagli?";
            }
            return "Realizziamo tesi di laurea rilegate (brossura, spirale, cartonato), libri fotografici e cataloghi personalizzati. Stampa in bianco/nero o colori con vari tipi di carta. Che rilegatura ti serve?";
        }

        // ========== STAMPA OFFSET vs DIGITALE ==========
        if (/offset|digital[e]?|differenza|tipo\s*di\s*stampa/i.test(softMsg)) {
            return "Stampa digitale: veloce ed economica per basse tirature (fino a 500 copie). Stampa offset: migliore qualità per grandi quantità (oltre 1000 copie). Ti consiglio in base alle tue esigenze!";
        }

        // ========== TEMPI DI CONSEGNA ==========
        if (/temp[io]|quando|consegna|veloce|urgente|quanto\s*ci\s*vuole/i.test(softMsg)) {
            return "Tempi standard: biglietti 2-3 giorni, brochure 3-5 giorni, grande formato 1-2 giorni. Per urgenze offriamo servizio express in 24h con piccolo sovrapprezzo. È urgente?";
        }

        // ========== PREVENTIVO ==========
        if (/preventivo|quotazione|stima|budget/i.test(softMsg)) {
            return "Puoi richiedere un preventivo gratuito compilando il form su https://www.pinizzotto.it/preventivo.html oppure chiamandoci al +39 0342 683265. Ti risponderemo entro 24 ore!";
        }

        // ========== SCONTI / GRANDI TIRATURE ==========
        if (/scont[oi]|promo|offerta|grandi\s+tirature|quantit[aà]\s+alta|volume/i.test(softMsg)) {
            return "Per grandi tirature applichiamo sconti dedicati: offset conviene oltre 1000 copie. Indicaci quantità e formato, ti preparo la soluzione più economica.";
        }

        // ========== SETTORE / TARGET ==========
        if (/settore|chi\s+siete|clienti|per\s+chi|industria|ristorante|hotel|bar|caff[èe]|pizzeria|panificio|farmacia|estetica|parrucchiere|dentist[ai]|studio\s*medico|e[-\s]?commerce|negozio|boutique|agriturismo|b&b|bed\s*and\s*breakfast/i.test(softMsg)) {
            return "Lavoriamo con aziende, negozi, ristoranti, hotel, studi medici e professionisti. Possiamo curare menu, packaging alimentare, vetrofanie, brochure, biglietti da visita, divise personalizzate e allestimenti per eventi. Dimmi il tuo settore (es. ristorante, hotel, studio dentistico, e-commerce) così ti propongo soluzioni mirate.";
        }

        // ========== PROBLEMI ORDINE / RITARDO ==========
        if (/ritard[oi]|in\s*ritardo|non\s+(\w+\s*){0,3}arrivato|dove\s+(è|e)\s+l'ordine|tracking|spedizion[ei]\s+in\s+ritardo|consegna\s+in\s+ritardo|non\s+ho\s+ricevuto|ordine\s+perso/i.test(softMsg)) {
            return "Mi dispiace per il disagio. Per verificare subito la tua consegna contattaci al +39 0342 683265 o scrivi a info@pinizzotto.it indicando numero ordine e nome. Così controlliamo lo stato e ti aggiorniamo al volo.";
        }

        // ========== STATO ORDINE GENERICO ==========
        if (/stato\s+ordine|tracking|dove\s+si\s+trova|avanzamento\s+ordine/i.test(softMsg)) {
            return "Controlliamo subito lo stato: inviaci numero ordine e nome a info@pinizzotto.it o chiamaci al +39 0342 683265. Ti aggiorniamo in tempo reale.";
        }

        // ========== GRAFICA / DESIGN ==========
        if (/grafic[ao]|design|progett[oi]|creat[eo]|layout/i.test(softMsg)) {
            return "Offriamo servizio di grafica professionale: loghi, brochure, packaging, coordinati aziendali. Se hai già i file, stampiamo direttamente. Altrimenti, il nostro team ti affianca nella progettazione!";
        }

        // ========== MATERIALI / CARTE ==========
        if (/carta|materiale|supporto|grammatura|patinata|usomano/i.test(softMsg)) {
            return "Utilizziamo carte da 80gr a 450gr: patinata lucida/opaca, usomano, offset, marcata, riciclata. Per grande formato: PVC, forex, tela, alluminio dibond. Quale progetto hai in mente?";
        }

        // ========== FINITURE ==========
        if (/plastificazion[e]|verniciatura|uv|rilievo|finitura|laminazion[e]/i.test(softMsg)) {
            return "Finiture disponibili: plastificazione opaca/lucida, vernice UV a registro, laminazione oro/argento, rilievo a secco, fustellatura. Rendono il tuo stampato unico e di qualità premium!";
        }

        // ========== QUANTITÀ MINIME ==========
        if (/quantit[àa]\s*minim[ae]|minimo|piccol[ae]\s*tiratura|poche\s*copie/i.test(softMsg)) {
            return "Non abbiamo quantità minime rigide! Con la stampa digitale realizziamo anche 10-20 copie. Per grandi tirature, l'offset garantisce prezzi più vantaggiosi. Quante copie ti servono?";
        }

        // ========== CONTATTI ==========
        if (/contatt[oi]|telefono|email|dove|indirizzo|sede|ubicazione/i.test(softMsg)) {
            return "Siamo a Piantedo (SO), Via Nazionale 406/A. Tel: +39 0342 683265, Email: info@pinizzotto.it. Orari: Lun-Ven 8:30-12:30 / 14:00-18:00. Passa a trovarci o chiamaci!";
        }

        // ========== ORARI ==========
        if (/orar[io]|aperto|chiuso|quando\s+siete/i.test(softMsg)) {
            return "Siamo aperti dal lunedì al venerdì, dalle 8:30 alle 12:30 e dalle 14:00 alle 18:00. Chiusi sabato e domenica. Preferisci venire di persona o inviare una richiesta online?";
        }

        // ========== SPEDIZIONI ==========
        if (/spedizion[ie]|consegna|corriere|ricevo|inviate/i.test(softMsg)) {
            return "Consegniamo in tutta Italia tramite corriere espresso (24-48h). Spedizione gratuita per ordini sopra i 200€. Ritiro in sede sempre disponibile. Dove dobbiamo spedire?";
        }

        // ========== SPEDIZIONI ESTERO ==========
        if (/estero|svizzera|europa|ue|extra\s*ue|internazional/i.test(softMsg)) {
            return "Spediamo anche all'estero: UE in 3-6 giorni, Svizzera con pratiche doganali. Indicaci destinazione e quantità per quotare tempi e costi di trasporto.";
        }

        // ========== RITIRO IN SEDE ==========
        if (/ritiro\s+in\s+sede|passo\s+io|vengo\s+a\s+prendere|pickup/i.test(softMsg)) {
            return "Puoi ritirare in sede a Piantedo (SO), Via Nazionale 406/A. Avvisaci prima così prepariamo il pacco. Orari: Lun-Ven 8:30-12:30 / 14:00-18:00.";
        }

        // ========== PAGAMENTI ==========
        if (/pagament[oi]|come\s+si\s+paga|carta|bonifico|contanti/i.test(softMsg)) {
            return "Accettiamo bonifico bancario, carta di credito, PayPal e contanti alla consegna. Per aziende offriamo fatturazione con pagamento a 30 giorni. Come preferisci pagare?";
        }

        // ========== FATTURA / PARTITA IVA ==========
        if (/fattur[ao]|partita\s*iva|piva|codice\s*univoco|pec/i.test(softMsg)) {
            return "Emettiamo fattura elettronica. Inviaci P.IVA, intestazione, indirizzo, PEC/codice SDI insieme ai dettagli ordine a info@pinizzotto.it, oppure chiama +39 0342 683265.";
        }

        // ========== FILE / FORMATI ==========
        if (/file|formato|pdf|illustrator|photoshop|indesign|ai|psd/i.test(softMsg)) {
            return "Accettiamo file in PDF ad alta risoluzione (300dpi), AI, EPS, InDesign. Inviaceli via email o WeTransfer. Non hai i file pronti? Ti aiutiamo noi con la grafica!";
        }

        // ========== COLORI / PROFILI / SANGRIA ==========
        if (/colore|colori|cmyk|rgb|pantone|profilo|sangria|abbondanza|bleed/i.test(softMsg)) {
            return "Per stampa usa CMYK con profilo FOGRA, aggiungi 3mm di abbondanza e testi a 5mm dal bordo. Se hai colori Pantone li convertiamo o proponiamo la resa più vicina.";
        }

        // ========== FILE PROBLEMI / SUPPORTO ==========
        if (/file\s+(non\s+)?apre|errore\s+file|problemi\s+file|pdf\s+corrotto|font\s+mancanti/i.test(softMsg)) {
            return "Se il file dà errore o manca un font, inviaci il PDF e le sorgenti (AI/INDD) oppure una esportazione in PDF/X-1a. Possiamo sistemarlo noi e inviarti una prova.";
        }

        // ========== CAMPIONI / PROVE ==========
        if (/campion[ie]|prova|esempio|veder[e]|mostrare/i.test(softMsg)) {
            return "Possiamo inviarti campioni di carte e finiture, oppure realizzare una prova di stampa prima della tiratura definitiva. Passa in sede per toccare con mano la qualità! Ti interessa?";
        }

        // ========== CATALOGHI / MENU ==========
        if (/catalogo|menu|listino|ristorante|carta/i.test(softMsg)) {
            return "Stampiamo cataloghi e menu per ristoranti con rilegature varie: spirale, punto metallico, brossura. Carta plastificata lavabile per i menu. Quante pagine ha il tuo progetto?";
        }

        // ========== GADGET / PROMOZIONALI ==========
        if (/gadget|promozional[ie]|penne|tazze|shopper|portachiavi/i.test(softMsg)) {
            return "Oltre alla stampa, personalizziamo gadget: penne, tazze, shopper, USB, powerbank, portachiavi. Perfetti per fiere ed eventi aziendali. Che tipo di gadget ti serve?";
        }

        // ========== ADESIVI / VETROFANIE ==========
        if (/vetrofani[ae]|adesiv[io]\s+vetro|sticker|decal/i.test(softMsg)) {
            return "Realizziamo adesivi per vetrine, auto e moto. Materiali: vinile, microforato per vetri, trasparente. Stampa full color con taglio su misura. Per interno o esterno?";
        }

        // ========== RINGRAZIAMENTI ==========
        if (/grazie|perfetto|ok|va\s+bene|ottimo/i.test(softMsg)) {
            return "Figurati! Se hai altre domande o vuoi un preventivo personalizzato, contattaci al +39 0342 683265 o info@pinizzotto.it. Saremo felici di aiutarti! 😊";
        }

        // ========== URGENZA / EXPRESS ==========
        if (/urgente|subito|veloce|24\s*ore|domani/i.test(softMsg)) {
            return "Per urgenze offriamo il servizio express: consegna in 24 ore per biglietti da visita, volantini e manifesti. Costo aggiuntivo 30%. Chiamaci subito al +39 0342 683265!";
        }

        // ========== LINGUAGGIO OFFENSIVO / TONO ==========
        if (/(stronzo|vaff|idiot|cretino|scemo|merda|fuck|shit)/i.test(softMsg)) {
            return "Mi dispiace se qualcosa non è andato come doveva. Sono qui per aiutarti: dimmi il problema e lo risolviamo subito, oppure chiamaci al +39 0342 683265.";
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
