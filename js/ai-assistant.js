/* ==================================================================
   MADE UTIL — AI ASSISTANT v4.0
   Asistente inteligente que reemplaza el botón de WhatsApp
   ================================================================== */

const AI_KNOWLEDGE = {
    greetings: {
        keywords: ['hola', 'buenos', 'buenas', 'hey', 'saludos'],
        response: `¡Hola! 👋 Soy el asistente virtual de Made Util.

Puedo ayudarte con:
• 💰 Precios y presupuestos
• ⏱️ Tiempos de fabricación
• 🪵 Materiales y herrajes
• 📍 Zonas de cobertura
• 🔨 Nuestro proceso de trabajo

¿En qué te puedo ayudar hoy?`
    },
    precios: {
        keywords: ['precio', 'cuanto', 'cuesta', 'valor', 'presupuesto', 'costo'],
        response: `Los precios varían según materiales, diseño y tamaño:

**COCINAS**    $10M - $50M+
**CLOSETS**     $8M - $35M
**MOBILIARIO**  $5M - $25M

Factores que afectan el precio:
✓ Tipo de melamina (estándar o premium)
✓ Herrajes (Blum es más costoso pero premium)
✓ Tamaño del proyecto
✓ Acabados especiales

¿Te gustaría solicitar una cotización personalizada?`
    },
    tiempos: {
        keywords: ['cuanto demora', 'tiempo', 'plazo', 'cuando', 'duracion', 'semanas'],
        response: `Nuestro proceso completo tiene 6 etapas:

**01. Contacto inicial** → 24 horas
**02. Planeación** → 1 semana
**03. Visita y medición** → 1-2 días
**04. Diseño 3D** → 1 semana
**05. Fabricación** → 2-4 semanas
**06. Instalación** → 1-3 días

⏱️ **Tiempo total:** 4 a 6 semanas desde la aprobación del diseño.

¿Tienes una fecha específica en mente?`
    },
    materiales: {
        keywords: ['material', 'madera', 'melamina', 'herraje', 'calidad', 'marca'],
        response: `Trabajamos solo con materiales premium:

**TABLEROS**
• Melamina: Arauco, Masisa, Duratex
• MDF Ultra-light para puertas
• Espesores: 9mm, 12mm, 15mm, 18mm

**HERRAJES**
• Bisagras: Blum Clip Top, Blumotion
• Correderas: Blum Tandem (cierre suave)
• Sistemas de elevación: Aventos

**CANTOS**
• PVC Rehau 2mm (premium)
• Colores exactos a melamina

Todos con garantía de fábrica! 🏆`
    },
    zonas: {
        keywords: ['donde', 'zona', 'cobertura', 'envio', 'entrega', 'ciudad', 'ubicacion'],
        response: `Nuestra cobertura en Antioquia:

✅ **GRATIS:**
   • Sabaneta
   • Envigado

💰 **CON FLETE:**
   • Medellín Sur: $85,000
   • El Poblado: $95,000
   • Llanogrande: $160,000
   • El Retiro: $190,000
   • Guatapé: $450,000

⏱️ Entrega: 24-72 horas según zona

¿En qué ciudad estás ubicado?`
    },
    proceso: {
        keywords: ['como funciona', 'proceso', 'pasos', 'metodologia'],
        response: `Nuestro proceso garantiza calidad excepcional:

**PASO 1 → CONTACTO**
Nos cuentas tu necesidad vía formulario

**PASO 2 → PLANEACIÓN**
Organizamos brief: presupuesto, tiempos, estilo

**PASO 3 → VISITA**
Medimos tu espacio con precisión

**PASO 4 → DISEÑO 3D**
Renders fotorrealistas para que visualices todo

**PASO 5 → FABRICACIÓN**
Producción con actualizaciones semanales

**PASO 6 → INSTALACIÓN**
Montaje profesional + capacitación

¿Quieres iniciar tu proyecto?`
    },
    garantia: {
        keywords: ['garantia', 'warranty', 'respaldo', 'servicio'],
        response: `Nuestras garantías:

✅ **1 AÑO** en herrajes y estructura
✅ **6 MESES** en acabados superficiales
✅ **LIFETIME** en asesoría de mantenimiento

❌ **No cubre:**
• Daños por humedad directa
• Golpes o impactos
• Instalación en pisos no nivelados

Realizamos servicio post-venta gratuito en el primer mes.

¿Tienes alguna preocupación específica?`
    },
    categorias: {
        keywords: ['cocina', 'closet', 'vestidor', 'mueble', 'mobiliario', 'que hacen'],
        response: `Fabricamos 3 categorías principales:

🍳 **COCINAS**
Modulares, en L, en U, con isla
Electrodomésticos empotrados opcional

👔 **CLOSETS Y VESTIDORES**
Walk-in, lineales, en esquina
Sistemas de almacenaje inteligente

🪑 **MOBILIARIO**
Mesas, consolas, bibliotecas
Muebles de TV, escritorios

¿Cuál te interesa?`
    },
    formulario: {
        keywords: ['solicitar', 'cotizar', 'formulario', 'empezar', 'iniciar', 'proyecto'],
        response: `¡Perfecto! Para darte una cotización precisa necesito que completes nuestro formulario:

📋 [Ir al formulario de solicitud](/solicitar-proyecto.html)

Te contactaremos en **máximo 48 horas** con:
✓ Cotización detallada
✓ Timeline del proyecto
✓ Opciones de materiales
✓ Fecha de visita técnica

¿Te ayudo con alguna duda antes de llenar el formulario?`
    },
    whatsapp_request: {
        keywords: ['whatsapp', 'llamar', 'telefono', 'contacto directo', 'urgente', 'numero'],
        response: `Entiendo que prefieres contacto directo.

❓ **¿Ya enviaste tu solicitud por el formulario?**

• **SI** → Te contactaremos en máximo 48 horas
• **NO** → El formulario es más rápido y organizado

Si es **muy urgente** y necesitas el WhatsApp, cuéntame:
¿Qué hace tu caso urgente? Así puedo darte el número con justificación interna.`
    },
    whatsapp_justified: {
        trigger: 'manual',
        response: `Entiendo la urgencia. Aquí está el contacto directo con Isaac:

📱 **WhatsApp:** +57 301 240 0323
📧 **Email:** madeutilantioquia@gmail.com

**TIP:** Menciona que vienes de la web y tu nombre para atención prioritaria.

Horario de atención: Lunes a Viernes 8am-6pm, Sábados 9am-2pm`
    },
    default: {
        trigger: 'fallback',
        response: `Mmm, no estoy seguro de entender esa pregunta. 🤔

Puedo ayudarte con:
• 💰 Precios y presupuestos
• ⏱️ Tiempos de fabricación
• 🪵 Materiales disponibles
• 📍 Zonas de cobertura
• 🔨 Nuestro proceso

o si prefieres:

📋 [Ir directo al formulario de solicitud](/solicitar-proyecto.html)

¿Sobre qué quieres saber?`
    }
};

