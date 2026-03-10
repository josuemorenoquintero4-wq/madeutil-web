/* ==============================================
   MADE UTIL — DATABASE SETUP (sql.js - pure JS SQLite)
   ============================================== */

const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'madeutil.db');

let db = null;

async function getDb() {
    if (!db) {
        await initDB();
    }
    return db;
}

async function initDB() {
    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(buffer);
    } else {
        db = new SQL.Database();
    }

    db.run('PRAGMA foreign_keys = ON');
    return db;
}

function saveDb() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

// Auto-save every 30 seconds
setInterval(saveDb, 30000);

// Save on exit
process.on('exit', saveDb);
process.on('SIGINT', () => { saveDb(); process.exit(); });
process.on('SIGTERM', () => { saveDb(); process.exit(); });

async function initDatabase() {
    const d = await getDb();

    // ==================== USERS TABLE ====================
    d.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'worker',
            specialty TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            email TEXT DEFAULT '',
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now')),
            last_login TEXT
        )
    `);

    // ==================== PROJECTS TABLE ====================
    d.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT DEFAULT '',
            client_name TEXT DEFAULT '',
            client_id INTEGER,
            image_url TEXT DEFAULT '',
            image_path TEXT DEFAULT '',
            status TEXT DEFAULT 'activo',
            featured INTEGER DEFAULT 0,
            tipo TEXT DEFAULT 'trabajo',
            materials TEXT DEFAULT '',
            budget TEXT DEFAULT '',
            location TEXT DEFAULT '',
            start_date TEXT DEFAULT '',
            end_date TEXT DEFAULT '',
            progress INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    // ==================== MIGRATION: Add tipo column if missing ====================
    try {
        d.run(`ALTER TABLE projects ADD COLUMN tipo TEXT DEFAULT 'trabajo'`);
    } catch (e) {
        // Column already exists, ignore error
    }

    // ==================== MIGRATION: Add coleccion column if missing ====================
    try {
        d.run(`ALTER TABLE projects ADD COLUMN coleccion TEXT DEFAULT 'cocinas'`);
    } catch (e) {
        // Column already exists, ignore error
    }

    // ==================== MIGRATION: Add technical fields (material, color, texture) ====================
    try {
        d.run(`ALTER TABLE projects ADD COLUMN material TEXT DEFAULT ''`);
    } catch (e) {}
    try {
        d.run(`ALTER TABLE projects ADD COLUMN color TEXT DEFAULT ''`);
    } catch (e) {}
    try {
        d.run(`ALTER TABLE projects ADD COLUMN texture TEXT DEFAULT ''`);
    } catch (e) {}

    // Note: image_url and image_path now store JSON arrays for multiple images
    // Format: image_url = '["url1", "url2"]' and image_path = '["path1", "path2"]'

    // ==================== LEADS TABLE ====================
    d.run(`
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            telefono TEXT NOT NULL,
            email TEXT DEFAULT '',
            ciudad TEXT DEFAULT '',
            direccion TEXT DEFAULT '',
            categorias TEXT DEFAULT '',
            descripcion TEXT DEFAULT '',
            presupuesto TEXT DEFAULT '',
            urgencia TEXT DEFAULT '',
            horarios TEXT DEFAULT '',
            estado TEXT DEFAULT 'nuevo',
            assigned_to INTEGER,
            notes TEXT DEFAULT '',
            step INTEGER DEFAULT 1,
            source TEXT DEFAULT 'web',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            contacted_at TEXT
        )
    `);

    // ==================== CLIENTS TABLE ====================
    d.run(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT DEFAULT '',
            phone TEXT NOT NULL,
            city TEXT DEFAULT '',
            address TEXT DEFAULT '',
            project_type TEXT DEFAULT '',
            budget TEXT DEFAULT '',
            notes TEXT DEFAULT '',
            status TEXT DEFAULT 'activo',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    // ==================== TASKS TABLE ====================
    d.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            project_id INTEGER,
            assigned_to INTEGER NOT NULL,
            assigned_by INTEGER,
            priority TEXT DEFAULT 'normal',
            status TEXT DEFAULT 'pendiente',
            specialty_required TEXT DEFAULT '',
            due_date TEXT DEFAULT '',
            completed_at TEXT,
            notes TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    // ==================== ACTIVITY LOG TABLE ====================
    d.run(`
        CREATE TABLE IF NOT EXISTS activity_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action TEXT NOT NULL,
            details TEXT DEFAULT '',
            entity_type TEXT DEFAULT '',
            entity_id INTEGER,
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);

    // ==================== TIME TRACKING TABLE ====================
    d.run(`
        CREATE TABLE IF NOT EXISTS time_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            check_in TEXT NOT NULL,
            check_out TEXT,
            total_hours REAL DEFAULT 0,
            notes TEXT DEFAULT '',
            date TEXT NOT NULL
        )
    `);

    // ==================== MATERIALS DATABASE ====================
    d.run(`
        CREATE TABLE IF NOT EXISTS materials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            brand TEXT DEFAULT '',
            thickness TEXT DEFAULT '',
            color TEXT DEFAULT '',
            texture TEXT DEFAULT '',
            price_per_unit REAL DEFAULT 0,
            unit TEXT DEFAULT 'unidad',
            stock INTEGER DEFAULT 0,
            supplier TEXT DEFAULT '',
            description TEXT DEFAULT '',
            image_url TEXT DEFAULT '',
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);

    // ==================== SEED DEFAULT DATA ====================
    seedDefaultData(d);
    saveDb();

    return d;
}

function seedDefaultData(d) {
    const result = d.exec("SELECT id FROM users WHERE username = 'admin'");
    if (result.length > 0 && result[0].values.length > 0) return;

    const hashedAdmin = bcrypt.hashSync('granos 2025', 10);
    const hashedWorker = bcrypt.hashSync('worker2024', 10);

    // Create admin
    d.run("INSERT INTO users (username, password, name, role, specialty, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ['admin', hashedAdmin, 'Administrador', 'admin', 'Gestión General', '573005444049', 'admin@madeutil.com']);

    // Create workers
    d.run("INSERT INTO users (username, password, name, role, specialty, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ['josue', hashedWorker, 'Josué', 'worker', 'Diseño y Planos', '', '']);

    d.run("INSERT INTO users (username, password, name, role, specialty, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ['camilo', hashedWorker, 'Camilo', 'worker', 'Corte y Ensamble', '', '']);

    // Seed materials - MELAMINA / AGLOMERADO
    const materials = [
        ['MEL-001', 'Melamina Blanco Ártico', 'melamina', 'Duratex/Arauco', '15mm', 'Blanco', 'Liso', 185000, 'lámina 244x122cm', 50, 'Districondor'],
        ['MEL-002', 'Melamina Roble Santana', 'melamina', 'Masisa', '15mm', 'Roble', 'Madera', 210000, 'lámina 244x122cm', 30, 'Districondor'],
        ['MEL-003', 'Melamina Wengue', 'melamina', 'Arauco', '15mm', 'Wengue', 'Madera', 210000, 'lámina 244x122cm', 25, 'Madecentro'],
        ['MEL-004', 'Melamina Gris Ceniza', 'melamina', 'Duratex', '15mm', 'Gris', 'Liso', 195000, 'lámina 244x122cm', 40, 'Homecenter'],
        ['MEL-005', 'Melamina Nogal Terracota', 'melamina', 'Masisa', '18mm', 'Nogal', 'Madera', 245000, 'lámina 244x122cm', 20, 'Districondor'],
        ['MEL-006', 'Melamina Negro Mate', 'melamina', 'Arauco', '15mm', 'Negro', 'Liso Mate', 200000, 'lámina 244x122cm', 35, 'Madecentro'],
        ['MEL-007', 'Melamina Mármol Carrara', 'melamina', 'Duratex', '15mm', 'Blanco Veteado', 'Piedra', 235000, 'lámina 244x122cm', 15, 'Districondor'],
        ['MEL-008', 'Melamina Sahara', 'melamina', 'Masisa', '15mm', 'Arena', 'Liso', 190000, 'lámina 244x122cm', 28, 'Homecenter'],
        ['MDF-001', 'MDF Crudo 15mm', 'mdf', 'Tablemac', '15mm', 'Natural', 'Liso', 95000, 'lámina 244x153cm', 60, 'Madecentro'],
        ['MDF-002', 'MDF Crudo 12mm', 'mdf', 'Tablemac', '12mm', 'Natural', 'Liso', 78000, 'lámina 244x153cm', 45, 'Madecentro'],
        ['MDF-003', 'MDF Crudo 9mm', 'mdf', 'Tablemac', '9mm', 'Natural', 'Liso', 62000, 'lámina 244x153cm', 55, 'Districondor'],
        ['CAN-001', 'Canto PVC Blanco 2mm', 'canto', 'Rehau', '2mm', 'Blanco', 'Liso', 4500, 'metro lineal', 200, 'Hettich Colombia'],
        ['CAN-002', 'Canto PVC Roble 2mm', 'canto', 'Rehau', '2mm', 'Roble', 'Madera', 5200, 'metro lineal', 150, 'Hettich Colombia'],
        ['CAN-003', 'Canto PVC Negro 2mm', 'canto', 'Rehau', '2mm', 'Negro', 'Liso', 4800, 'metro lineal', 180, 'Hettich Colombia'],
        ['HER-001', 'Bisagra Clip Top 110°', 'herraje', 'Blum', '', '', '', 12500, 'unidad', 450, 'Blum Colombia'],
        ['HER-002', 'Bisagra Blumotion 110°', 'herraje', 'Blum', '', '', '', 18900, 'unidad', 300, 'Blum Colombia'],
        ['HER-003', 'Corredera Tandem 500mm', 'herraje', 'Blum', '', '', '', 65000, 'juego', 120, 'Blum Colombia'],
        ['HER-004', 'Corredera Tandem 400mm', 'herraje', 'Blum', '', '', '', 58000, 'juego', 150, 'Blum Colombia'],
        ['HER-005', 'Sistema Aventos HF', 'herraje', 'Blum', '', '', '', 285000, 'juego', 15, 'Blum Colombia'],
        ['HER-006', 'Bisagra Sensys 110°', 'herraje', 'Hettich', '', '', '', 15000, 'unidad', 200, 'Hettich Colombia'],
        ['HER-007', 'Corredera Quadro 500mm', 'herraje', 'Hettich', '', '', '', 48000, 'juego', 100, 'Hettich Colombia'],
    ];

    for (const m of materials) {
        try {
            d.run("INSERT INTO materials (code, name, type, brand, thickness, color, texture, price_per_unit, unit, stock, supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", m);
        } catch (e) { /* skip duplicates */ }
    }

    // Seed sample projects for Colecciones
    const projects = [
        {
            title: 'Cocina Moderna Nogal',
            category: 'cocinas',
            description: 'Diseño contemporáneo con melamina Nogal Terracota, herrajes Blum premium y encimera de mármol. Instalada en Sabaneta - Junio 2025',
            location: 'Sabaneta',
            budget: '$45M - $55M',
            featured: 1,
            tipo: 'destacado',
            status: 'activo'
        },
        {
            title: 'Closet Vestidor Glass',
            category: 'armarios',
            description: 'Sistema de closet de puertas corredizas en vidrio templadocon estructura en perfiles de aluminio. Capacidad: 8 metros lineales. Equipo: Josué',
            location: 'El Poblado',
            budget: '$28M - $35M',
            featured: 0,
            tipo: 'trabajo',
            status: 'activo'
        },
        {
            title: 'Mobiliario Minimalista Blanco',
            category: 'mobiliario',
            description: 'Conjunto de mesas y estantes en melamina blanco ártico, diseño moderno con líneas limpias. Ideal para oficinas y espacios abiertos.',
            location: 'Medellín Centro',
            budget: '$15M - $22M',
            featured: 0,
            tipo: 'trabajo',
            status: 'activo'
        },
        {
            title: 'Armarios Cocina Wengué',
            category: 'cocinas',
            description: 'Mueblería completa para cocina con melamina Wengué, distribuidor inteligente de ollas, gavetas con soft-close y respaldo en vidrio templado.',
            location: 'Envigado',
            budget: '$32M - $42M',
            featured: 0,
            tipo: 'trabajo',
            status: 'activo'
        }
    ];

    for (const p of projects) {
        try {
            d.run(`INSERT INTO projects (title, category, description, location, budget, featured, tipo, status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [p.title, p.category, p.description, p.location, p.budget, p.featured, p.tipo, p.status]);
        } catch (e) { /* skip duplicates */ }
    }

    // Log initial activity
    d.run("INSERT INTO activity_log (action, details, entity_type) VALUES (?, ?, ?)",
        ['system_init', 'Sistema MADE UTIL v3.0 inicializado con éxito', 'system']);
}

// Helper functions for sql.js (returns objects like better-sqlite3)
function queryAll(sql, params = []) {
    const d = db;
    try {
        const stmt = d.prepare(sql);
        if (params.length) stmt.bind(params);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    } catch (e) {
        console.error('SQL Error:', e.message, sql);
        return [];
    }
}

function queryOne(sql, params = []) {
    const results = queryAll(sql, params);
    return results.length > 0 ? results[0] : null;
}

function runSql(sql, params = []) {
    const d = db;
    try {
        d.run(sql, params);
        const lastId = d.exec("SELECT last_insert_rowid() as id");
        const changes = d.exec("SELECT changes() as c");
        saveDb(); // Auto-save after writes
        return {
            lastInsertRowid: lastId[0]?.values[0]?.[0] || 0,
            changes: changes[0]?.values[0]?.[0] || 0
        };
    } catch (e) {
        console.error('SQL Error:', e.message, sql);
        throw e;
    }
}

module.exports = { getDb, initDatabase, queryAll, queryOne, runSql, saveDb };
