/* ==============================================
   MADE UTIL — SMS NOTIFICATIONS ROUTE
   Envío de notificaciones SMS via Twilio
   ============================================== */
const express = require('express');
const router = express.Router();

// Configuración Twilio (cargar desde .env en producción)
const TWILIO_CONFIG = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || null,
    authToken: process.env.TWILIO_AUTH_TOKEN || null,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || null,
    enabled: false // Cambiar a true cuando se configure Twilio
};

const ADMIN_PHONE = process.env.ADMIN_PHONE || '+573005444049';

// Initialize Twilio client if configured
let twilioClient = null;
if (TWILIO_CONFIG.accountSid && TWILIO_CONFIG.authToken) {
    try {
        const twilio = require('twilio');
        twilioClient = twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);
        TWILIO_CONFIG.enabled = true;
        console.log('✓ Twilio SMS habilitado');
    } catch (e) {
        console.warn('⚠ Twilio no configurado - SMS deshabilitados');
    }
}

/**
 * Enviar SMS de notificación
 * POST /api/sms/send
 */
router.post('/send', async (req, res) => {
    try {
        const { to, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({ error: 'Teléfono y mensaje requeridos' });
        }

        // Si Twilio está configurado, enviar SMS real
        if (TWILIO_CONFIG.enabled && twilioClient) {
            const result = await twilioClient.messages.create({
                body: message,
                from: TWILIO_CONFIG.phoneNumber,
                to: to
            });

            console.log(`📱 SMS enviado a ${to}: ${result.sid}`);
            return res.json({
                success: true,
                messageId: result.sid,
                status: result.status
            });
        }

        // Modo desarrollo: solo log en consola
        console.log(`\n📱 SMS (SIMULADO - Twilio no configurado):`);
        console.log(`Para: ${to}`);
        console.log(`Mensaje:\n${message}`);
        console.log('─'.repeat(50) + '\n');

        return res.json({
            success: true,
            messageId: 'dev_' + Date.now(),
            status: 'simulated',
            note: 'SMS simulado - Configura Twilio para envío real'
        });

    } catch (error) {
        console.error('Error enviando SMS:', error);
        return res.status(500).json({
            error: 'Error al enviar SMS',
            details: error.message
        });
    }
});

/**
 * Enviar notificación de nuevo lead al admin
 * Método interno usado por /api/leads
 */
async function notifyNewLead(leadData) {
    const message = `🔔 NUEVA SOLICITUD MADE UTIL

👤 ${leadData.nombre}
📍 ${leadData.ciudad || 'Sin ciudad'}
📱 ${leadData.telefono}
🎨 ${leadData.categorias || 'No especificado'}
💰 ${leadData.presupuesto || 'No especificado'}

Ver en admin: ${process.env.BASE_URL || 'http://localhost:3001'}/admin.html`;

    try {
        if (TWILIO_CONFIG.enabled && twilioClient) {
            const result = await twilioClient.messages.create({
                body: message,
                from: TWILIO_CONFIG.phoneNumber,
                to: ADMIN_PHONE
            });
            console.log(`✅ Notificación SMS enviada al admin: ${result.sid}`);
            return { success: true, messageId: result.sid };
        } else {
            // Modo desarrollo
            console.log(`\n📱 NOTIFICACIÓN ADMIN (SIMULADO):`);
            console.log(`Para: ${ADMIN_PHONE}`);
            console.log(`Mensaje:\n${message}`);
            console.log('─'.repeat(50) + '\n');
            return { success: true, simulated: true };
        }
    } catch (error) {
        console.error('Error enviando notificación al admin:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Verificar estado de configuración SMS
 * GET /api/sms/status
 */
router.get('/status', (req, res) => {
    res.json({
        enabled: TWILIO_CONFIG.enabled,
        adminPhone: ADMIN_PHONE,
        configured: !!(TWILIO_CONFIG.accountSid && TWILIO_CONFIG.authToken),
        note: TWILIO_CONFIG.enabled ?
            'SMS habilitados via Twilio' :
            'SMS en modo simulado - Configurar variables de entorno para activar'
    });
});

module.exports = router;
module.exports.notifyNewLead = notifyNewLead;
