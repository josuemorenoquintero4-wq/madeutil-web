/* ==============================================
   MADE UTIL — SERVIDOR COMPLETO v5.0
   Backend funcional con base de datos integrada
   ============================================== */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'database.json');

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==================== DATABASE HELPERS ====================
function loadDB() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            const initialDB = {
                leads: [],
                reviews: [],
                projects: [],
                users: [
                    { id: 1, username: 'admin', password: bcrypt.hashSync('123', 10), role: 'admin' }
                ],
                faqs: [
                    { id: 1, q: '¿Cómo se maneja el precio de un proyecto?', a: 'Cada proyecto es único. El precio depende del diseño, tamaño, materiales y herrajes. Nos acoplamos a tu presupuesto y necesidades.' },
                    { id: 2, q: '¿Qué materiales utilizan?', a: 'Trabajamos con melaminas Arauco (alta resistencia), herrajes Blum (Alemania), perfilería de aluminio, vidrio templado.' },
                    { id: 3, q: '¿Cuánto tiempo toma un proyecto?', a: 'El tiempo promedio es de 4-8 semanas desde la aprobación del diseño hasta la instalación.' },
                    { id: 4, q: '¿Ofrecen garantía?', a: 'Sí. Ofrecemos 4 años de garantía estructural en todos nuestros muebles. Los herrajes Blum tienen garantía del fabricante de por vida.' },
                    { id: 5, q: '¿Qué zonas de Medellín cubren?', a: 'Cubrimos toda el Área Metropolitana: Medellín, El Poblado, Envigado, Sabaneta, La Estrella, Itagüí, Llanogrande y Rionegro.' },
                    { id: 6, q: '¿Cómo inicio mi proyecto?', a: 'Puedes completar nuestro formulario de cotización, llamarnos al 300 544 4049 o escribirnos por WhatsApp. Te respondemos en menos de 24 horas.' }
                ]
            };
            fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
            return initialDB;
        }
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (err) {
        console.error('Error loading DB:', err);
        return { leads: [], reviews: [], projects: [], users: [], faqs: [] };
    }
}

function saveDB(db) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (err) {
        console.error('Error saving DB:', err);
    }
}

let db = loadDB();

// ==================== STATIC FILES ====================
app.use(express.static(path.join(__dirname, '..'), {
    extensions: ['html'],
    index: 'index.html'
}));

// ==================== AUTH ====================
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.users.find(u => u.username === username);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
});

app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true });
});

// ==================== LEADS / COTIZACIONES ====================
app.post('/api/leads', (req, res) => {
    const lead = {
        id: Date.now(),
        ...req.body,
        fecha: new Date().toISOString(),
        estado: 'nuevo'
    };
    db.leads.push(lead);
    saveDB(db);
    console.log('📋 Nueva solicitud:', lead.nombre, '-', lead.telefono);
    res.json({ success: true, id: lead.id });
});

app.get('/api/leads', (req, res) => {
    res.json(db.leads.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
});

app.get('/api/leads/:id', (req, res) => {
    const lead = db.leads.find(l => l.id === parseInt(req.params.id));
    if (!lead) return res.status(404).json({ error: 'Lead no encontrado' });
    res.json(lead);
});

app.put('/api/leads/:id', (req, res) => {
    const idx = db.leads.findIndex(l => l.id === parseInt(req.params.id));
    if (idx < 0) return res.status(404).json({ error: 'Lead no encontrado' });
    db.leads[idx] = { ...db.leads[idx], ...req.body };
    saveDB(db);
    res.json(db.leads[idx]);
});

app.delete('/api/leads/:id', (req, res) => {
    const idx = db.leads.findIndex(l => l.id === parseInt(req.params.id));
    if (idx < 0) return res.status(404).json({ error: 'Lead no encontrado' });
    db.leads.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
});

// ==================== REVIEWS ====================
app.post('/api/reviews', (req, res) => {
    const review = {
        id: Date.now(),
        ...req.body,
        fecha: new Date().toISOString(),
        visible: true
    };
    db.reviews.push(review);
    saveDB(db);
    res.json({ success: true, id: review.id });
});

app.get('/api/reviews', (req, res) => {
    const visible = db.reviews.filter(r => r.visible !== false);
    res.json(visible);
});

app.get('/api/reviews/all', (req, res) => {
    res.json(db.reviews);
});

app.put('/api/reviews/:id', (req, res) => {
    const idx = db.reviews.findIndex(r => r.id === parseInt(req.params.id));
    if (idx < 0) return res.status(404).json({ error: 'Review no encontrado' });
    db.reviews[idx] = { ...db.reviews[idx], ...req.body };
    saveDB(db);
    res.json(db.reviews[idx]);
});

app.delete('/api/reviews/:id', (req, res) => {
    const idx = db.reviews.findIndex(r => r.id === parseInt(req.params.id));
    if (idx < 0) return res.status(404).json({ error: 'Review no encontrado' });
    db.reviews.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
});

// ==================== FAQ ====================
app.get('/api/faqs', (req, res) => {
    res.json(db.faqs);
});

app.post('/api/faqs', (req, res) => {
    const faq = {
        id: Math.max(...db.faqs.map(f => f.id), 0) + 1,
        ...req.body
    };
    db.faqs.push(faq);
    saveDB(db);
    res.json(faq);
});

app.put('/api/faqs/:id', (req, res) => {
    const idx = db.faqs.findIndex(f => f.id === parseInt(req.params.id));
    if (idx < 0) return res.status(404).json({ error: 'FAQ no encontrado' });
    db.faqs[idx] = { ...db.faqs[idx], ...req.body };
    saveDB(db);
    res.json(db.faqs[idx]);
});

app.delete('/api/faqs/:id', (req, res) => {
    const idx = db.faqs.findIndex(f => f.id === parseInt(req.params.id));
    if (idx < 0) return res.status(404).json({ error: 'FAQ no encontrado' });
    db.faqs.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
});

// ==================== PROJECTS ====================
app.post('/api/projects', (req, res) => {
    const project = {
        id: Date.now(),
        ...req.body,
        created: new Date().toISOString()
    };
    db.projects.push(project);
    saveDB(db);
    res.json(project);
});

app.get('/api/projects', (req, res) => {
    res.json(db.projects);
});

app.put('/api/projects/:id', (req, res) => {
    const idx = db.projects.findIndex(p => p.id === parseInt(req.params.id));
    if (idx < 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    db.projects[idx] = { ...db.projects[idx], ...req.body };
    saveDB(db);
    res.json(db.projects[idx]);
});

app.delete('/api/projects/:id', (req, res) => {
    const idx = db.projects.findIndex(p => p.id === parseInt(req.params.id));
    if (idx < 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    db.projects.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', leads: db.leads.length, reviews: db.reviews.length });
});

// ==================== CATCH-ALL ====================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ==================== START ====================
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║                                          ║
║   🏗️  MADE UTIL SERVER v5.0              ║
║       COMPLETO Y FUNCIONAL               ║
║                                          ║
║   ✅ http://localhost:${PORT}                ║
║   📁 Base de datos: database.json         ║
║                                          ║
║   Abre esa URL en tu navegador           ║
║                                          ║
╚══════════════════════════════════════════╝
    `);
});
