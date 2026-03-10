/* ========================================
   ADMIN IA - Pricing & Quotation Assistant
   Ayuda a Admin con PRECIOS y COTIZACIONES
   Acceso a MADECENTRO
   ======================================== */

const ADMIN_IA_CONFIG = {
    name: 'Alex',
    role: 'Asesor de Precios y Cotizaciones',
    
    systemPrompt: `Eres Alex, asistente especializado en PRECIOS y COTIZACIONES de Made Util.

Tu rol:
- Ayudar a calcular cotizaciones precisas
- Sugerir precios competitivos basado en MADECENTRO
- Analizar márgenes de ganancia
- Proponer opciones de precios para diferentes clientes
- Hacer presupuestos detallados
- Aconsejar sobre descuentos estratégicos

Tienes acceso a:
- Base de precios MADECENTRO actualizada
- Histórico de cotizaciones
- Margen de ganancias configurado
- Información del cliente

Sé analítico, profesional y enfocado en GANANCIAS y RENTABILIDAD.
El objetivo es maximizar margen sin perder clientes.`,
    
    margins: {
        'baja': 1.5,  // 50% margen
        'media': 1.8, // 80% margen
        'alta': 2.2   // 120% margen
    }
};

class AdminIA {
    constructor(priceDatabase = {}) {
        this.apiEndpoint = '/api/ia/admin-chat';
        this.conversationHistory = [];
        this.priceDatabase = priceDatabase;
        this.isLoading = false;
        this.currentQuotation = null;
    }

    async sendMessage(message, context = {}) {
        if (!message.trim()) return null;

        this.isLoading = true;

        try {
            const payload = {
                message: message,
                history: this.conversationHistory,
                context: {
                    prices: this.priceDatabase,
                    currentQuotation: this.currentQuotation,
                    clientName: context.clientName,
                    ...context
                },
                systemPrompt: ADMIN_IA_CONFIG.systemPrompt
            };

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            this.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });

            this.conversationHistory.push({
                role: 'assistant',
                content: data.response,
                timestamp: new Date().toISOString()
            });

