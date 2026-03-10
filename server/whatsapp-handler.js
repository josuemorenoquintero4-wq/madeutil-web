/* ==============================================
   WHATSAPP HANDLER — Made Util v6.0
   Procesa mensajes, genera respuestas inteligentes
   ============================================== */

const fs = require('fs');
const path = require('path');

// ==================== BASE DE CONOCIMIENTOS ====================

const KNOWLEDGE_BASE = {
    precios: {
        'armarios': 'Armarios: desde $800.000 COP',
        'cocinas': 'Cocinas modulares: desde $1.200.000 COP',
        'vestidores': 'Vestidores: desde $2.500.000 COP',
        'mesas': 'Mesas de madera: desde $400.000 COP',
        'consolas': 'Consolas modernas: desde $600.000 COP'
    },
    
    tiempos: {
        'armarios': '3-4 semanas',
        'cocinas': '4-6 semanas',
        'vestidores': '5-8 semanas',
        'mesas': '2-3 semanas',
        'consolas': '2-3 semanas'
    },

    respuestasAutomaticas: {
        'hola': '¡Hola! 👋 Bienvenido a Made Util. Somos especialistas en muebles personalizados de madera y diseño moderno.\n\n¿Qué te interesa?\n- 📦 Productos\n- 💰 Precios\n- ⏰ Tiempos de entrega\n- 📍 Ubicación\n- 💳 Formas de pago',
        
        'precio': 'Tenemos varias opciones según el mueble:\n\n📦 Armarios: desde $800.000\n🍳 Cocinas: desde $1.200.000\n👗 Vestidores: desde $2.500.000\n🪑 Mesas: desde $400.000\n\n¿Cuál te interesa?',
        
        'tiempo': '⏰ Tiempos de entrega:\n\n• Mesas y consolas: 2-3 semanas\n• Armarios: 3-4 semanas\n• Cocinas: 4-6 semanas\n• Vestidores: 5-8 semanas\n\nLos tiempos pueden variar según personalización.',
        
        'ubicacion': '📍 Nos encontramos en: Cali, Colombia\n\nTrabajamos con entregas a nivel nacional.\n¿De dónde eres?',
        
        'pago': '💳 Formas de pago:\n\n✓ Transferencia bancaria\n✓ Efectivo\n✓ Tarjeta de crédito\n✓ Financiación\n\n¿Prefieres algún método?',
        
        'horario': '🕐 Horarios: Lunes a Sábado, 10am - 6pm\n\nEstamos listos para atenderte 😊',
        
        'gracias': '¡De nada! 😊 Cualquier otra pregunta, aquí estamos.',
        
        'adios': 'Hasta luego 👋 ¡Que tengas un excelente día!'
    }
};

const DB_PATH = path.join(__dirname, 'db', 'database.json');

// ==================== FUNCIONES UTILITIES ====================

function loadDatabase() {
    try {
        if (fs.existsSync(DB_PATH)) {
            return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        }
        return { quotes: [], reviews: [], leads: [], whatsappMessages: [] };
    } catch (err) {
        console.error('❌ Error cargando DB:', err);
        return { quotes: [], reviews: [], leads: [], whatsappMessages: [] };
    }
}

function saveDatabase(data) {
    try {
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('❌ Error guardando DB:', err);
        return false;
    }
}

function normalizePhone(phone) {
    // Convierte 573005444049 → 3005444049
    let normalized = phone.replace(/\D/g, '');
    if (normalized.startsWith('57')) {
        normalized = normalized.slice(2);
    }
    return normalized;
}

function sanitizeInput(text) {
    return text.toLowerCase().trim();
}

function findQuoteByPhone(phoneNumber) {
    const db = loadDatabase();
    const normalized = normalizePhone(phoneNumber);
    return db.quotes.find(q => normalizePhone(q.phone) === normalized);
}

function addMessageToQuote(quoteId, message, sender = 'cliente') {
    const db = loadDatabase();
    const quote = db.quotes.find(q => q.id === quoteId);
    
    if (quote) {
        if (!quote.messages) quote.messages = [];
        if (!quote.notes) quote.notes = [];
        
        const msgRecord = {
            timestamp: new Date().toISOString(),
            sender,
            text: message
        };
        
        quote.messages.push(msgRecord);
        quote.notes.push(`[${new Date().toLocaleTimeString()}] ${sender.toUpperCase()}: ${message}`);
        
        saveDatabase(db);
        return true;
    }
    return false;
}

// ==================== PROCESAMIENTO INTELIGENTE ====================

function processMessage(userMessage, phoneNumber = 'unknown') {
    const sanitized = sanitizeInput(userMessage);
    
    // 1. Buscar respuesta automática exacta
    for (const [keyword, response] of Object.entries(KNOWLEDGE_BASE.respuestasAutomaticas)) {
        if (sanitized.includes(keyword)) {
            return {
                type: 'automated',
                response: response,
                confidence: 0.95
            };
        }
    }
    
    // 2. Buscar información de precios
    for (const [producto, precio] of Object.entries(KNOWLEDGE_BASE.precios)) {
        if (sanitized.includes(producto) || sanitized.includes('precio')) {
            return {
                type: 'info',
                response: `💰 ${KNOWLEDGE_BASE.precios[producto] || 'Consulta disponible'}`,
                confidence: 0.85
            };
        }
    }
    
    // 3. Buscar información de tiempos
    if (sanitized.includes('tiempo') || sanitized.includes('entrega') || sanitized.includes('cuanto tarda')) {
        return {
            type: 'info',
            response: '⏰ ' + KNOWLEDGE_BASE.respuestasAutomaticas['tiempo'],
            confidence: 0.9
        };
    }
    
    // 4. Cotización personalizada
    if (sanitized.includes('proyecto') || sanitized.includes('cotización') || sanitized.includes('cotizacion')) {
        return {
            type: 'quote_request',
            response: '📋 Perfecto, nos gustaría conocer más sobre tu proyecto.\n\n¿Puedes decirnos:\n• ¿Qué mueble necesitas?\n• ¿Medidas aproximadas?\n• ¿Estilo que busca?',
            confidence: 0.9
        };
    }
    
    // 5. Respuesta por defecto
    return {
        type: 'default',
        response: '👋 Entiendo. Para mejor asistencia, puedo ayudarte con:\n✓ Información de PRODUCTOS\n✓ PRECIOS\n✓ TIEMPOS de entrega\n✓ Crear una COTIZACIÓN\n\n¿Cuál es tu pregunta?',
        confidence: 0.5
    };
}

