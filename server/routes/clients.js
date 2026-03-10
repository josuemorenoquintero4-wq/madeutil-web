/* ==============================================
   MADE UTIL — CLIENTS ROUTES (sql.js)
   ============================================== */
const express = require('express');
const { queryAll, queryOne, runSql } = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, (req, res) => {
    const { status } = req.query;
    let query = 'SELECT * FROM clients WHERE 1=1';
    const params = [];
    if (status) { query += ' AND status = ?'; params.push(status); }
    query += ' ORDER BY created_at DESC';
    res.json(queryAll(query, params));
});

router.get('/:id', requireAuth, (req, res) => {
    const client = queryOne('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(client);
});

router.post('/', requireAuth, (req, res) => {
    try {
        const { name, email, phone, city, address, project_type, budget, notes } = req.body;
        if (!name || !phone) return res.status(400).json({ error: 'Nombre y teléfono requeridos' });
        const result = runSql(
            'INSERT INTO clients (name, email, phone, city, address, project_type, budget, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email || '', phone, city || '', address || '', project_type || '', budget || '', notes || '']
        );
        runSql("INSERT INTO activity_log (user_id, action, details, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)",
            [req.session.user.id, 'create_client', `Nuevo cliente: ${name}`, 'client', result.lastInsertRowid]);
        res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAuth, (req, res) => {
    const { name, email, phone, city, address, project_type, budget, notes, status } = req.body;
    runSql(
        "UPDATE clients SET name=?, email=?, phone=?, city=?, address=?, project_type=?, budget=?, notes=?, status=?, updated_at=datetime('now') WHERE id=?",
        [name, email || '', phone, city || '', address || '', project_type || '', budget || '', notes || '', status || 'activo', req.params.id]
    );
    res.json({ success: true });
});

router.delete('/:id', requireAdmin, (req, res) => {
    runSql('DELETE FROM clients WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

module.exports = router;
