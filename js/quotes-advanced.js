/* ==============================================
   MADE UTIL — COTIZACIONES AVANZADAS v6.0
   Notas, blog, búsqueda, estado completo
   ============================================== */

const QUOTES_CONFIG = {
    activeKey: 'mu_quotes_active',
    archiveKey: 'mu_quotes_archive',
    notesFormat: 'ISO'
};

// Obtener cotizaciones activas
function getActiveQuotes() {
    return JSON.parse(localStorage.getItem(QUOTES_CONFIG.activeKey) || '[]');
}

// Obtener cotizaciones archivadas (completadas)
function getArchivedQuotes() {
    return JSON.parse(localStorage.getItem(QUOTES_CONFIG.archiveKey) || '[]');
}

function saveActiveQuotes(quotes) {
    localStorage.setItem(QUOTES_CONFIG.activeKey, JSON.stringify(quotes));
}

function saveArchivedQuotes(quotes) {
    localStorage.setItem(QUOTES_CONFIG.archiveKey, JSON.stringify(quotes));
}

// Crear nueva cotización
async function createQuote(data) {
    const quote = {
        id: Date.now(),
        ...data,
        status: 'nuevo',
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const quotes = getActiveQuotes();
    quotes.unshift(quote);
    saveActiveQuotes(quotes);

    // También guardar en backend
    try {
        await API.leads.create(data);
    } catch (e) {
        console.log('Backend offline, guardado en localStorage');
    }

    return quote;
}

// Agregar nota a cotización
function addNoteToQuote(quoteId, note) {
    const quotes = getActiveQuotes();
    const idx = quotes.findIndex(q => q.id === quoteId);

    if (idx >= 0) {
        if (!quotes[idx].notes) quotes[idx].notes = [];
        quotes[idx].notes.push({
            id: Date.now(),
            text: note,
            timestamp: new Date().toISOString(),
            type: 'manual' // 'manual' o 'ia'
        });
        quotes[idx].updatedAt = new Date().toISOString();
        saveActiveQuotes(quotes);
        return true;
    }
    return false;
}

// Agregar nota de IA (resumen de WhatsApp)
function addAINoteToQuote(quoteId, summary) {
    const quotes = getActiveQuotes();
    const idx = quotes.findIndex(q => q.id === quoteId);

    if (idx >= 0) {
        if (!quotes[idx].notes) quotes[idx].notes = [];
        quotes[idx].notes.push({
            id: Date.now(),
            text: `[IA SUMMARY]: ${summary}`,
            timestamp: new Date().toISOString(),
            type: 'ia'
        });
        quotes[idx].updatedAt = new Date().toISOString();
        saveActiveQuotes(quotes);
        return true;
    }
    return false;
}

// Cambiar estado
function updateQuoteStatus(quoteId, status) {
    const quotes = getActiveQuotes();
    const idx = quotes.findIndex(q => q.id === quoteId);

    if (idx >= 0) {
        quotes[idx].status = status;
        quotes[idx].updatedAt = new Date().toISOString();

        // Si se marca como completada, mover a archive
        if (status === 'completada' || status === 'ganada') {
            const [completed] = quotes.splice(idx, 1);
            const archived = getArchivedQuotes();
            archived.unshift(completed);
            saveActiveQuotes(quotes);
            saveArchivedQuotes(archived);
            return completed;
        }

        saveActiveQuotes(quotes);
        return quotes[idx];
    }
    return null;
}

// Buscar en cotizaciones
function searchQuotes(query) {
    const all = [...getActiveQuotes(), ...getArchivedQuotes()];
    const q = query.toLowerCase();

    return all.filter(quote =>
        quote.nombre?.toLowerCase().includes(q) ||
        quote.telefono?.includes(q) ||
        quote.email?.includes(q) ||
        quote.ciudad?.toLowerCase().includes(q) ||
        quote.categorias?.some(cat => cat.toLowerCase().includes(q)) ||
        quote.descripcion?.toLowerCase().includes(q) ||
        quote.notes?.some(n => n.text.toLowerCase().includes(q))
    );
}

// Renderizar lista de cotizaciones activas en admin
function renderActiveQuotesAdmin() {
    const quotes = getActiveQuotes();
    const container = document.getElementById('quotesActiveList');

    if (!container) return;

    if (quotes.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:4rem;color:#9A9490;">No hay cotizaciones activas</div>';
        return;
    }

    container.innerHTML = quotes.map(q => `
        <div style="background:var(--card);border:1px solid rgba(192,118,62,0.2);border-radius:12px;padding:2rem;margin-bottom:1.5rem;">
            <!-- Header -->
            <div style="display:grid;grid-template-columns:1fr auto;gap:2rem;margin-bottom:1.5rem;align-items:start;border-bottom:1px solid rgba(232,218,206,0.1);padding-bottom:1.5rem;">
                <div>
                    <div style="font-family:var(--font-h);font-size:1.2rem;color:#F5F2ED;margin-bottom:0.3rem;">${q.nombre}</div>
                    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.75rem;">
                        <span style="background:rgba(192,118,62,0.15);color:#C0763E;padding:0.3rem 0.8rem;border-radius:12px;font-size:0.7rem;text-transform:uppercase;font-weight:600;">${q.status}</span>
                        ${(q.categorias || []).map(cat => `<span style="background:rgba(70,204,113,0.15);color:#2ecc71;padding:0.3rem 0.8rem;border-radius:12px;font-size:0.7rem;text-transform:uppercase;font-weight:600;">${cat}</span>`).join('')}
                    </div>
                    <div style="color:#9A9490;font-size:0.9rem;">
                        <div>📱 ${q.telefono}</div>
                        <div>📧 ${q.email || '—'}</div>
                        <div>📍 ${q.ciudad || '—'}</div>
                    </div>
                </div>
                
                <div style="display:flex;flex-direction:column;gap:0.5rem;min-width:140px;">
                    <button onclick="openQuoteNotes(${q.id})" style="background:rgba(192,118,62,0.15);border:1px solid rgba(192,118,62,0.3);color:#C0763E;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
                        📝 Ver Notas (${(q.notes || []).length})
                    </button>
                    <select onchange="updateQuoteStatus(${q.id}, this.value); location.reload();" style="background:var(--bg);border:1px solid rgba(232,218,206,0.1);color:#F5F2ED;padding:0.6rem 0.75rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;">
                        <option value="nuevo" ${q.status === 'nuevo' ? 'selected' : ''}>→ Nuevo</option>
                        <option value="contactado" ${q.status === 'contactado' ? 'selected' : ''}>→ Contactado</option>
                        <option value="cotizado" ${q.status === 'cotizado' ? 'selected' : ''}>→ Cotizado</option>
                        <option value="ganada" ${q.status === 'ganada' ? 'selected' : ''}>✓ Ganada</option>
                        <option value="completada" ${q.status === 'completada' ? 'selected' : ''}>✓ Completada</option>
                    </select>
                    <button onclick="deleteQuote(${q.id})" style="background:rgba(231,76,60,0.15);border:1px solid rgba(231,76,60,0.3);color:#e74c3c;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
                        🗑️ Borrar
                    </button>
                </div>
            </div>
            
            <!-- Descripción -->
            <div style="color:#9A9490;font-size:0.9rem;line-height:1.6;margin-bottom:1rem;">
                ${q.descripcion ? `<strong>Proyecto:</strong> ${q.descripcion}` : ''}
            </div>
            
            <!-- Fecha -->
            <div style="font-size:0.75rem;color:#9A9490;letter-spacing:1px;">
                Creado: ${new Date(q.createdAt).toLocaleDateString('es-CO', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    `).join('');
}

// Modal para ver/editar notas
function openQuoteNotes(quoteId) {
    const quotes = getActiveQuotes();
    const quote = quotes.find(q => q.id === quoteId);

    if (!quote) return;

    const notes = quote.notes || [];

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);padding:2rem;';

    modal.innerHTML = `
        <div style="background:#161412;border:1px solid rgba(232,218,206,0.15);border-radius:16px;padding:2rem;max-width:600px;width:100%;max-height:85vh;overflow-y:auto;">
            <h2 style="font-family:var(--font-h);font-size:1.3rem;margin-bottom:0.5rem;">${quote.nombre}</h2>
            <p style="color:#9A9490;margin-bottom:2rem;">📝 Blog de notas y seguimiento</p>
            
            <!-- Lista de notas -->
            <div style="max-height:300px;overflow-y:auto;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid rgba(232,218,206,0.1);">
                ${notes.length === 0 ? '<p style="color:#9A9490;text-align:center;padding:2rem;">Sin notas aún</p>' : notes.map(note => `
                    <div style="background:var(--bg);border-left:3px solid ${note.type === 'ia' ? '#2ecc71' : '#C0763E'};border-radius:6px;padding:1rem;margin-bottom:0.75rem;">
                        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.5rem;">
                            <span style="font-size:0.7rem;background:${note.type === 'ia' ? 'rgba(46,204,113,0.15)' : 'rgba(192,118,62,0.15)'};color:${note.type === 'ia' ? '#2ecc71' : '#C0763E'};padding:0.2rem 0.6rem;border-radius:4px;text-transform:uppercase;font-weight:600;">
                                ${note.type === 'ia' ? '🤖 IA' : '✍️ Manual'}
                            </span>
                            <span style="font-size:0.7rem;color:#9A9490;">${new Date(note.timestamp).toLocaleString('es-CO')}</span>
                        </div>
                        <p style="color:#F5F2ED;line-height:1.6;word-wrap:break-word;">${note.text}</p>
                    </div>
                `).join('')}
            </div>
            
            <!-- Agregar nota -->
            <div style="margin-bottom:1.5rem;">
                <label style="display:block;font-size:0.75rem;letter-spacing:1px;color:#9A9490;text-transform:uppercase;margin-bottom:0.5rem;">Agregar nota</label>
                <textarea id="newNote" placeholder="Escribe una nota sobre esta cotización..." style="width:100%;background:var(--bg);border:1px solid rgba(232,218,206,0.1);color:#F5F2ED;padding:0.85rem;border-radius:8px;font-size:0.9rem;outline:none;resize:vertical;min-height:80px;font-family:inherit;margin-bottom:0.75rem;"></textarea>
                <button onclick="saveNewNote(${quoteId}); this.closest('div').parentElement.parentElement.remove();" style="width:100%;background:#C0763E;border:none;color:white;padding:0.75rem;border-radius:6px;font-weight:600;font-size:0.85rem;letter-spacing:1px;text-transform:uppercase;cursor:pointer;">
                    Guardar Nota
                </button>
            </div>
            
            <!-- Botones -->
            <div style="display:flex;gap:1rem;">
                <button onclick="this.closest('div').parentElement.remove()" style="flex:1;background:transparent;border:1px solid rgba(232,218,206,0.15);color:#9A9490;padding:0.75rem;border-radius:6px;font-weight:600;font-size:0.85rem;letter-spacing:1px;text-transform:uppercase;cursor:pointer;">
                    Cerrar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function saveNewNote(quoteId) {
    const text = document.getElementById('newNote')?.value.trim();
    if (!text) return;

    addNoteToQuote(quoteId, text);
    renderActiveQuotesAdmin();
}

function deleteQuote(quoteId) {
    if (typeof showConfirm === 'function') {
        showConfirm('¿Borrar esta cotización?', () => {
            const quotes = getActiveQuotes().filter(q => q.id !== quoteId);
            saveActiveQuotes(quotes);
            renderActiveQuotesAdmin();
        });
    } else {
        const quotes = getActiveQuotes().filter(q => q.id !== quoteId);
        saveActiveQuotes(quotes);
        renderActiveQuotesAdmin();
    }
}

// Búsqueda
function searchQuotesAdmin(query) {
    const results = searchQuotes(query);
    const container = document.getElementById('quotesActiveList');

    if (!container || !query.trim()) {
        renderActiveQuotesAdmin();
        return;
    }

    if (results.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:4rem;color:#9A9490;">No hay coincidencias</div>';
        return;
    }

    // Renderizar resultados de búsqueda (usar el mismo template que activas)
    container.innerHTML = results.filter(q => !['ganada', 'completada'].includes(q.status)).map(q => `
        <div style="background:var(--card);border:1px solid rgba(192,118,62,0.2);border-radius:12px;padding:2rem;margin-bottom:1.5rem;">
            <!-- (igual que renderActiveQuotesAdmin) -->
            <div style="font-family:var(--font-h);font-size:1.2rem;color:#F5F2ED;">${q.nombre}</div>
            <div style="color:#9A9490;">📱 ${q.telefono}</div>
        </div>
    `).join('');
}

// Renderizar archivadas
function renderArchivedQuotesAdmin() {
    const quotes = getArchivedQuotes();
    const container = document.getElementById('quotesArchivedList');

    if (!container) return;

    if (quotes.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:4rem;color:#9A9490;">Sin proyectos completados aún</div>';
        return;
    }

    container.innerHTML = quotes.map(q => `
        <div style="background:var(--card);border:1px solid rgba(46,204,113,0.2);border-radius:12px;padding:2rem;margin-bottom:1.5rem;">
            <div style="display:grid;grid-template-columns:1fr auto;gap:2rem;">
                <div>
                    <div style="font-family:var(--font-h);font-size:1.1rem;color:#2ecc71;">✓ ${q.nombre}</div>
                    <div style="color:#9A9490;margin-top:0.5rem;">
                        <div>📞 ${q.telefono}</div>
                        <div>📍 ${q.ciudad || '—'}</div>
                    </div>
                </div>
                <button onclick="viewArchivedDetails(${q.id})" style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.3);color:#2ecc71;padding:0.6rem 1rem;border-radius:6px;height:fit-content;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
                    📋 Detalles
                </button>
            </div>
        </div>
    `).join('');
}

// Inicializar en admin cuando carga
document.addEventListener('DOMContentLoaded', () => {
    renderActiveQuotesAdmin();
    renderArchivedQuotesAdmin();
});