// ==================== WEBHOOK HANDLER ====================

function whatsappWebhookMiddleware(req, res, next) {
    try {
        const body = req.body;
        
        // Procesar mensaje entrante
        if (body.messages && body.messages.length > 0) {
            const message = body.messages[0];
            const phoneNumber = message.from;
            const userText = message.text?.body || '';
            
            console.log(`📨 Mensaje de ${phoneNumber}: ${userText}`);
            
            // Procesar el mensaje
            const response = processMessage(userText, phoneNumber);
            
            // Guardar en base de datos
            const db = loadDatabase();
            db.whatsappMessages.push({
                id: `msg_${Date.now()}`,
                phone: phoneNumber,
                text: userText,
                response: response.response,
                type: response.type,
                timestamp: new Date().toISOString()
            });
            saveDatabase(db);
            
            // Hacer la respuesta accesible
            req.whatsappResponse = response;
            console.log(`✅ Procesado: ${response.type}`);
        }
        
        next();
    } catch (err) {
        console.error('❌ Error en webhook:', err);
        next();
    }
}

function whatsappVerifyMiddleware(req, res) {
    const verifyToken = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const token = process.env.WHATSAPP_VERIFY_TOKEN || 'tu_token_aqui';
    
    if (verifyToken === token) {
        console.log('✅ Webhook verificado');
        res.send(challenge);
    } else {
        console.log('❌ Token inválido');
        res.status(403).send('Forbidden');
    }
}

// ==================== API SEND ====================

async function sendWhatsAppMessage(phoneNumber, message, platform = 'manychat') {
    const normalized = normalizePhone(phoneNumber);
    
    try {
        console.log(`📤 Enviando a ${normalized} vía ${platform}:`);
        
        if (platform === 'twilio') {
            return await sendViaTwilio(normalized, message);
        } else if (platform === 'meta') {
            return await sendViaMeta(normalized, message);
        } else {
            // ManyChat (automático)
            console.log('✅ Mensaje encolado en ManyChat');
            return { success: true, platform: 'manychat' };
        }
    } catch (err) {
        console.error('❌ Error enviando:', err);
        return { success: false, error: err.message };
    }
}

async function sendViaTwilio(phoneNumber, message) {
    try {
        const twilio = require('twilio');
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
        
        if (!accountSid || !authToken) {
            return { success: false, error: 'Twilio no configurado' };
        }
        
        const client = twilio(accountSid, authToken);
        const msg = await client.messages.create({
            from: `whatsapp:${fromNumber}`,
            to: `whatsapp:+57${phoneNumber}`,
            body: message
        });
        
        console.log(`✅ Twilio: ${msg.sid}`);
        return { success: true, messageId: msg.sid };
    } catch (err) {
        console.error('❌ Error Twilio:', err);
        return { success: false, error: err.message };
    }
}

async function sendViaMeta(phoneNumber, message) {
    try {
        const fetch = require('node-fetch');
        const token = process.env.WHATSAPP_API_TOKEN;
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        
        if (!token || !phoneNumberId) {
            return { success: false, error: 'Meta no configurado' };
        }
        
        const response = await fetch(
            `https://graph.instagram.com/v18.0/${phoneNumberId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: `57${phoneNumber}`,
                    type: 'text',
                    text: { body: message }
                })
            }
        );
        
        const data = await response.json();
        console.log(`✅ Meta: ${data.messages?.[0]?.id || 'enviado'}`);
        return { success: true, messageId: data.messages?.[0]?.id };
    } catch (err) {
        console.error('❌ Error Meta:', err);
        return { success: false, error: err.message };
    }
}

// ==================== ESTADÍSTICAS ====================

function getWhatsAppStats() {
    const db = loadDatabase();
    const messages = db.whatsappMessages || [];
    
    return {
        totalMessages: messages.length,
        byType: {
            automated: messages.filter(m => m.type === 'automated').length,
            info: messages.filter(m => m.type === 'info').length,
            quote_request: messages.filter(m => m.type === 'quote_request').length,
            default: messages.filter(m => m.type === 'default').length
        },
        lastMessage: messages[messages.length - 1] || null,
        uniquePhones: [...new Set(messages.map(m => m.phone))].length
    };
}

// ==================== EXPORTS ====================

module.exports = {
    KNOWLEDGE_BASE,
    loadDatabase,
    saveDatabase,
    normalizePhone,
    sanitizeInput,
    findQuoteByPhone,
    addMessageToQuote,
    processMessage,
    whatsappWebhookMiddleware,
    whatsappVerifyMiddleware,
    sendWhatsAppMessage,
    sendViaTwilio,
    sendViaMeta,
    getWhatsAppStats
};
