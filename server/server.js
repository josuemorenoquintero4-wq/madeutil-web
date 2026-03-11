/* ==============================================
   MADE UTIL — SERVER v6.0 COMPLETO
   WhatsApp + Formularios + Base de datos
   ============================================== */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importar handlers
const whatsappHandler = require('./whatsapp-handler');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== CONFIGURACIÓN DE EMAIL ====================
const emailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'madeutilantioquia@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
};

const transporter = nodemailer.createTransport(emailConfig);

// ==================== FUNCIONES DE EMAIL ====================

async function sendQuoteNotification(lead) {
    try {
        const mailOptions = {
            from: emailConfig.auth.user,
            to: emailConfig.auth.user, // Enviar a ti mismo
            subject: `🔔 NUEVA COTIZACIÓN - ${lead.nombre}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #c0763e;">Nueva Cotización Recibida</h2>
                    <div style="background: #f5f2ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #0f0e0c;">Datos del Cliente:</h3>
                        <p><strong>Nombre:</strong> ${lead.nombre}</p>
                        <p><strong>Teléfono:</strong> ${lead.telefono}</p>
                        <p><strong>Email:</strong> ${lead.email || 'No proporcionado'}</p>
                        <p><strong>Ciudad:</strong> ${lead.ciudad || 'No especificada'}</p>
                        <p><strong>Fecha:</strong> ${new Date(lead.fecha).toLocaleString('es-CO')}</p>
                    </div>
                    <div style="background: #161412; color: #f5f2ed; padding: 20px; border-radius: 8px;">
                        <h3 style="margin-top: 0; color: #c0763e;">Mensaje del Cliente:</h3>
                        <p style="white-space: pre-line;">${lead.mensaje || 'Sin mensaje adicional'}</p>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: #c0763e; color: white; border-radius: 5px; text-align: center;">
                        <p style="margin: 0;"><strong>¡Revisa el admin panel para gestionar esta cotización!</strong></p>
                        <a href="${process.env.BASE_URL || 'https://madeutil-web.onrender.com'}/admin-panel.html" style="color: #f5f2ed; text-decoration: underline;">Ir al Admin Panel</a>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Notificación de cotización enviada para: ${lead.nombre}`);
        return true;
    } catch (error) {
        console.error('❌ Error enviando notificación de cotización:', error);
        return false;
    }
}

