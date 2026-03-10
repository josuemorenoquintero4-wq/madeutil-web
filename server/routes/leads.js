/* ==============================================
   MADE UTIL — LEADS ROUTES (sql.js)
   ============================================== */
const express = require('express');
const { queryAll, queryOne, runSql } = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { notifyNewLead } = require('./sms');
const { notifyNewLeadEmail } = require('./email');
const router = express.Router();

router.get('/', requireAuth, (req, res) => {
    try {
        const { estado, ciudad } = req.query;
        let query = `SELECT l.*, u.name as assigned_name, u.specialty as assigned_specialty
            FROM leads l LEFT JOIN users u ON l.assigned_to = u.id WHERE 1=1`;
        const params = [];
        if (estado && estado !== 'all') { query += ' AND l.estado = ?'; params.push(estado); }
        if (ciudad && ciudad !== 'all') { query += ' AND l.ciudad = ?'; params.push(ciudad); }
        query += ' ORDER BY l.created_at DESC';
        res.json(queryAll(query, params));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/stats', requireAuth, (req, res) => {
    res.json({
        total: queryOne('SELECT COUNT(*) as c FROM leads')?.c || 0,
        nuevo: queryOne("SELECT COUNT(*) as c FROM leads WHERE estado = 'nuevo'")?.c || 0,
        contactado: queryOne("SELECT COUNT(*) as c FROM leads WHERE estado = 'contactado'")?.c || 0,
        cotizado: queryOne("SELECT COUNT(*) as c FROM leads WHERE estado = 'cotizado'")?.c || 0,
        aprobado: queryOne("SELECT COUNT(*) as c FROM leads WHERE estado = 'aprobado'")?.c || 0,
        rechazado: queryOne("SELECT COUNT(*) as c FROM leads WHERE estado = 'rechazado'")?.c || 0,
    });
});

router.get('/:id', requireAuth, (req, res) => {
    const lead = queryOne(
        `SELECT l.*, u.name as assigned_name, u.specialty as assigned_specialty
         FROM leads l LEFT JOIN users u ON l.assigned_to = u.id WHERE l.id = ?`, [req.params.id]);
    if (!lead) return res.status(404).json({ error: 'Lead no encontrado' });
    res.json(lead);
});

// POST - Public endpoint (from website form)
router.post('/', (req, res) => {
    try {
        const { nombre, telefono, email, ciudad, direccion, categorias, descripcion, presupuesto, urgencia, horarios } = req.body;
        if (!nombre || !telefono) return res.status(400).json({ error: 'Nombre y teléfono requeridos' });

        const cats = Array.isArray(categorias) ? categorias.join(', ') : (categorias || '');
        const result = runSql(
            `INSERT INTO leads (nombre, telefono, email, ciudad, direccion, categorias, descripcion, presupuesto, urgencia, horarios, source)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'web')`,
            [nombre, telefono, email || '', ciudad || '', direccion || '', cats, descripcion || '', presupuesto || '', urgencia || '', horarios || '']
        );

        // Auto-create client
        runSql("INSERT INTO clients (name, email, phone, city, address, project_type, budget) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nombre, email || '', telefono, ciudad || '', direccion || '', cats, presupuesto || '']);

        runSql("INSERT INTO activity_log (action, details, entity_type, entity_id) VALUES (?, ?, ?, ?)",
            ['new_lead', `Nueva solicitud web de ${nombre} (${ciudad || 'Sin ciudad'})`, 'lead', result.lastInsertRowid]);

        // Enviar notificación SMS al admin
        notifyNewLead({ nombre, telefono, email, ciudad, categorias: cats, presupuesto })
            .then(smsResult => {
                if (smsResult.success) {
                    console.log('✅ Admin notificado via SMS');
                } else {
                    console.warn('⚠ No se pudo enviar SMS al admin:', smsResult.error);
                }
            })
            .catch(err => console.error('Error en notificación SMS:', err));

        // Enviar notificación EMAIL al admin
        notifyNewLeadEmail({
            nombre, telefono, email, ciudad, direccion,
            categorias: cats, descripcion, presupuesto,
            urgencia, horarios
        })
            .then(emailResult => {
                if (emailResult.success && !emailResult.simulated) {
                    console.log('✅ Admin notificado via EMAIL');
                } else if (emailResult.simulated) {
                    console.log('📧 Email simulado (configurar contraseña para envío real)');
                } else {
                    console.warn('⚠ No se pudo enviar email:', emailResult.error);
                }
            })
            .catch(err => console.error('Error en notificación email:', err));

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id/status', requireAuth, (req, res) => {
    runSql("UPDATE leads SET estado = ?, updated_at = datetime('now') WHERE id = ?", [req.body.estado, req.params.id]);
    const lead = queryOne('SELECT nombre FROM leads WHERE id = ?', [req.params.id]);
    runSql("INSERT INTO activity_log (user_id, action, details, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)",
        [req.session.user.id, 'update_lead', `Lead ${lead?.nombre} → ${req.body.estado}`, 'lead', req.params.id]);
    res.json({ success: true });
});

router.put('/:id/assign', requireAdmin, (req, res) => {
    runSql("UPDATE leads SET assigned_to = ?, updated_at = datetime('now') WHERE id = ?", [req.body.assigned_to, req.params.id]);
    const worker = queryOne('SELECT name FROM users WHERE id = ?', [req.body.assigned_to]);
    const lead = queryOne('SELECT nombre FROM leads WHERE id = ?', [req.params.id]);
    runSql("INSERT INTO activity_log (user_id, action, details, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)",
        [req.session.user.id, 'assign_lead', `Lead ${lead?.nombre} → ${worker?.name}`, 'lead', req.params.id]);
    res.json({ success: true });
});

router.put('/:id/notes', requireAuth, (req, res) => {
    runSql("UPDATE leads SET notes = ?, updated_at = datetime('now') WHERE id = ?", [req.body.notes, req.params.id]);
    res.json({ success: true });
});

router.put('/:id/step', requireAuth, (req, res) => {
    runSql("UPDATE leads SET step = ?, updated_at = datetime('now') WHERE id = ?", [req.body.step, req.params.id]);
    res.json({ success: true });
});

router.delete('/:id', requireAdmin, (req, res) => {
    runSql('DELETE FROM leads WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

module.exports = router;
