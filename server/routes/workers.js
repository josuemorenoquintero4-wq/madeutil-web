/* ==============================================
   MADE UTIL — WORKERS ROUTES (sql.js)
   ============================================== */
const express = require('express');
const { queryAll, queryOne, runSql } = require('../db/database');
const { requireAuth, requireAdmin, requireWorker } = require('../middleware/auth');
const router = express.Router();

// ==================== TIME TRACKING ====================
router.post('/check-in', requireWorker, (req, res) => {
    try {
        const userId = req.session.user.id;
        const today = new Date().toISOString().split('T')[0];
        const existing = queryOne("SELECT * FROM time_tracking WHERE user_id = ? AND date = ? AND check_out IS NULL", [userId, today]);
        if (existing) return res.status(400).json({ error: 'Ya tienes una entrada abierta hoy' });

        const result = runSql("INSERT INTO time_tracking (user_id, check_in, date) VALUES (?, datetime('now'), ?)", [userId, today]);
        runSql("INSERT INTO activity_log (user_id, action, details, entity_type) VALUES (?, ?, ?, ?)",
            [userId, 'check_in', `${req.session.user.name} marcó entrada`, 'time']);
        res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/check-out', requireWorker, (req, res) => {
    try {
        const userId = req.session.user.id;
        const today = new Date().toISOString().split('T')[0];
        const entry = queryOne("SELECT * FROM time_tracking WHERE user_id = ? AND date = ? AND check_out IS NULL", [userId, today]);
        if (!entry) return res.status(400).json({ error: 'No tienes entrada abierta hoy' });

        const checkIn = new Date(entry.check_in);
        const hours = ((Date.now() - checkIn.getTime()) / (1000 * 60 * 60)).toFixed(2);
        runSql("UPDATE time_tracking SET check_out = datetime('now'), total_hours = ? WHERE id = ?", [parseFloat(hours), entry.id]);
        runSql("INSERT INTO activity_log (user_id, action, details, entity_type) VALUES (?, ?, ?, ?)",
            [userId, 'check_out', `${req.session.user.name} marcó salida (${hours}h)`, 'time']);
        res.json({ success: true, hours: parseFloat(hours) });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/time-status', requireWorker, (req, res) => {
    const userId = req.session.user.id;
    const today = new Date().toISOString().split('T')[0];
    const entry = queryOne("SELECT * FROM time_tracking WHERE user_id = ? AND date = ? AND check_out IS NULL", [userId, today]);
    const todayEntries = queryAll("SELECT * FROM time_tracking WHERE user_id = ? AND date = ? ORDER BY check_in", [userId, today]);
    res.json({
        checked_in: !!entry, current_entry: entry || null,
        today_entries: todayEntries,
        total_hours_today: todayEntries.reduce((sum, e) => sum + (e.total_hours || 0), 0)
    });
});

router.get('/time-history', requireAuth, (req, res) => {
    const { user_id, start_date, end_date } = req.query;
    const userId = req.session.user.role === 'admin' && user_id ? user_id : req.session.user.id;
    let query = 'SELECT tt.*, u.name as worker_name FROM time_tracking tt LEFT JOIN users u ON tt.user_id = u.id WHERE tt.user_id = ?';
    const params = [userId];
    if (start_date) { query += ' AND tt.date >= ?'; params.push(start_date); }
    if (end_date) { query += ' AND tt.date <= ?'; params.push(end_date); }
    query += ' ORDER BY tt.check_in DESC LIMIT 100';
    res.json(queryAll(query, params));
});

router.get('/all-time-today', requireAdmin, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const workers = queryAll("SELECT id, name, specialty FROM users WHERE role = 'worker' AND active = 1");
    const result = workers.map(w => {
        const isIn = queryOne("SELECT COUNT(*) as c FROM time_tracking WHERE user_id = ? AND date = ? AND check_out IS NULL", [w.id, today]);
        const hours = queryOne("SELECT SUM(total_hours) as h FROM time_tracking WHERE user_id = ? AND date = ?", [w.id, today]);
        const checkInTime = queryOne("SELECT check_in FROM time_tracking WHERE user_id = ? AND date = ? AND check_out IS NULL", [w.id, today]);
        return { ...w, is_checked_in: (isIn?.c || 0) > 0 ? 1 : 0, hours_today: hours?.h || 0, check_in_time: checkInTime?.check_in || null };
    });
    res.json(result);
});

// ==================== MATERIALS ====================
router.get('/materials', requireAuth, (req, res) => {
    const { type } = req.query;
    let query = 'SELECT * FROM materials WHERE active = 1';
    const params = [];
    if (type) { query += ' AND type = ?'; params.push(type); }
    query += ' ORDER BY type, name';
    res.json(queryAll(query, params));
});

router.post('/materials', requireAdmin, (req, res) => {
    try {
        const { code, name, type, brand, thickness, color, texture, price_per_unit, unit, stock, supplier, description } = req.body;
        const result = runSql(
            'INSERT INTO materials (code, name, type, brand, thickness, color, texture, price_per_unit, unit, stock, supplier, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [code, name, type, brand || '', thickness || '', color || '', texture || '', price_per_unit || 0, unit || 'unidad', stock || 0, supplier || '', description || '']
        );
        res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/materials/:id', requireAuth, (req, res) => {
    const { stock, price_per_unit } = req.body;
    if (stock !== undefined) runSql('UPDATE materials SET stock = ? WHERE id = ?', [stock, req.params.id]);
    if (price_per_unit !== undefined) runSql('UPDATE materials SET price_per_unit = ? WHERE id = ?', [price_per_unit, req.params.id]);
    res.json({ success: true });
});

// ==================== ACTIVITY LOG ====================
router.get('/activity', requireAuth, (req, res) => {
    const { limit } = req.query;
    res.json(queryAll(
        'SELECT al.*, u.name as user_name FROM activity_log al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT ?',
        [parseInt(limit) || 50]
    ));
});

// ==================== DASHBOARD ====================
router.get('/dashboard', requireAuth, (req, res) => {
    res.json({
        total_projects: queryOne('SELECT COUNT(*) as c FROM projects')?.c || 0,
        active_projects: queryOne("SELECT COUNT(*) as c FROM projects WHERE status = 'activo'")?.c || 0,
        total_clients: queryOne('SELECT COUNT(*) as c FROM clients')?.c || 0,
        total_leads: queryOne('SELECT COUNT(*) as c FROM leads')?.c || 0,
        new_leads: queryOne("SELECT COUNT(*) as c FROM leads WHERE estado = 'nuevo'")?.c || 0,
        pending_tasks: queryOne("SELECT COUNT(*) as c FROM tasks WHERE status = 'pendiente'")?.c || 0,
        in_progress_tasks: queryOne("SELECT COUNT(*) as c FROM tasks WHERE status = 'en_progreso'")?.c || 0,
        active_workers: queryOne("SELECT COUNT(*) as c FROM users WHERE role = 'worker' AND active = 1")?.c || 0,
        recent_leads: queryAll('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5'),
        recent_activity: queryAll('SELECT al.*, u.name as user_name FROM activity_log al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT 10')
    });
});

module.exports = router;
