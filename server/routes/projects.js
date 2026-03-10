/* ==============================================
   MADE UTIL — PROJECTS ROUTES (sql.js)
   ============================================== */
const express = require('express');
const { queryAll, queryOne, runSql } = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for image uploads
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'projects');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `project-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.get('/', requireAuth, (req, res) => {
    try {
        const { category, status, featured, tipo, coleccion } = req.query;
        let query = 'SELECT * FROM projects WHERE 1=1';
        const params = [];
        if (category) { query += ' AND category = ?'; params.push(category); }
        if (coleccion) { query += ' AND coleccion = ?'; params.push(coleccion); }
        if (status) { query += ' AND status = ?'; params.push(status); }
        if (featured !== undefined) { query += ' AND featured = ?'; params.push(featured === 'true' ? 1 : 0); }
        if (tipo) { query += ' AND tipo = ?'; params.push(tipo); }
        query += ' ORDER BY created_at DESC';
        res.json(queryAll(query, params));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/public', (req, res) => {
    try {
        const { category, tipo } = req.query;
        let query = "SELECT id, title, category, description, image_url, image_path, status, featured, tipo, location FROM projects WHERE status != 'archivado'";
        const params = [];
        if (category) { query += ' AND category = ?'; params.push(category); }
        if (tipo) { query += ' AND tipo = ?'; params.push(tipo); }
        query += ' ORDER BY featured DESC, created_at DESC';
        res.json(queryAll(query, params));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', requireAuth, (req, res) => {
    const project = queryOne('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(project);
});

router.post('/', requireAdmin, upload.array('images', 10), (req, res) => {
    try {
        const { title, category, description, client_name, client_id, status, featured, tipo, coleccion, material, color, texture, budget, location } = req.body;
        if (!title || !category) return res.status(400).json({ error: 'Título y categoría requeridos' });

        // Múltiples imágenes como JSON arrays
        const image_paths = req.files ? req.files.map(f => f.filename) : [];
        const image_urls = req.files ? req.files.map(f => `/uploads/projects/${f.filename}`) : [];

        const result = runSql(
            `INSERT INTO projects (title, category, coleccion, description, client_name, client_id, image_url, image_path, status, featured, tipo, material, color, texture, budget, location)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, category, coleccion || 'cocinas', description || '', client_name || '', client_id || null,
                JSON.stringify(image_urls), JSON.stringify(image_paths), status || 'activo', featured ? 1 : 0,
                tipo || 'trabajo', material || '', color || '', texture || '', budget || '', location || '']
        );

        runSql("INSERT INTO activity_log (user_id, action, details, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)",
            [req.session.user.id, 'create_project', `Nuevo proyecto: ${title}`, 'project', result.lastInsertRowid]);

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAdmin, upload.array('images', 10), (req, res) => {
    try {
        const { title, category, coleccion, description, client_name, client_id, status, featured, tipo, material, color, texture, budget, location, progress } = req.body;
        
        // Si hay nuevas imágenes, usar los nuevos filenames; si no, mantener existentes
        let image_paths = [];
        let image_urls = [];
        
        if (req.files && req.files.length > 0) {
            image_paths = req.files.map(f => f.filename);
            image_urls = req.files.map(f => `/uploads/projects/${f.filename}`);
        } else {
            // Mantener valores existentes si no se actualizan las imágenes
            const existing = queryOne('SELECT image_url, image_path FROM projects WHERE id = ?', [req.params.id]);
            if (existing) {
                image_urls = existing.image_url ? JSON.parse(existing.image_url) : [];
                image_paths = existing.image_path ? JSON.parse(existing.image_path) : [];
            }
        }

        runSql(
            `UPDATE projects SET title=?, category=?, coleccion=?, description=?, client_name=?, client_id=?,
             image_url=?, image_path=?, status=?, featured=?, tipo=?, material=?, color=?, texture=?, budget=?, location=?,
             progress=?, updated_at=datetime('now') WHERE id=?`,
            [title, category, coleccion || 'cocinas', description || '', client_name || '', client_id || null,
                JSON.stringify(image_urls), JSON.stringify(image_paths), status || 'activo', featured ? 1 : 0,
                tipo || 'trabajo', material || '', color || '', texture || '', budget || '', location || '', progress || 0, req.params.id]
        );

        runSql("INSERT INTO activity_log (user_id, action, details, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)",
            [req.session.user.id, 'update_project', `Actualizado: ${title || req.params.id}`, 'project', req.params.id]);

        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, (req, res) => {
    const p = queryOne('SELECT title FROM projects WHERE id = ?', [req.params.id]);
    runSql('DELETE FROM projects WHERE id = ?', [req.params.id]);
    runSql("INSERT INTO activity_log (user_id, action, details, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)",
        [req.session.user.id, 'delete_project', `Eliminado: ${p?.title}`, 'project', req.params.id]);
    res.json({ success: true });
});

router.put('/:id/toggle-featured', requireAdmin, (req, res) => {
    runSql("UPDATE projects SET featured = NOT featured, updated_at = datetime('now') WHERE id = ?", [req.params.id]);
    res.json({ success: true });
});

module.exports = router;
