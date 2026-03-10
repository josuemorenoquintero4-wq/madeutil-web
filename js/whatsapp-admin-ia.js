/* ========================================
   ADMIN WHATSAPP IA
   Tu asistente personal en WhatsApp
   Te ayuda a responder + resume conversaciones
   ======================================== */

const ADMIN_WHATSAPP_CONFIG = {
    name: 'Assistant',
    role: 'Tu Asistente en WhatsApp',

    responseSystemPrompt: `Eres un asistente experto en atención al cliente de Made Util.

Tu rol:
- Ayudar al admin a RESPONDER mensajes de clientes
- Sugerir respuestas profesionales y amigables
- Basarse en información de la solicitud cuando esté disponible
- Mantener tono de Made Util: profesional, cálido, directo
- NUNCA inventar información sobre precios (siempre decir "te paso presupuesto")

Cuando el admin dice "Ayúdame a responder", generarás opciones de respuesta.
Cuando dice "Qué debo saber de este cliente", buscas en historial y das contexto.`,

    summarySystemPrompt: `Eres un resumidor de conversaciones.
    
Tu tarea:
- Leer una conversación de WhatsApp
- Extraer puntos clave: preguntas, respuestas, promesas, tareas pendientes
- Crear un resumen para notas administrativas
- Identificar: URGENCIA (alta/media/baja), SIGUIENTE PASO, ESTADO

Formato de salida:
📌 RESUMEN: [resumen de 2-3 líneas]
🔴 URGENCIA: [alta/media/baja]
✅ SIGUIENTE: [qué hacer después]
📋 ESTADO: [interesado/evaluando/negociando/cerrado]`
};

class AdminWhatsAppIA {
    constructor() {
        this.apiEndpoint = '/api/ia/whatsapp-admin';
        this.conversationHistory = [];
        this.clientHistory = {};
    }

    // Sugerir respuesta a un mensaje
    async suggestResponse(clientMessage, clientInfo = {}) {
        const prompt = `Cliente dice: "${clientMessage}"

Contexto:
- Nombre: ${clientInfo.nombre || 'Desconocido'}
- Teléfono: ${clientInfo.telefono || 'N/A'}
- Solicitud: ${clientInfo.descripcion || 'General'}
- Historial: ${clientInfo.historial || 'Primer contacto'}

Sugiere 3 opciones de respuesta profesionales y amigables.`;

        return await this.sendMessage(prompt, 'suggest_response');
    }

    // Dar contexto sobre un cliente
    async getClientContext(phoneNumber) {
        try {
            const response = await fetch(`/api/solicitudes-by-phone/${phoneNumber}`);
            const solicitud = await response.json();

            if (!solicitud) {
                return 'No hay información previas de este número.';
            }

            const context = `
CLIENTE: ${solicitud.nombre}
📍 Ciudad: ${solicitud.ciudad}
📝 Solicitud: ${solicitud.descripcion}
📅 Desde: ${new Date(solicitud.fecha).toLocaleDateString('es-CO')}
📌 Estado: ${solicitud.status}

HISTORIAL DE NOTAS:
${solicitud.notas?.slice(-5).map(n => `- ${n.texto} (${new Date(n.fecha).toLocaleDateString()})`).join('\n') || 'Sin notas previas'}

COTIZACIONES:
${solicitud.cotizaciones?.length || 0} cotizaciones enviadas
            `;

            return context;
        } catch (err) {
            return 'Error cargando contexto del cliente.';
        }
    }

    // Resumir una conversación
    async summarizeConversation(messages) {
        const conversationText = messages
            .map(m => `${m.sender}: ${m.text}`)
            .join('\n');

        const prompt = `Resumir esta conversación de WhatsApp:

${conversationText}

Proporciona:
1. Resumen ejecutivo (2-3 líneas)
2. Urgencia (alta/media/baja)
3. Siguiente paso
4. Estado de la conversación`;

        return await this.sendMessage(prompt, 'summarize');
    }

    // Analizar sentimiento
    async analyzeSentiment(message) {
        const prompt = `Analiza el sentimiento del cliente:
"${message}"

Responde con: SATISFECHO / NEUTRAL / INSATISFECHO y por qué.`;

        return await this.sendMessage(prompt, 'sentiment');
    }

    // Procesar orden de voz (transcripción)
    async processVoiceNote(transcription) {
        const prompt = `El admin dejó esta nota de voz:

"${transcription}"

¿Qué acciones debe tomar? ¿Se necesita responder algo a un cliente?`;

        return await this.sendMessage(prompt, 'voice');
    }

    // Sugerir precio para cliente especifico
    async suggestPriceForClient(clientInfo, productDescription) {
        const prompt = `Para el cliente ${clientInfo.nombre} de ${clientInfo.ciudad}:

Producto: ${productDescription}

Basándote en:
- Nivel de cliente: ${clientInfo.nivel || 'nuevo'}
- Historial: ${clientInfo.historial || 'ninguno'}
- Volumen estimado: ${clientInfo.volumen || 'desconocido'}

¿Qué margen y precio sugerirías?`;

        return await this.sendMessage(prompt, 'pricing');
    }

    async sendMessage(message, type = 'general') {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    type,
                    history: this.conversationHistory,
                    systemPrompt: ADMIN_WHATSAPP_CONFIG.responseSystemPrompt
                })
            });

            const data = await response.json();

            this.conversationHistory.push({
                role: 'user',
                content: message,
                type: type,
                timestamp: new Date().toISOString()
            });

            this.conversationHistory.push({
                role: 'assistant',
                content: data.response,
                timestamp: new Date().toISOString()
            });

            return data.response;
        } catch (err) {
            console.error('Error en AdminWhatsAppIA:', err);
            return 'Error procesando solicitud. Intenta de nuevo.';
        }
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

// ==================== WEBHOOKS PARA WHATSAPP PERSONAL ====================

// Este endpoint se configura en tu WhatsApp Business Account
// para recibir mensajes de clientes en tu número personal (3012400323)

async function handleAdminWhatsAppMessage(from, text, messageId) {
    const adminIA = new AdminWhatsAppIA();

    try {
        // Buscar cliente asociado
        const clientContext = await adminIA.getClientContext(from);

        // Guardar mensaje en base de datos
        await fetch('/api/whatsapp-admin/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from,
                text,
                messageId,
                context: clientContext,
                timestamp: new Date().toISOString()
            })
        });

        // Analizar sentimiento
        const sentiment = await adminIA.analyzeSentiment(text);

        // Si es mensurable como "urgente", notificar
        if (sentiment.includes('INSATISFECHO') || text.includes('urgente')) {
            notifyUrgentMessage(from, text, clientContext);
        }

        return {
            success: true,
            messageId,
            sentiment,
            context: clientContext
        };
    } catch (err) {
        console.error('Error procesando mensaje admin:', err);
        return { success: false, error: err.message };
    }
}

function notifyUrgentMessage(phone, message, context) {
    // Enviar notificación (notificación del navegador o sonido)
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⚠️ Mensaje Urgente de Cliente', {
            body: `De: ${phone}\n${message.substring(0, 50)}...`,
            icon: '🔴'
        });
    }
}

// ==================== INTEGRACIÓN CON HANDLER ====================

// Modificar whatsapp-handler.js para usar esto:
/*
const adminIA = new AdminWhatsAppIA();

function processMessage(userMessage, phoneNumber) {
    // Lógica existente...
    
    // Nuevo: procesar también para notas admin
    handleAdminWhatsAppMessage(phoneNumber, userMessage, generatedResponse);
}
*/

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AdminWhatsAppIA,
        handleAdminWhatsAppMessage
    };
}
