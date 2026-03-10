/* ==============================================
   MADE UTIL — AUTH ROUTES (sql.js version)
   ============================================== */

const express = require('express');
const bcrypt = require('bcryptjs');
const { queryOne, queryAll, runSql } = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        const user = queryOne('SELECT * FROM users WHERE username = ? AND active = 1', [username]);
        if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' });

        runSql("UPDATE users SET last_login = datetime('now') WHERE id = ?", [user.id]);
        runSql("INSERT INTO activity_log (user_id, action, details, entity_type) VALUES (?, ?, ?, ?)",
            [user.id, 'login', `${user.name} inició sesión`, 'auth']);

        req.session.user = {
            id: user.id, username: user.username, name: user.name,
            role: user.role, specialty: user.specialty
        };

        res.json({
            success: true,
            user: req.session.user
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    if (req.session.user) {
        runSql("INSERT INTO activity_log (user_id, action, details, entity_type) VALUES (?, ?, ?, ?)",
            [req.session.user.id, 'logout', `${req.session.user.name} cerró sesión`, 'auth']);
    }
    req.session.destroy();
    res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
    res.json({ user: req.session.user });
});

// POST /api/auth/change-password
router.post('/change-password', requireAuth, (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = queryOne('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
        if (!bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(400).json({ error: 'Contraseña actual incorrecta' });
        }
        const hashed = bcrypt.hashSync(newPassword, 10);
        runSql('UPDATE users SET password = ? WHERE id = ?', [hashed, req.session.user.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// GET /api/auth/workers
router.get('/workers', requireAuth, (req, res) => {
    const workers = queryAll(
        "SELECT id, username, name, role, specialty, phone, email, active, created_at, last_login FROM users WHERE role = 'worker' ORDER BY name"
    );
    res.json(workers);
});

// GET /api/auth/workers/all
router.get('/workers/all', requireAuth, (req, res) => {
    const workers = queryAll(
        "SELECT id, username, name, role, specialty, phone, email, active FROM users WHERE active = 1 ORDER BY role DESC, name"
    );
    res.json(workers);
});

// POST /api/auth/workers
router.post('/workers', requireAdmin, (req, res) => {
    try {
        const { username, password, name, specialty, phone, email } = req.body;
        if (!username || !password || !name || !specialty) {
            return res.status(400).json({ error: 'Campos requeridos: usuario, contraseña, nombre, especialidad' });
        }

        const exists = queryOne('SELECT id FROM users WHERE username = ?', [username]);
        if (exists) return res.status(400).json({ error: 'El nombre de usuario ya existe' });

        const hashed = bcrypt.hashSync(password, 10);
        const result = runSql(
            "INSERT INTO users (username, password, name, role, specialty, phone, email) VALUES (?, ?, ?, 'worker', ?, ?, ?)",
            [username, hashed, name, specialty, phone || '', email || '']
        );

        runSql("INSERT INTO activity_log (user_id, action, details, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)",
            [req.session.user.id, 'create_worker', `Nuevo trabajador: ${name} (${specialty})`, 'user', result.lastInsertRowid]);

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PUT /api/auth/workers/:id
router.put('/workers/:id', requireAdmin, (req, res) => {
    try {
        const { name, specialty, phone, email, active } = req.body;
        runSql(
            "UPDATE users SET name = ?, specialty = ?, phone = ?, email = ?, active = ? WHERE id = ? AND role = 'worker'",
            [name, specialty, phone || '', email || '', active !== undefined ? active : 1, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE /api/auth/workers/:id
router.delete('/workers/:id', requireAdmin, (req, res) => {
    runSql("UPDATE users SET active = 0 WHERE id = ? AND role = 'worker'", [req.params.id]);
    res.json({ success: true });
});

module.exports = router;