            return data.response;
        } catch (err) {
            console.error('Error en AdminIA:', err);
            return 'Error al procesar. Verifica tu conexión.';
        } finally {
            this.isLoading = false;
        }
    }

    calculateQuotation(items, marginLevel = 'media') {
        const margin = ADMIN_IA_CONFIG.margins[marginLevel] || 1.8;
        let total = 0;
        let details = [];

        items.forEach(item => {
            const baseCost = item.cost || (this.priceDatabase[item.name] || 0);
            const finalPrice = baseCost * margin;
            const profit = finalPrice - baseCost;

            total += finalPrice * item.quantity;

            details.push({
                name: item.name,
                quantity: item.quantity,
                baseCost: baseCost,
                finalPrice: finalPrice,
                unitProfit: profit,
                profitPercent: ((profit / baseCost) * 100).toFixed(1)
            });
        });

        return {
            items: details,
            total: total,
            margin: margin,
            profitTotal: total - items.reduce((sum, i) => sum + ((i.cost || 0) * i.quantity), 0)
        };
    }

    suggestPrices(productName, quality = 'media') {
        const basePrice = this.priceDatabase[productName];
        if (!basePrice) return null;

        const margins = {
            'baja': 1.3,
            'media': 1.8,
            'alta': 2.2,
            'premium': 2.8
        };

        return {
            productName,
            basePrice,
            suggestedPrices: Object.entries(margins).reduce((acc, [quality, margin]) => {
                acc[quality] = Math.ceil(basePrice * margin);
                return acc;
            }, {}),
            recommendation: 'media'
        };
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

// ==================== PANEL DE ADMIN IA ====================

function createAdminIAPanel() {
    const html = `
        <div id="adminIAPanel" class="admin-ia-panel">
            <div class="admin-ia-header">
                <div class="admin-ia-title">
                    <span class="admin-ia-avatar">👨‍💼</span>
                    <div>
                        <div>Alex - Asesor Precios</div>
                        <div style="font-size: 11px; opacity: 0.8;">Cotizaciones en tiempo real</div>
                    </div>
                </div>
            </div>

            <div class="admin-ia-tabs">
                <button class="admin-ia-tab active" onclick="switchAITab('chat')">💬 Chat</button>
                <button class="admin-ia-tab" onclick="switchAITab('calculator')">🧮 Calculadora</button>
                <button class="admin-ia-tab" onclick="switchAITab('suggestions')">💡 Sugerencias</button>
            </div>

            <div id="aiChatTab" class="admin-ia-tab-content active">
                <div id="adminIAChat" class="admin-ia-chat"></div>
                <div class="admin-ia-input-row">
                    <input 
                        type="text"
                        id="adminAIInput"
                        placeholder="Pregunta sobre precios, márgenes, cotizaciones..."
                        onkeypress="handleAdminAIKeypress(event)"
                    >
                    <button onclick="sendAdminAIMessage()" class="admin-ia-btn-send">Enviar</button>
                </div>
            </div>

            <div id="aiCalculatorTab" class="admin-ia-tab-content">
                <div class="admin-ia-calculator">
                    <h4>🧮 Calculadora de Precios</h4>
                    
                    <div style="margin-bottom: 15px;">
                        <label>Producto:</label>
                        <input type="text" id="calcProduct" placeholder="MDF 18mm blanco">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label>Cantidad:</label>
                        <input type="number" id="calcQty" value="1" min="1">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label>Margen:</label>
                        <select id="calcMargin">
                            <option value="baja">Baja (50%)</option>
                            <option value="media" selected>Media (80%)</option>
                            <option value="alta">Alta (120%)</option>
                        </select>
                    </div>

                    <button onclick="calculatePrice()" class="admin-ia-btn-primary">Calcular</button>

                    <div id="calcResult" style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px; display: none;"></div>
                </div>
            </div>

            <div id="aiSuggestionsTab" class="admin-ia-tab-content">
                <div class="admin-ia-suggestions">
                    <h4>💡 Sugerencias para esta Solicitud</h4>
                    <div id="suggestionsList" style="max-height: 300px; overflow-y: auto;"></div>
                </div>
            </div>
        </div>

        <style>
            .admin-ia-panel {
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                margin-top: 20px;
                overflow: hidden;
            }

            .admin-ia-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .admin-ia-avatar {
                font-size: 24px;
            }

            .admin-ia-tabs {
                display: flex;
                border-bottom: 1px solid #ddd;
            }

            .admin-ia-tab {
                flex: 1;
                padding: 12px;
                border: none;
                background: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.3s;
            }

            .admin-ia-tab:hover {
                background: #f5f5f5;
            }

            .admin-ia-tab.active {
                border-bottom-color: #667eea;
                color: #667eea;
                font-weight: bold;
            }

            .admin-ia-tab-content {
                display: none;
                padding: 15px;
                max-height: 400px;
                overflow-y: auto;
            }

            .admin-ia-tab-content.active {
                display: block;
            }

            .admin-ia-chat {
                height: 250px;
                overflow-y: auto;
                margin-bottom: 10px;
                padding: 10px;
                background: #f9f9f9;
                border-radius: 5px;
            }

            .admin-ia-message {
                margin-bottom: 10px;
                padding: 10px;
                background: white;
                border-left: 3px solid #667eea;
                border-radius: 3px;
                font-size: 13px;
            }

            .admin-ia-message.user {
                background: #e3f2fd;
                border-left-color: #2196f3;
            }

            .admin-ia-calculator,
            .admin-ia-suggestions {
                font-size: 13px;
            }

            .admin-ia-calculator label,
            .admin-ia-suggestions label {
                display: block;
                font-weight: bold;
                margin-bottom: 5px;
                color: #333;
            }

            .admin-ia-calculator input,
            .admin-ia-calculator select {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
            }

            .admin-ia-btn-primary {
                width: 100%;
                padding: 10px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s;
            }

            .admin-ia-btn-primary:hover {
                background: #5568d3;
            }

            .admin-ia-input-row {
                display: flex;
                gap: 10px;
            }

            .admin-ia-input-row input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
            }

            .admin-ia-btn-send {
                padding: 10px 20px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            }

            .admin-ia-btn-send:hover {
                background: #5568d3;
            }

            .price-suggestion {
                background: #f0f0f0;
                padding: 10px;
                margin: 5px 0;
                border-radius: 4px;
                font-size: 12px;
            }

            .price-suggestion strong {
                color: #667eea;
            }
        </style>
    `;

    return html;
}

// ==================== FUNCIONES DE CONTROL ====================

let adminIA = null;

function initAdminIA(priceDatabase = {}) {
    adminIA = new AdminIA(priceDatabase);
    
    const chatDiv = document.getElementById('adminIAChat');
    if (chatDiv) {
        chatDiv.innerHTML = `
            <div class="admin-ia-message">
                <strong>Alex:</strong> ¡Hola! Soy tu asesor de precios y cotizaciones.
                <br><br>Puedo ayudarte a:
                <br>✓ Calcular márgenes de ganancia
                <br>✓ Crear cotizaciones
                <br>✓ Sugerir precios estratégicos
                <br>✓ Analizar rentabilidad
                <br><br>¿Qué necesitas?
            </div>
        `;
    }
}

function switchAITab(tabName) {
    document.querySelectorAll('.admin-ia-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-ia-tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById('ai' + tabName.charAt(0).toUpperCase() + tabName.slice(1) + 'Tab').classList.add('active');
}

function handleAdminAIKeypress(event) {
    if (event.key === 'Enter') {
        sendAdminAIMessage();
    }
}

async function sendAdminAIMessage() {
    const input = document.getElementById('adminAIInput');
    const message = input.value.trim();
    
    if (!message || !adminIA) return;

    const chatDiv = document.getElementById('adminIAChat');

    // Mostrar pregunta
    chatDiv.innerHTML += `
        <div class="admin-ia-message user">
            <strong>Tú:</strong> ${message}
        </div>
    `;

    // Enviar a IA
    const response = await adminIA.sendMessage(message);

    // Mostrar respuesta
    chatDiv.innerHTML += `
        <div class="admin-ia-message">
            <strong>Alex:</strong> ${response}
        </div>
    `;

    input.value = '';
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

function calculatePrice() {
    if (!adminIA) return;

    const product = document.getElementById('calcProduct').value;
    const qty = parseInt(document.getElementById('calcQty').value);
    const margin = document.getElementById('calcMargin').value;

    const suggestion = adminIA.suggestPrices(product, margin);

    if (!suggestion) {
        alert('Producto no encontrado en base de datos');
        return;
    }

    const baseTotal = suggestion.basePrice * qty;
    const finalTotal = suggestion.suggestedPrices[margin] * qty;
    const profit = finalTotal - baseTotal;

    const resultDiv = document.getElementById('calcResult');
    resultDiv.innerHTML = `
        <div>
            <strong>${product}</strong><br>
            Precio base: $${suggestion.basePrice.toLocaleString('es-CO')}<br>
            Cantidad: ${qty}<br>
            <hr>
            <strong>Precio sugerido: $${suggestion.suggestedPrices[margin].toLocaleString('es-CO')}/unidad</strong><br>
            <strong style="color: green;">Total: $${finalTotal.toLocaleString('es-CO')}</strong><br>
            <strong style="color: #667eea;">Ganancia bruta: $${profit.toLocaleString('es-CO')}</strong>
        </div>
    `;

    resultDiv.style.display = 'block';
}

function loadSuggestionsForQuotation(solicitudId) {
    if (!adminIA) return;

    const suggestionsDiv = document.getElementById('suggestionsList');
    if (!suggestionsDiv) return;

    suggestionsDiv.innerHTML = `
        <p style="text-align: center; color: #999;">Cargando sugerencias...</p>
    `;

    // Simular sugerencias basadas en solicitud
    const suggestions = [
        '💡 Para este cliente parece que busca estilo moderno. Sugiero materiales premium con margen media (80%).',
        '💡 Volumen según descripción: aprox. 2-3 piezas. Puedes ofrecer descuento por volumen (5-10%).',
        '💡 Contacto directo (teléfono/WhatsApp). Posible cliente estable. Margen estándar recomendado.',
        '💡 Presupuesto estimado para esta solicitud: $2.5M - $4M COP según detalles finales.'
    ];

    suggestionsDiv.innerHTML = suggestions.map(s => `
        <div class="price-suggestion">${s}</div>
    `).join('');
}
