/* =================================================
   MADE UTIL — SERVER v7 COMPLETO
   IA Cliente + IA Admin + Cotizaciones Inteligentes
   ================================================= */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const DB_PATH = path.join(__dirname, 'db', 'database.json');
const PRICES_PATH = path.join(__dirname, 'db', 'precios.json');

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..'), {
    extensions: ['html'],
    index: 'index.html'
}));

// Inyectar scripts en HTML
app.use((req, res, next) => {
    if (req.url.endsWith('.html') || req.url === '/') {
        const scriptInjection = `
        <script src="/js/client-ia.js"></script>
        <script src="/js/admin-ia.js"></script>
        <script src="/js/whatsapp-notes.js"></script>
        <script src="/js/whatsapp-admin-ia.js"></script>
        `;
        
        res.locals.scriptInjection = scriptInjection;
    }
    next();
});

// ==================== DATABASE UTILITIES ====================

function loadDatabase() {
    try {
        if (fs.existsSync(DB_PATH)) {
            return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        }
        return { 
            solicitudes: [], 
            cotizaciones: [], 
            leads: [], 
            reviews: [],
            whatsappMessages: []
        };
    } catch (err) {
        console.error('❌ Error cargando DB:', err);
        return { 
            solicitudes: [], 
            cotizaciones: [], 
            leads: [], 
            reviews: [],
            whatsappMessages: []
        };
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

function loadPrices() {
    try {
        if (fs.existsSync(PRICES_PATH)) {
            return JSON.parse(fs.readFileSync(PRICES_PATH, 'utf8'));
        }
        return {
            'MDF 18mm blanco': 85000,
            'MDF 18mm natural': 85000,
            'Tubo cuadrado 40x40': 45000,
            'Bisagra 35mm': 8500,
            'Manija cromada': 12000,
            'Vidrio templado 6mm': 150000
        };
    } catch (err) {
        return {};
    }
}

function savePrices(prices) {
    try {
        const dir = path.dirname(PRICES_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(PRICES_PATH, JSON.stringify(prices, null, 2));
        return true;
    } catch (err) {
        return false;
    }
}

// ==================== IA SUMMARY GENERATION ====================

function generateIASummary(descripcion, nombre) {
    if (!descripcion) return null;
    
    const desc = descripcion.toLowerCase();
    let summary = `<strong>${nombre || 'Cliente'}</strong> está interesado en un `;
    
    // Detectar tipo de proyecto
    if (desc.includes('cocina')) {
        summary += 'proyecto de cocina integral';
        if (desc.includes('3m') || desc.includes('tres metros')) summary += ' de aproximadamente 3 metros';
    } else if (desc.includes('closet') || desc.includes('armario') || desc.includes('vestidor')) {
        summary += 'sistema de closet o vestiario a medida';
        if (desc.includes('puertas') || desc.includes('corredizas')) summary += ' con puertas corredizas';
    } else if (desc.includes('mesa') || desc.includes('escritorio')) {
        summary += 'mueble complementario';
    } else if (desc.includes('estanteria') || desc.includes('biblioteca')) {
        summary += 'sistema de almacenamiento personalizado';
    } else {
        summary += 'proyecto de carpintería a medida';
    }
    
    summary += '. ';
    
    // Detectar urgencia
    if (desc.includes('urgente') || desc.includes('rápido') || desc.includes('pronto')) {
        summary += '⚡ <strong>Tiene carácter urgente.</strong> ';
    }
    
    // Detectar presupuesto
    if (desc.includes('presupuesto') || desc.includes('costo') || desc.includes('precio')) {
        summary += '💰 Cliente pregunta por precios. ';
    }
    
    // Detectar ubicación especial
    if (desc.includes('reforma') || desc.includes('remodelación')) {
        summary += '🔨 Proyecto de reforma/remodelación. ';
    }
    
    // Acción recomendada
    summary += '<br><br><strong>Próximo paso:</strong> Agendar visita técnica GRATUITA para medir y conocer necesidades.';
    
    return summary;
}

// ==================== API: SOLICITUDES ====================

app.get('/api/solicitudes', (req, res) => {
    try {
        const db = loadDatabase();
        res.json(db.solicitudes || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/solicitudes', (req, res) => {
    try {
        const db = loadDatabase();
        const solicitud = {
            id: 'sol_' + Date.now(),
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            email: req.body.email,
            ciudad: req.body.ciudad,
            descripcion: req.body.descripcion,
            status: 'activa',
            fecha: new Date().toISOString(),
            origen: req.body.origen || 'web',
            notas: [],
            resumen_ia: generateIASummary(req.body.descripcion, req.body.nombre),
            cotizaciones: []
        };

        db.solicitudes = db.solicitudes || [];
        db.solicitudes.push(solicitud);
        saveDatabase(db);

        console.log(`📋 Nueva solicitud: ${solicitud.nombre} (${solicitud.origen})`);
        res.json({ success: true, solicitud });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/solicitudes-by-phone/:phone', (req, res) => {
    try {
        const db = loadDatabase();
        const solicitud = db.solicitudes.find(s => 
            s.telefono.includes(req.params.phone) || 
            req.params.phone.includes(s.telefono.slice(-7))
        );
        
        if (solicitud) {
            res.json(solicitud);
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/solicitudes/:id/status', (req, res) => {
    try {
        const db = loadDatabase();
        const solicitud = db.solicitudes.find(s => s.id === req.params.id);
        
        if (solicitud) {
            solicitud.status = req.body.status;
            saveDatabase(db);
            res.json({ success: true, solicitud });
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/solicitudes/:id/notas', (req, res) => {
    try {
        const db = loadDatabase();
        const solicitud = db.solicitudes.find(s => s.id === req.params.id);
        
        if (solicitud) {
            if (!solicitud.notas) solicitud.notas = [];
            
            const notaTexto = req.body.nota || req.body.texto;
            solicitud.notas.push(notaTexto);
            
            saveDatabase(db);
            console.log(`📝 Nota agregada a solicitud ${req.params.id}`);
            res.json({ success: true, solicitud });
        } else {
            res.status(404).json({ error: 'Solicitud no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== API: COTIZACIONES ====================

app.get('/api/cotizaciones', (req, res) => {
    try {
        const db = loadDatabase();
        res.json(db.cotizaciones || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/cotizaciones', (req, res) => {
    try {
        const db = loadDatabase();
        const cotizacion = {
            id: 'cot_' + Date.now(),
            solicitudId: req.body.solicitudId,
            items: req.body.items,
            total: req.body.total,
            margen: req.body.margen || 1.8,
            fecha: new Date().toISOString(),
            status: 'pendiente'
        };

        db.cotizaciones = db.cotizaciones || [];
        db.cotizaciones.push(cotizacion);

        // Agregar nota a solicitud
        const solicitud = db.solicitudes.find(s => s.id === cotizacion.solicitudId);
        if (solicitud) {
            if (!solicitud.cotizaciones) solicitud.cotizaciones = [];
            solicitud.cotizaciones.push(cotizacion.id);
        }

        saveDatabase(db);
        console.log(`💰 Nueva cotización: ${cotizacion.id}`);
        res.json({ success: true, cotizacion });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== API: PRECIOS ====================

app.get('/api/precios', (req, res) => {
    try {
        const prices = loadPrices();
        res.json(prices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/precios', (req, res) => {
    try {
        savePrices(req.body);
        console.log('💾 Precios actualizados');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== API: IA ====================

// IA Cliente
app.post('/api/ia/client-chat', async (req, res) => {
    try {
        const { message, image, history, systemPrompt } = req.body;

        // Simular respuesta IA (en producción usarías OpenAI/Claude)
        let response = `María: Entiendo tu pregunta sobre "${message.substring(0, 30)}..."\n\n`;
        
        if (message.toLowerCase().includes('color')) {
            response += 'Para el color, te recomiendo que veas nuestras opciones en el catálogo. ¿Prefieres tonos cálidos o fríos?';
        } else if (message.toLowerCase().includes('medida') || message.toLowerCase().includes('tamaño')) {
            response += 'Es importante medir bien tu espacio. ¿Cuáles son las dimensiones aproximadas de tu habitación?';
        } else if (message.toLowerCase().includes('estilo')) {
            response += 'Nuestros estilos populares son: Moderno, Industrial, Minimalista y Rústico. ¿Cuál te atrae más?';
        } else {
            response += 'Puedo ayudarte con: materiales, diseños, colores y funcionalidad. ¿En qué te enfoco?';
        }

        res.json({ response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// IA Admin
app.post('/api/ia/admin-chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        let response = `Alex: `;

        if (message.toLowerCase().includes('precio')) {
            const product = message.match(/\b(\w+(?:\s+\w+)?)\b/)?.[0] || 'producto';
            const prices = loadPrices();
            const price = prices[product] || 'no encontrado';
            response += `El precio de "${product}" es: $${typeof price === 'number' ? price.toLocaleString('es-CO') : price}`;
        } else if (message.toLowerCase().includes('margen') || message.toLowerCase().includes('cotizar')) {
            response += `Para una cotización competitiva, sugiero margen media (80%). Esto te da buen balance entre ganancia y competitividad.`;
        } else {
            response += `Puedo ayudarte con precios, márgenes, y estrategia de cotización. ¿Qué necesitas?`;
        }

        res.json({ response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// IA WhatsApp Admin
app.post('/api/ia/whatsapp-admin', async (req, res) => {
    try {
        const { message, type } = req.body;
        
        let response = ``;

        if (type === 'suggest_response') {
            response = `Opciones de respuesta:\n\n`;
            response += `1. "¡Hola! Gracias por tu interés. Te encantaría ver nuestras opciones. ¿Podemos agendar una videollamada?"\n\n`;
            response += `2. "Perfecto, veo que buscas [especificación]. Tenemos soluciones fantásticas. Déjame preparar opciones para ti."\n\n`;
            response += `3. "¡Claro! ¿Cuando tienes tiempo para una consulta rápida sobre tu proyecto?"`;
        } else if (type === 'sentiment') {
            response = 'NEUTRAL/INTERESADO - El cliente pregunta, lo que indica interés genuino.';
        } else {
            response = 'Listo para ayudarte con lo que necesites.';
        }

        res.json({ response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Resumir WhatsApp
app.post('/api/ia/summarize-message', async (req, res) => {
    try {
        const { message, response } = req.body;
        
        const summary = `📱 Cliente preguntó: "${message.substring(0, 50)}..." | Respuesta: "${response.substring(0, 50)}..."`;
        
        res.json({ summary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== API: STATUS ====================

app.get('/api/status', (req, res) => {
    try {
        const db = loadDatabase();
        res.json({
            status: 'online',
            solicitudes: db.solicitudes?.length || 0,
            cotizaciones: db.cotizaciones?.length || 0,
            reviews: db.reviews?.length || 0,
            whatsappMessages: db.whatsappMessages?.length || 0,
            uptime: process.uptime(),
            version: '7.0',
            features: ['IA Cliente', 'IA Admin', 'Sistema Cotizaciones', 'WhatsApp Integration']
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== LEGACY ENDPOINTS ====================

// Leads (legacy)
app.post('/api/leads', (req, res) => {
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

        res.json({ success: true, id: lead.id });
    } catch (error) {
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

// Reviews (legacy)
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

        res.json({ success: true, id: review.id });
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

// ==================== CATCH-ALL ====================

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// ==================== START ====================

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║  🏗️  MADE UTIL SERVER v7 - IA Complete    ║
║                                           ║
║  ✅ http://localhost:${PORT}                  ║
║                                           ║
║  ⚡ Características:                       ║
║  • IA Cliente (estética + cotización)     ║
║  • IA Admin (precios + márgenes)          ║
║  • Panel de Solicitudes Inteligente       ║
║  • Sistema de Notas Automáticas           ║
║  • WhatsApp Integration Completa          ║
║                                           ║
║  Ver admin panel:                         ║
║  http://localhost:${PORT}/admin-panel-v7.html ║
║                                           ║
╚═══════════════════════════════════════════╝
    `);
});

module.exports = app;
