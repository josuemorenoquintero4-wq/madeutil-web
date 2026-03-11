/* ==============================================
   MADE UTIL — EMAIL NOTIFICATIONS
   Sistema de notificaciones por email (GRATIS)
   ============================================== */
const nodemailer = require('nodemailer');

// Configuración de email
const EMAIL_CONFIG = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'madeutilantioquia@gmail.com',
        pass: process.env.EMAIL_PASSWORD || null
    },
    enabled: false
};

// Inicializar transporter
let emailTransporter = null;

// Intentar configurar transporter si hay credenciales
if (EMAIL_CONFIG.auth.pass) {
    try {
        emailTransporter = nodemailer.createTransport(EMAIL_CONFIG);

        // Verificar conexión inmediatamente
        emailTransporter.verify((error, success) => {
            if (error) {
                console.error('❌ ERROR GMAIL:', error.message);
                console.error('👉 Posible causa: Contraseña incorrecta o bloqueo de seguridad.');
                console.error('👉 Solución: Usar App Password (ver LEEME_EMAILS.md)');
                EMAIL_CONFIG.enabled = false;
            } else {
                console.log('✅ GMAIL CONECTADO EXITOSAMENTE');
                console.log('📧 Listo para enviar correos desde:', EMAIL_CONFIG.auth.user);
                EMAIL_CONFIG.enabled = true;
            }
        });

    } catch (e) {
        console.warn('⚠ Email no configurado:', e.message);
    }
}

/**
 * Enviar notificación de nuevo lead por email
 */
async function notifyNewLeadEmail(leadData) {
    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
            <div style="background: #2d5a2d; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">🔔 NUEVA SOLICITUD</h1>
                <h2 style="margin: 10px 0 0 0; font-weight: normal;">Made Util</h2>
            </div>
            
            <div style="background: white; padding: 30px; margin-top: 20px;">
                <h2 style="color: #734627; border-bottom: 2px solid #734627; padding-bottom: 10px;">
                    Detalles del Cliente
                </h2>
                
                <table style="width: 100%; margin-top: 20px;">
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px; font-weight: bold; color: #666;">👤 Nombre:</td>
                        <td style="padding: 10px;">${leadData.nombre}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px; font-weight: bold; color: #666;">📱 Teléfono:</td>
                        <td style="padding: 10px;">${leadData.telefono}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px; font-weight: bold; color: #666;">📧 Email:</td>
                        <td style="padding: 10px;">${leadData.email || 'No especificado'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px; font-weight: bold; color: #666;">📍 Ciudad:</td>
                        <td style="padding: 10px;">${leadData.ciudad || 'No especificada'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px; font-weight: bold; color: #666;">🎨 Categorías:</td>
                        <td style="padding: 10px;">${leadData.categorias || 'No especificadas'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px; font-weight: bold; color: #666;">💰 Presupuesto:</td>
                        <td style="padding: 10px;">${leadData.presupuesto || 'No especificado'}</td>
                    </tr>
                    ${leadData.urgencia ? `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px; font-weight: bold; color: #666;">⏱️ Urgencia:</td>
                        <td style="padding: 10px;">${leadData.urgencia}</td>
                    </tr>
                    ` : ''}
                </table>
                
                ${leadData.descripcion ? `
                <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #734627;">
                    <h3 style="margin: 0 0 10px 0; color: #734627;">📝 Descripción:</h3>
                    <p style="margin: 0; line-height: 1.6;">${leadData.descripcion}</p>
                </div>
                ` : ''}
                
                ${leadData.horarios ? `
                <div style="margin-top: 15px; padding: 15px; background: #e8f5e8; border-left: 4px solid #2d5a2d;">
                    <h3 style="margin: 0 0 10px 0; color: #2d5a2d;">🕐 Horarios disponibles:</h3>
                    <p style="margin: 0; line-height: 1.6;">${leadData.horarios}</p>
                </div>
                ` : ''}
                
                <div style="margin-top: 30px; text-align: center;">
                    <a href="${process.env.BASE_URL || 'https://madeutil-web.onrender.com'}/admin.html" 
                       style="display: inline-block; background: #734627; color: white; padding: 15px 40px; 
                              text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Ver en Panel Admin
                    </a>
                </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p style="margin: 5px 0;">Made Util - Carpintería Arquitectónica</p>
                <p style="margin: 5px 0;">Medellín, Antioquia, Colombia</p>
                <p style="margin: 5px 0;">Fecha: ${new Date().toLocaleString('es-CO', { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
        </div>
    `;

    const textContent = `
🔔 NUEVA SOLICITUD MADE UTIL

DETALLES DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━

👤 Nombre: ${leadData.nombre}
📱 Teléfono: ${leadData.telefono}
📧 Email: ${leadData.email || 'No especificado'}
📍 Ciudad: ${leadData.ciudad || 'No especificada'}
🎨 Categorías: ${leadData.categorias || 'No especificadas'}
💰 Presupuesto: ${leadData.presupuesto || 'No especificado'}
${leadData.urgencia ? `⏱️ Urgencia: ${leadData.urgencia}` : ''}

${leadData.descripcion ? `
📝 DESCRIPCIÓN:
${leadData.descripcion}
` : ''}

${leadData.horarios ? `
🕐 HORARIOS DISPONIBLES:
${leadData.horarios}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━
Ver en admin: ${process.env.BASE_URL || 'https://madeutil-web.onrender.com'}/admin.html

Fecha: ${new Date().toLocaleString('es-CO')}
    `;

    try {
        if (EMAIL_CONFIG.enabled && emailTransporter) {
            // Enviar email real
            const info = await emailTransporter.sendMail({
                from: `"Made Util Notificaciones" <${EMAIL_CONFIG.auth.user}>`,
                to: EMAIL_CONFIG.auth.user, // Enviar al mismo email
                subject: `🔔 Nueva Solicitud: ${leadData.nombre} - ${leadData.categorias || 'Proyecto'}`,
                text: textContent,
                html: emailContent
            });

            console.log(`✅ Email enviado a ${EMAIL_CONFIG.auth.user}: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } else {
            // Modo simulado
            console.log('\n📧 EMAIL (SIMULADO - Configurar contraseña de Gmail):');
            console.log(`Para: madeutilantioquia@gmail.com`);
            console.log(`Asunto: 🔔 Nueva Solicitud: ${leadData.nombre}`);
            console.log('─'.repeat(50));
            console.log(textContent);
            console.log('─'.repeat(50) + '\n');

            return { success: true, simulated: true };
        }
    } catch (error) {
        console.error('❌ Error enviando email:', error.message);

        // Fallback: mostrar en consola
        console.log('\n📧 EMAIL (ERROR - Mostrando en consola):');
        console.log(textContent);
        console.log('─'.repeat(50) + '\n');

        return { success: false, error: error.message };
    }
}

/**
 * Verificar configuración de email
 */
async function verifyEmailConfig() {
    if (!emailTransporter) {
        return {
            configured: false,
            message: 'Email transporter no inicializado. Configura EMAIL_PASSWORD en .env'
        };
    }

    try {
        await emailTransporter.verify();
        return { configured: true, message: 'Email configurado correctamente' };
    } catch (error) {
        return { configured: false, message: error.message };
    }
}

module.exports = {
    notifyNewLeadEmail,
    verifyEmailConfig,
    EMAIL_CONFIG
};
