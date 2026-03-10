/* ========================================
   WHATSAPP NOTES SYSTEM
   Integración automática de notas desde WhatsApp
   ======================================== */

const WHATSAPP_NOTES_CONFIG = {
    autoSummarize: true,
    maxNoteLength: 500,
    systemPrompt: `Eres un asistente que resume conversaciones de WhatsApp en español.
    
Tu tarea:
- Extraer información clave de la conversación
- Crear un resumen conciso (máximo 2-3 líneas)
- Mantener tono profesional
- Identificar: preguntas, interés, especificaciones, presupuesto, urgencia
- Formato: "Cliente: [nombre] | Pregunta: [qué preguntó] | Respuesta dada: [qué respondiste]"

Sé breve pero informativo.`
};

class WhatsAppNotesManager {
    constructor() {
        this.apiEndpoint = '/api/whatsapp/sync-notes';
        this.isProcessing = false;
    }

    async processIncomingMessage(phoneNumber, message, recipientResponse, solicitudId = null) {
        try {
            // Buscar solicitud si no está proporcionada
            if (!solicitudId) {
                solicitudId = await this.findSolicitudByPhone(phoneNumber);
            }

            if (!solicitudId) {
                console.log('No se encontró solicitud para teléfono:', phoneNumber);
                return false;
            }

            // Generar resumen automático
            const summary = await this.generateSummary(message, recipientResponse);

            // Agregar nota a la solicitud
            await this.addNoteToSolicitud(solicitudId, {
                texto: summary,
                fuente: 'whatsapp',
                telefonoOrigen: phoneNumber,
                mensajeOriginal: message,
                respuestaEnviada: recipientResponse,
                timestamp: new Date().toISOString()
            });

            return true;
        } catch (err) {
            console.error('Error procesando mensaje WhatsApp:', err);
            return false;
        }
    }

    async findSolicitudByPhone(phoneNumber) {
        try {
            const response = await fetch(`/api/solicitudes-by-phone/${phoneNumber}`);
            const data = await response.json();
            return data.id || null;
        } catch (err) {
            return null;
        }
    }

    async generateSummary(message, response) {
        try {
            const summaryResponse = await fetch('/api/ia/summarize-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    response: response,
                    systemPrompt: WHATSAPP_NOTES_CONFIG.systemPrompt
                })
            });

            const data = await summaryResponse.json();
            return data.summary || `📱 ${message.substring(0, 100)}...`;
        } catch (err) {
            // Resumen fallback
            return `📱 ${message.substring(0, WHATSAPP_NOTES_CONFIG.maxNoteLength)}...`;
        }
    }

    async addNoteToSolicitud(solicitudId, noteData) {
        try {
            const response = await fetch(`/api/solicitudes/${solicitudId}/notas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            });

            return response.ok;
        } catch (err) {
            console.error('Error agregando nota:', err);
            return false;
        }
    }

    async syncAllPendingMessages() {
        try {
            const response = await fetch('/api/whatsapp/pending-messages');
            const messages = await response.json();

            for (const msg of messages) {
                await this.processIncomingMessage(
                    msg.phone,
                    msg.text,
                    msg.response,
                    msg.solicitudId
                );
            }

            return messages.length;
        } catch (err) {
            console.error('Error sincronizando mensajes:', err);
            return 0;
        }
    }
}

// ==================== INTEGRACIÓN CON SERVIDOR ====================

// Esta función debe llamarse desde whatsapp-handler.js
async function handleWhatsAppMessageWithNotes(phoneNumber, userMessage, botResponse, solicitudId = null) {
    const notesManager = new WhatsAppNotesManager();
    return await notesManager.processIncomingMessage(phoneNumber, userMessage, botResponse, solicitudId);
}

// Inicializar sincronización periódica
let whatsappNotesManager = null;

function initWhatsAppNotesSystem() {
    whatsappNotesManager = new WhatsAppNotesManager();

    // Sincronizar cada 30 segundos
    setInterval(async () => {
        const count = await whatsappNotesManager.syncAllPendingMessages();
        if (count > 0) {
            console.log(`✅ ${count} mensajes de WhatsApp sincronizados a notas`);
        }
    }, 30000);

    console.log('✅ Sistema de Notas WhatsApp iniciado');
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WhatsAppNotesManager,
        handleWhatsAppMessageWithNotes,
        initWhatsAppNotesSystem
    };
}