class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.whatsappRequests = 0;
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        this.loadHistory();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.id = 'ai-assistant';
        widget.className = 'ai-widget';
        widget.innerHTML = `
            <button class="ai-trigger" id="aiTrigger" aria-label="Abrir asistente">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="ai-trigger-text">¿Ayuda?</span>
            </button>
            <div class="ai-chat-window" id="aiChatWindow">
                <div class="ai-header">
                    <div class="ai-header-info">
                        <span class="ai-header-title">Asistente Made Util</span>
                        <span class="ai-header-status">● En línea</span>
                    </div>
                    <button class="ai-close" id="aiClose" aria-label="Cerrar chat">×</button>
                </div>
                <div class="ai-messages" id="aiMessages">
                    <div class="ai-message bot">
                        ¡Hola! 👋 Soy el asistente virtual de Made Util.<br><br>
                        Estoy aquí para responder tus preguntas sobre precios, tiempos, materiales y más.<br><br>
                        ¿En qué puedo ayudarte hoy?
                    </div>
                </div>
                <div class="ai-input-area">
                    <input 
                        type="text" 
                        placeholder="Escribe tu pregunta..." 
                        id="aiInput"
                        maxlength="300"
                    >
                    <button id="aiSend" aria-label="Enviar mensaje">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                    </button>
                </div>
                <div class="ai-footer">
                    Asistente automático • Made Util 2024
                </div>
            </div>
        `;
        document.body.appendChild(widget);
    }

    attachEventListeners() {
        const trigger = document.getElementById('aiTrigger');
        const close = document.getElementById('aiClose');
        const send = document.getElementById('aiSend');
        const input = document.getElementById('aiInput');

        trigger.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.closeChat());
        send.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('aiChatWindow');
        const trigger = document.getElementById('aiTrigger');

        if (this.isOpen) {
            window.style.display = 'flex';
            trigger.classList.add('active');
            setTimeout(() => document.getElementById('aiInput').focus(), 300);
        } else {
            window.style.display = 'none';
            trigger.classList.remove('active');
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('aiChatWindow').style.display = 'none';
        document.getElementById('aiTrigger').classList.remove('active');
    }

    sendMessage() {
        const input = document.getElementById('aiInput');
        const userMessage = input.value.trim();

        if (!userMessage) return;

        this.addMessage(userMessage, 'user');
        input.value = '';

        // Simular "escribiendo..."
        this.showTyping();
        setTimeout(() => {
            const botResponse = this.getResponse(userMessage);
            this.hideTyping();
            this.addMessage(botResponse, 'bot');
            this.saveHistory();
        }, 800);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('aiMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;

        // Convert markdown links
        text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
        messageDiv.innerHTML = text;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.conversationHistory.push({ sender, text, timestamp: Date.now() });
    }

    showTyping() {
        const messagesContainer = document.getElementById('aiMessages');
        const typing = document.createElement('div');
        typing.className = 'ai-message bot typing';
        typing.id = 'typingIndicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    getResponse(userText) {
        const text = userText.toLowerCase();

        // Check for WhatsApp urgency escalation
        if (text.includes('urgente') || text.includes('ya') || text.includes('ahora')) {
            this.whatsappRequests++;
            if (this.whatsappRequests >= 2) {
                return AI_KNOWLEDGE.whatsapp_justified.response;
            }
        }

        // Match knowledge base
        for (let key in AI_KNOWLEDGE) {
            const entry = AI_KNOWLEDGE[key];
            if (entry.keywords) {
                const match = entry.keywords.some(kw => text.includes(kw));
                if (match) return entry.response;
            }
        }

        // Default response
        return AI_KNOWLEDGE.default.response;
    }

    saveHistory() {
        try {
            sessionStorage.setItem('ai_chat_history', JSON.stringify(this.conversationHistory));
        } catch (e) {
            console.warn('Could not save chat history', e);
        }
    }

    loadHistory() {
        try {
            const saved = sessionStorage.getItem('ai_chat_history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
                // Opcional: restaurar mensajes previos
                // this.conversationHistory.forEach(msg => this.addMessage(msg.text, msg.sender));
            }
        } catch (e) {
            console.warn('Could not load chat history', e);
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AIAssistant());
} else {
    new AIAssistant();
}
