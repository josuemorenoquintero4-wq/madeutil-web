/* ==============================================
   MADE UTIL — FILE UPLOAD ROUTES
   Upload images from desktop
   ============================================== */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Configure storage
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const subDir = req.body.folder || 'projects';
        const fullDir = path.join(UPLOAD_DIR, subDir);
        if (!fs.existsSync(fullDir)) {
            fs.mkdirSync(fullDir, { recursive: true });
        }
        cb(null, fullDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `madeutil-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (allowed.test(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, png, gif, webp, svg)'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// POST /api/upload — Upload single image
router.post('/', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó imagen' });
    }

    const folder = req.body.folder || 'projects';
    const relativePath = `/uploads/${folder}/${req.file.filename}`;

    res.json({
        success: true,
        filename: req.file.filename,
        path: relativePath,
        originalName: req.file.originalname,
        size: req.file.size
    });
});

// POST /api/upload/multiple — Upload multiple images
router.post('/multiple', requireAuth, upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron imágenes' });
    }

    const folder = req.body.folder || 'projects';
    const files = req.files.map(f => ({
        filename: f.filename,
        path: `/uploads/${folder}/${f.filename}`,
        originalName: f.originalname,
        size: f.size
    }));

    res.json({ success: true, files });
});

// DELETE /api/upload/:filename
router.delete('/:filename', requireAuth, (req, res) => {
    const filename = req.params.filename;

    // Search in all upload subdirectories
    const searchDirs = ['projects', 'profiles', 'general'];

    for (const dir of searchDirs) {
        const filePath = path.join(UPLOAD_DIR, dir, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.json({ success: true, message: 'Imagen eliminada' });
        }
    }

    // Also check root uploads
    const rootPath = path.join(UPLOAD_DIR, filename);
    if (fs.existsSync(rootPath)) {
        fs.unlinkSync(rootPath);
        return res.json({ success: true, message: 'Imagen eliminada' });
    }

    res.status(404).json({ error: 'Imagen no encontrada' });
});

module.exports = router;