async function sendClientConfirmation(lead) {
    try {
        const mailOptions = {
            from: emailConfig.auth.user,
            to: lead.email,
            subject: `✅ Recibimos tu solicitud de cotización - Made Util`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #c0763e;">¡Gracias por contactarnos!</h2>
                    <div style="background: #f5f2ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p>Hola <strong>${lead.nombre}</strong>,</p>
                        <p>Hemos recibido tu solicitud de cotización y estamos revisándola. Nos pondremos en contacto contigo muy pronto.</p>
                        <p><strong>Datos registrados:</strong></p>
                        <ul>
                            <li>Teléfono: ${lead.telefono}</li>
                            <li>Ciudad: ${lead.ciudad || 'No especificada'}</li>
                            <li>Fecha: ${new Date(lead.fecha).toLocaleString('es-CO')}</li>
                        </ul>
                    </div>
                    <div style="background: #161412; color: #f5f2ed; padding: 20px; border-radius: 8px;">
                        <p><strong>¿Tienes alguna pregunta adicional?</strong></p>
                        <p>Escríbenos por WhatsApp: <a href="https://wa.me/573012400323" style="color: #c0763e;">+57 301 240 0323</a></p>
                        <p>O llámanos directamente al mismo número.</p>
                    </div>
                    <div style="margin-top: 20px; text-align: center; color: #666;">
                        <p>Made Util - Carpintería Arquitectónica<br>Medellín, Antioquia</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Confirmación enviada al cliente: ${lead.email}`);
        return true;
    } catch (error) {
        console.error('❌ Error enviando confirmación al cliente:', error);
        return false;
    }
}

// ==================== VARIABLES DE ENTORNO ====================
require('dotenv').config();

const DB_PATH = path.join(__dirname, 'db', 'database.json');

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..'), {
    extensions: ['html'],
    index: 'index.html'
}));

// ==================== UTILIDADES ====================

function loadDatabase() {
    try {
        if (fs.existsSync(DB_PATH)) {
            return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        }
        return { quotes: [], reviews: [], leads: [], whatsappMessages: [] };
    } catch (err) {
        console.error('❌ Error loading database:', err);
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
        console.error('❌ Error saving database:', err);
        return false;
    }
}

// ==================== API: FORMULARIOS & LEADS ====================

app.post('/api/leads', async (req, res) => {
    try {
        const db = loadDatabase();
        const lead = {
            id: Date.now().toString(),
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            email: req.body.email,
            ciudad: req.body.ciudad,
            mensaje: req.body.mensaje,
            fecha: new Date().toISOString()
        };

        db.leads = db.leads || [];
        db.leads.push(lead);
        saveDatabase(db);

        console.log(`📋 Nueva solicitud: ${lead.nombre} (${lead.telefono})`);

        // Enviar notificación por correo al administrador
        await sendQuoteNotification(lead);

        // Enviar confirmación al cliente si proporcionó email
        if (lead.email) {
            await sendClientConfirmation(lead);
        }

        res.json({ success: true, id: lead.id, message: 'Solicitud recibida y notificación enviada' });
    } catch (error) {
        console.error('❌ Error en /api/leads:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/leads', (req, res) => {
    try {
        const db = loadDatabase();
        res.json(db.leads || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== API: COTIZACIONES ====================

app.post('/api/quotes', (req, res) => {
    try {
        const db = loadDatabase();
        const quote = {
            id: Date.now().toString(),
            clientName: req.body.clientName,
            phone: req.body.phone,
            city: req.body.city,
            categories: req.body.categories,
            notes: req.body.notes || [],
            whatsappMessages: [],
            status: 'active',
            createdAt: new Date().toISOString()
        };

        db.quotes = db.quotes || [];
        db.quotes.push(quote);
        saveDatabase(db);

        console.log(`💰 Nueva cotización: ${quote.clientName} (${quote.phone})`);
        res.json({ success: true, id: quote.id, quote });
    } catch (error) {
        console.error('❌ Error en /api/quotes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/quotes', (req, res) => {
    try {
        const db = loadDatabase();
        res.json(db.quotes || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== API: RESEÑAS ====================

app.post('/api/reviews', (req, res) => {
    try {
        const db = loadDatabase();
        const review = {
            id: Date.now().toString(),
            name: req.body.name,
            project: req.body.project,
            text: req.body.text,
            stars: req.body.stars || 5,
            visible: true,
            createdAt: new Date().toISOString()
        };

        db.reviews = db.reviews || [];
        db.reviews.push(review);
        saveDatabase(db);

        console.log(`⭐ Nueva reseña: ${review.name}`);
        res.json({ success: true, id: review.id, review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/reviews', (req, res) => {
    try {
        const db = loadDatabase();
        res.json(db.reviews || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== API: WHATSAPP ====================

// Verificar webhook (Meta lo pide)
app.get('/api/whatsapp/webhook', (req, res) => {
    whatsappHandler.whatsappVerifyMiddleware(req, res);
});

// Recibir webhooks de WhatsApp
app.post('/api/whatsapp/webhook', (req, res) => {
    whatsappHandler.whatsappWebhookMiddleware(req, res);
    console.log('📱 WhatsApp webhook recibido');
});

// Enviar mensaje de prueba
app.post('/api/whatsapp/send', async (req, res) => {
    try {
        const { phone, message, platform } = req.body;
        const result = await whatsappHandler.sendWhatsAppMessage(
            phone,
            message,
            platform || 'manychat'
        );

        res.json({ success: result, message: 'Message queued' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Estadísticas
app.get('/api/whatsapp/stats', (req, res) => {
    try {
        const stats = whatsappHandler.getWhatsAppStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== API: STATUS ====================

app.get('/api/status', (req, res) => {
    const db = loadDatabase();
    res.json({
        status: 'online',
        leads: db.leads?.length || 0,
        quotes: db.quotes?.length || 0,
        reviews: db.reviews?.length || 0,
        whatsappMessages: db.whatsappMessages?.length || 0,
        uptime: process.uptime()
    });
});

// ==================== CATCH-ALL ====================
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint not found: ' + req.path });
    }
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ==================== START ====================
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║                                          ║
║   🏗️  MADE UTIL SERVER v6.0              ║
║   WhatsApp + IA + Database               ║
║                                          ║
║   ✅ http://localhost:${PORT}                ║
║                                          ║
║   Endpoints:                             ║
║   - /api/leads (Formularios)             ║
║   - /api/quotes (Cotizaciones)           ║
║   - /api/reviews (Reseñas)               ║
║   - /api/whatsapp/* (WhatsApp)           ║
║   - /api/status (Status)                 ║
║                                          ║
║   Abre esa URL en tu navegador           ║
║                                          ║
╚══════════════════════════════════════════╝
    `);
});

module.exports = app;
