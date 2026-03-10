/* ==============================================
   MADE UTIL — TASKS ROUTES (sql.js)
   ============================================== */
const express = require('express');
const { queryAll, queryOne, runSql } = require('../db/database');
const { requireAuth, requireAdmin, requireWorker } = require('../middleware/auth');
const router = express.Router();

const SPECIALTIES = {
    'Diseño y Planos': ['diseño', 'plano', 'render', '3d', 'medición', 'boceto', 'sketch', 'autocad', 'sketchup'],
    'Corte y Ensamble': ['corte', 'ensamble', 'armado', 'pegado', 'canto', 'ruteado', 'taladro', 'bisagra', 'instalación', 'melamina'],
    'Acabado y Pintura': ['pintura', 'acabado', 'lijado', 'laca', 'sellador', 'retoque'],
    'Instalación': ['instalación', 'montaje', 'entrega', 'transporte', 'ajuste'],
    'Gestión General': ['cotización', 'presupuesto', 'compras', 'inventario', 'cliente', 'factura']
};

router.get('/', requireAuth, (req, res) => {
    try {
        const { status, assigned_to, project_id, priority } = req.query;
        const user = req.session.user;
        let query = `SELECT t.*, u.name as worker_name, u.specialty as worker_specialty,
            p.title as project_title, ab.name as assigned_by_name
            FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id
            LEFT JOIN projects p ON t.project_id = p.id
            LEFT JOIN users ab ON t.assigned_by = ab.id WHERE 1=1`;
        const params = [];

        if (user.role === 'worker') { query += ' AND t.assigned_to = ?'; params.push(user.id); }
        if (status && status !== 'all') { query += ' AND t.status = ?'; params.push(status); }
        if (assigned_to) { query += ' AND t.assigned_to = ?'; params.push(assigned_to); }
        if (project_id) { query += ' AND t.project_id = ?'; params.push(project_id); }
        if (priority) { query += ' AND t.priority = ?'; params.push(priority); }

        query += ` ORDER BY CASE t.priority WHEN 'urgente' THEN 1 WHEN 'alta' THEN 2 WHEN 'normal' THEN 3 WHEN 'baja' THEN 4 END, t.created_at DESC`;
        res.json(queryAll(query, params));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/stats', requireAuth, (req, res) => {
    const user = req.session.user;
    const w = user.role === 'worker' ? ' WHERE assigned_to = ' + user.id : '';
    const wa = user.role === 'worker' ? ' AND assigned_to = ' + user.id : '';
    res.json({
        total: queryOne(`SELECT COUNT(*) as c FROM tasks${w}`)?.c || 0,
        pendiente: queryOne(`SELECT COUNT(*) as c FROM tasks WHERE status = 'pendiente'${wa}`)?.c || 0,
        en_progreso: queryOne(`SELECT COUNT(*) as c FROM tasks WHERE status = 'en_progreso'${wa}`)?.c || 0,
        completada: queryOne(`SELECT COUNT(*) as c FROM tasks WHERE status = 'completada'${wa}`)?.c || 0,
    });
});

router.get('/suggest-worker', requireAdmin, (req, res) => {
    const { specialty_required, description } = req.query;
    const workers = queryAll("SELECT id, name, specialty FROM users WHERE role = 'worker' AND active = 1");
    const searchText = ((specialty_required || '') + ' ' + (description || '')).toLowerCase();

    const scored = workers.map(w => {
        let score = 0;
        const keywords = SPECIALTIES[w.specialty] || [];
        if (specialty_required && w.specialty.toLowerCase().includes(specialty_required.toLowerCase())) score += 10;
        keywords.forEach(k => { if (searchText.includes(k)) score += 2; });
        const taskCount = queryOne("SELECT COUNT(*) as c FROM tasks WHERE assigned_to = ? AND status != 'completada'", [w.id])?.c || 0;
        score -= taskCount;
        return { ...w, score, pending_tasks: taskCount };
    });

    scored.sort((a, b) => b.score - a.score);
    res.json(scored);
});

router.post('/', requireAdmin, (req, res) => {
    try {
        const { title, description, project_id, assigned_to, priority, specialty_required, due_date } = req.body;
        if (!title || !assigned_to) return res.status(400).json({ error: 'Título y trabajador requeridos' });

        const result = runSql(
            'INSERT INTO tasks (title, description, project_id, assigned_to, assigned_by, priority, specialty_required, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description || '', project_id || null, assigned_to, req.session.user.id, priority || 'normal', specialty_required || '', due_date || '']
        );

        const worker = queryOne('SELECT name FROM users WHERE id = ?', [assigned_to]);
        runSql("INSERT INTO activity_log (user_id, action, details, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)",
            [req.session.user.id, 'create_task', `Tarea "${title}" → ${worker?.name}`, 'task', result.lastInsertRowid]);

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAuth, (req, res) => {
    const { title, description, priority, due_date, notes } = req.body;
    runSql("UPDATE tasks SET title=?, description=?, priority=?, due_date=?, notes=?, updated_at=datetime('now') WHERE id=?",
        [title, description || '', priority || 'normal', due_date || '', notes || '', req.params.id]);
    res.json({ success: true });
});

router.put('/:id/status', requireWorker, (req, res) => {
    const { status } = req.body;
    if (status === 'completada') {
        runSql("UPDATE tasks SET status=?, completed_at=datetime('now'), updated_at=datetime('now') WHERE id=?", [status, req.params.id]);
    } else {
        runSql("UPDATE tasks SET status=?, completed_at=NULL, updated_at=datetime('now') WHERE id=?", [status, req.params.id]);
    }
    const task = queryOne('SELECT title FROM tasks WHERE id = ?', [req.params.id]);
    runSql("INSERT INTO activity_log (user_id, action, details, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)",
        [req.session.user.id, 'update_task', `Tarea "${task?.title}" → ${status}`, 'task', req.params.id]);
    res.json({ success: true });
});

router.put('/:id/reassign', requireAdmin, (req, res) => {
    runSql("UPDATE tasks SET assigned_to=?, updated_at=datetime('now') WHERE id=?", [req.body.assigned_to, req.params.id]);
    res.json({ success: true });
});

router.delete('/:id', requireAdmin, (req, res) => {
    runSql('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

module.exports = router;
