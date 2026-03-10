
/* =================================================
   MADE UTIL — SERVER MONGO COMPLETO
   IA Cliente + IA Admin + Cotizaciones Inteligentes
   ================================================= */

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// ==================== MONGODB SETUP ====================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/madeutil';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('🍃 MongoDB Conectado (Mongoose)'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Models
const Solicitud = mongoose.model('Solicitud', new mongoose.Schema({
    id: String,
    nombre: String,
    telefono: String,
    email: String,
    ciudad: String,
    descripcion: String,
    status: String,
    fecha: String,
    origen: String,
    notas: [String],
    resumen_ia: String,
    cotizaciones: [String]
}, { strict: false }));

const Cotizacion = mongoose.model('Cotizacion', new mongoose.Schema({
    id: String,
    solicitudId: String,
    items: [mongoose.Schema.Types.Mixed],
    total: Number,
    margen: Number,
    fecha: String,
    status: String
}, { strict: false }));

const Lead = mongoose.model('Lead', new mongoose.Schema({
    id: String,
    nombre: String,
    telefono: String,
    email: String,
    ciudad: String,
    mensaje: String,
    fecha: String
}, { strict: false }));

const Review = mongoose.model('Review', new mongoose.Schema({
    id: String,
    name: String,
    project: String,
    text: String,
    stars: Number,
    visible: Boolean,
    createdAt: String
}, { strict: false }));

const Precio = mongoose.model('Precio', new mongoose.Schema({
    key: String,
    value: Number
}, { strict: false }));

// Initialize prices if empty
async function initializePrices() {
    const count = await Precio.countDocuments();
    if (count === 0) {
        const defaultPrices = {
            'MDF 18mm blanco': 85000,
            'MDF 18mm natural': 85000,
            'Tubo cuadrado 40x40': 45000,
            'Bisagra 35mm': 8500,
            'Manija cromada': 12000,
            'Vidrio templado 6mm': 150000
        };
        for (const [key, value] of Object.entries(defaultPrices)) {
            await new Precio({ key, value }).save();
        }
    }
}
mongoose.connection.once('open', initializePrices);

// Helpers
async function loadPricesObj() {
    const precios = await Precio.find();
    let obj = {};
    precios.forEach(p => obj[p.key] = p.value);
    return obj;
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

app.get('/api/solicitudes', async (req, res) => {
    try {
        const data = await Solicitud.find({}, '-_id -__v');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/solicitudes', async (req, res) => {
    try {
        const id = 'sol_' + Date.now();
        const solicitud = new Solicitud({
            id: id,
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
        });

        await solicitud.save();
        const saved = await Solicitud.findOne({ id }, '-_id -__v');

        console.log(`📋 Nueva solicitud: ${saved.nombre} (${saved.origen})`);
        res.json({ success: true, solicitud: saved });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/solicitudes-by-phone/:phone', async (req, res) => {
    try {
        const solicitudes = await Solicitud.find({}, '-_id -__v');
        const solicitud = solicitudes.find(s => 
            (s.telefono && s.telefono.includes(req.params.phone)) || 
            (s.telefono && req.params.phone.includes(s.telefono.slice(-7)))
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

app.put('/api/solicitudes/:id/status', async (req, res) => {
    try {
        const solicitud = await Solicitud.findOneAndUpdate(
            { id: req.params.id }, 
            { status: req.body.status },
            { new: true, projection: '-_id -__v' }
        );
        
        if (solicitud) {
            res.json({ success: true, solicitud });
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/solicitudes/:id/notas', async (req, res) => {
    try {
        const notaTexto = req.body.nota || req.body.texto;
        const solicitud = await Solicitud.findOneAndUpdate(
            { id: req.params.id },
            { $push: { notas: notaTexto } },
            { new: true, projection: '-_id -__v' }
        );
        
        if (solicitud) {
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

app.get('/api/cotizaciones', async (req, res) => {
    try {
        const data = await Cotizacion.find({}, '-_id -__v');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/cotizaciones', async (req, res) => {
    try {
        const cotizacion = new Cotizacion({
            id: 'cot_' + Date.now(),
            solicitudId: req.body.solicitudId,
            items: req.body.items,
            total: req.body.total,
            margen: req.body.margen || 1.8,
            fecha: new Date().toISOString(),
            status: 'pendiente'
        });

        await cotizacion.save();
        
        // Agregar nota a solicitud
        await Solicitud.updateOne(
            { id: req.body.solicitudId },
            { $push: { cotizaciones: cotizacion.id } }
        );

        const saved = await Cotizacion.findOne({ id: cotizacion.id }, '-_id -__v');
        console.log(`💰 Nueva cotización: ${cotizacion.id}`);
        res.json({ success: true, cotizacion: saved });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== API: PRECIOS ====================

app.get('/api/precios', async (req, res) => {
    try {
        const prices = await loadPricesObj();
        res.json(prices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/precios', async (req, res) => {
    try {
        const bodyObj = req.body;
        for (const [key, value] of Object.entries(bodyObj)) {
            await Precio.findOneAndUpdate(
                { key },
                { value },
                { upsert: true }
            );
        }
        console.log('💾 Precios actualizados en MongoDB');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== API: IA ====================

app.post('/api/ia/client-chat', async (req, res) => {
    try {
        const { message, image, history, systemPrompt } = req.body;
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

app.post('/api/ia/admin-chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        let response = `Alex: `;

        if (message.toLowerCase().includes('precio')) {
            const productMatch = message.match(/\b(\w+(?:\s+\w+)?)\b/);
            const product = productMatch ? productMatch[0] : 'producto';
            const prices = await loadPricesObj();
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

app.get('/api/status', async (req, res) => {
    try {
        res.json({
            status: 'online',
            solicitudes: await Solicitud.countDocuments(),
            cotizaciones: await Cotizacion.countDocuments(),
            reviews: await Review.countDocuments(),
            whatsappMessages: 0,
            uptime: process.uptime(),
            version: '7.0-MONGO',
            features: ['IA Cliente', 'IA Admin', 'Sistema Cotizaciones', 'WhatsApp Integration', 'MongoDB Cloud']
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== LEGACY ENDPOINTS ====================

app.post('/api/leads', async (req, res) => {
    try {
        const lead = new Lead({
            id: Date.now().toString(),
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            email: req.body.email,
            ciudad: req.body.ciudad,
            mensaje: req.body.mensaje,
            fecha: new Date().toISOString()
        });
        await lead.save();
        res.json({ success: true, id: lead.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/leads', async (req, res) => {
    try {
        const data = await Lead.find({}, '-_id -__v');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/reviews', async (req, res) => {
    try {
        const review = new Review({
            id: Date.now().toString(),
            name: req.body.name,
            project: req.body.project,
            text: req.body.text,
            stars: req.body.stars || 5,
            visible: true,
            createdAt: new Date().toISOString()
        });
        await review.save();
        res.json({ success: true, id: review.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const data = await Review.find({}, '-_id -__v');
        res.json(data);
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
║  🏗️  MADE UTIL SERVER MONGO - Ready       ║
║                                           ║
║  ✅ http://localhost:${PORT}                  ║
║                                           ║
║  ⚡ Base de Datos: MONGODB ATLAS           ║
║                                           ║
╚═══════════════════════════════════════════╝
    `);
});

module.exports = app;
