/**
 * SOLICITUDES ADMIN PANEL
 * Maneja solicitudes de web + WhatsApp en tiempo real
 * Integra IA de sugerencias y resúmenes automáticos
 */

const SOLICITUDES_API = (typeof API_BASE !== 'undefined' && API_BASE ? API_BASE : 'http://localhost:3001') + '/api/leads';

// ==================== RENDERIZAR SOLICITUDES ====================
async function loadSolicitudes() {
    try {
        const res = await fetch(SOLICITUDES_API);
        if (!res.ok) throw new Error('Error al cargar solicitudes');
        const solicitudes = await res.json();
        renderSolicitudes(solicitudes);
        updateSolicitudesCount(solicitudes.length);
    } catch (err) {
        console.error('Error loading solicitudes:', err);
        document.getElementById('solicitudesList').innerHTML = 
            '<p style="text-align:center;color:var(--muted);padding:2rem;">Error al cargar solicitudes</p>';
    }
}

function updateSolicitudesCount(count) {
    const el = document.getElementById('leadsCount');
    if (el) el.textContent = count > 0 ? count : '';
}

function renderSolicitudes(solicitudes) {
    const container = document.getElementById('solicitudesList');
    
    if (!solicitudes || solicitudes.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:3rem;">No hay solicitudes todavía</p>';
        return;
    }

    // Ordenar por fecha descendente (más recientes primero)
    const sorted = [...solicitudes].sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
    );

    container.innerHTML = sorted.map(sol => createSolicitudCard(sol)).join('');
    
    // Agregar event listeners
    sorted.forEach(sol => {
        const card = container.querySelector(`[data-solicitud-id="${sol.id}"]`);
        if (card) {
            card.querySelector('.sol-expand-btn')?.addEventListener('click', () => 
                openSolicitudModal(sol)
            );
        }
    });
}

function createSolicitudCard(sol) {
    const fecha = new Date(sol.fecha).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const origen = sol.origen === 'whatsapp' ? 
        '<span style="background:rgba(37,211,102,0.15);color:#25d366;padding:0.25rem 0.6rem;border-radius:4px;font-size:0.7rem;font-weight:600;">WhatsApp</span>' :
        '<span style="background:rgba(52,152,219,0.15);color:#3498db;padding:0.25rem 0.6rem;border-radius:4px;font-size:0.7rem;font-weight:600;">Web</span>';

    const resumenIA = sol.resumen_ia ? 
        `<div style="margin-top:0.75rem;padding:0.75rem;background:rgba(192,118,62,0.08);border-radius:6px;border-left:3px solid var(--brown);font-size:0.82rem;color:var(--white);">
            <div style="font-weight:600;margin-bottom:0.3rem;color:var(--brown);">📋 Resumen IA:</div>
            <div>${sol.resumen_ia}</div>
        </div>` : '';

    return `
        <div class="solicitud-card" data-solicitud-id="${sol.id}" 
             style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1.25rem;margin-bottom:1rem;transition:all 0.3s ease;">
            
            <div style="display:grid;grid-template-columns:1fr auto;gap:1rem;margin-bottom:1rem;">
                <div>
                    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;">
                        <span style="font-size:1.1rem;">👤</span>
                        <span style="font-family:var(--font-h);font-weight:600;color:var(--white);">${sol.nombre || 'Sin nombre'}</span>
                        ${origen}
                    </div>
                    <div style="color:var(--muted);font-size:0.8rem;">${fecha}</div>
                </div>
                <button class="sol-expand-btn" style="align-self:start;background:var(--brown);color:var(--bg);border:none;border-radius:6px;padding:0.5rem 1rem;cursor:pointer;font-weight:600;font-size:0.85rem;">
                    Ver Detalles
                </button>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.75rem;margin-bottom:1rem;font-size:0.85rem;">
                ${sol.telefono ? `
                    <div>
                        <div style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;">📱 Teléfono</div>
                        <a href="https://wa.me/${sol.telefono.replace(/\D/g, '')}" target="_blank" 
                           style="color:var(--brown);text-decoration:none;font-weight:600;">
                           ${sol.telefono}
                        </a>
                    </div>
                ` : ''}
                ${sol.email ? `
                    <div>
                        <div style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;">✉️ Email</div>
                        <a href="mailto:${sol.email}" style="color:var(--brown);text-decoration:none;font-weight:600;">${sol.email}</a>
                    </div>
                ` : ''}
                ${sol.ciudad ? `
                    <div>
                        <div style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;">📍 Ciudad</div>
                        <span style="font-weight:600;">${sol.ciudad}</span>
                    </div>
                ` : ''}
                ${sol.status ? `
                    <div>
                        <div style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;">Status</div>
                        <span style="background:${sol.status === 'activa' ? 'rgba(46,204,113,0.15)' : 'rgba(154,152,144,0.15)'};color:${sol.status === 'activa' ? '#2ecc71' : '#9A9490'};padding:0.2rem 0.5rem;border-radius:4px;font-size:0.75rem;font-weight:600;">
                            ${sol.status}
                        </span>
                    </div>
                ` : ''}
            </div>

            ${(sol.descripcion || sol.mensaje) ? `
                <div style="background:rgba(232,218,206,0.05);padding:0.75rem;border-radius:6px;margin-bottom:1rem;border-left:3px solid var(--muted);font-size:0.85rem;">
                    <div style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.3rem;">📝 Descripción del Proyecto</div>
                    <div>${sol.descripcion || sol.mensaje}</div>
                </div>
            ` : ''}

            ${resumenIA}

            ${sol.notas && sol.notas.length > 0 ? `
                <div style="margin-top:1rem;border-top:1px solid var(--border);padding-top:1rem;">
                    <div style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5rem;">📌 Notas (${sol.notas.length})</div>
                    <div style="display:flex;flex-direction:column;gap:0.5rem;">
                        ${sol.notas.slice(-3).reverse().map(nota => `
                            <div style="padding:0.5rem;background:rgba(192,118,62,0.08);border-radius:4px;font-size:0.8rem;border-left:2px solid var(--brown);">
                                <div style="color:var(--muted);font-size:0.65rem;">${fecha}</div>
                                <div>${nota}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// ==================== MODAL DE DETALLES ====================
function openSolicitudModal(sol) {
    const modal = document.getElementById('modalSolicitud');
    if (!modal) return;

    // Header
    document.getElementById('modalSolNombre').textContent = sol.nombre || 'Solicitud sin nombre';
    document.getElementById('modalSolFecha').textContent = new Date(sol.fecha).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('modalSolOrigen').innerHTML = sol.origen === 'whatsapp' ?
        '<span style="background:#25d366;color:white;padding:0.25rem 0.6rem;border-radius:4px;font-size:0.75rem;font-weight:600;">WhatsApp</span>' :
        '<span style="background:#3498db;color:white;padding:0.25rem 0.6rem;border-radius:4px;font-size:0.75rem;font-weight:600;">Formulario Web</span>';

    // Información principal
    let infoHTML = `
        <div style="display:grid;gap:0.75rem;">
            ${sol.nombre ? `<div><b>Nombre:</b> ${sol.nombre}</div>` : ''}
            ${sol.telefono ? `<div><b>Teléfono:</b> <a href="https://wa.me/${sol.telefono.replace(/\D/g, '')}" target="_blank" style="color:var(--brown);">${sol.telefono}</a></div>` : ''}
            ${sol.email ? `<div><b>Email:</b> <a href="mailto:${sol.email}" style="color:var(--brown);">${sol.email}</a></div>` : ''}
            ${sol.ciudad ? `<div><b>Ciudad:</b> ${sol.ciudad}</div>` : ''}
            ${sol.status ? `<div><b>Status:</b> ${sol.status}</div>` : ''}
        </div>
    `;
    document.getElementById('modalSolInfo').innerHTML = infoHTML;

    // Descripción
    document.getElementById('modalSolDesc').innerHTML = (sol.descripcion || sol.mensaje) || '(Sin descripción)';

    // Resumen IA
    if (sol.resumen_ia) {
        document.getElementById('modalSolResumen').innerHTML = `
            <div style="background:rgba(192,118,62,0.1);padding:1rem;border-radius:6px;border-left:3px solid var(--brown);">
                <div style="font-weight:600;margin-bottom:0.5rem;color:var(--brown);">📋 Análisis de IA</div>
                <div>${sol.resumen_ia}</div>
            </div>
        `;
    } else {
        document.getElementById('modalSolResumen').innerHTML = '<p style="color:var(--muted);font-size:0.85rem;">IA aún procesando...</p>';
    }

    // Notas
    const notasContainer = document.getElementById('modalSolNotas');
    if (sol.notas && sol.notas.length > 0) {
        notasContainer.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:0.75rem;max-height:300px;overflow-y:auto;">
                ${sol.notas.map((nota, idx) => `
                    <div style="padding:0.75rem;background:var(--bg);border-radius:6px;border-left:3px solid var(--brown);font-size:0.85rem;">
                        <div style="color:var(--muted);font-size:0.75rem;margin-bottom:0.3rem;">
                            📌 Nota ${idx + 1}
                        </div>
                        <div>${nota}</div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        notasContainer.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;text-align:center;padding:1rem;">No hay notas todavía</p>';
    }

    // Nueva nota
    document.getElementById('newNoteInput').value = '';
    document.getElementById('btnAddNote').onclick = () => addNoteToSolicitud(sol.id);
    
    // Generar sugerencias de IA automáticamente
    generateIASuggestions(sol);

    // Abrir modal
    modal.classList.add('open');
}

async function addNoteToSolicitud(solicitudId) {
    const input = document.getElementById('newNoteInput');
    const nota = input.value.trim();
    if (!nota) return alert('Escribe una nota');

    try {
        const res = await fetch(`${SOLICITUDES_API}/${solicitudId}/notas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nota })
        });

        if (res.ok) {
            input.value = '';
            // Reload solicitud
            loadSolicitudes();
        } else {
            alert('Error al agregar nota');
        }
    } catch (err) {
        console.error('Error adding note:', err);
        alert('Error al guardar nota');
    }
}

// ==================== SUGERENCIAS IA EN TIEMPO REAL ====================
async function generateIASuggestions(sol) {
    const chatContainer = document.getElementById('modalSolAISuggestions');
    if (!chatContainer) return;

    chatContainer.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;">IA generando sugerencias...</p>';

    try {
        // Simulación de IA (en producción: conectar a OpenAI/Claude)
        const suggestions = generateSuggestionsLocal(sol);
        
        chatContainer.innerHTML = suggestions.map((sug, idx) => `
            <button class="suggestion-btn" data-suggestion="${idx}"
                    style="text-align:left;padding:0.75rem;background:rgba(192,118,62,0.1);border:1px solid rgba(192,118,62,0.3);border-radius:6px;cursor:pointer;color:var(--white);font-size:0.85rem;transition:all 0.3s ease;">
                <div style="display:flex;gap:0.5rem;align-items:flex-start;">
                    <span style="color:var(--brown);font-weight:600;">✓</span>
                    <div>${sug}</div>
                </div>
            </button>
        `).join('');

        // Add event listeners and store suggestions
        chatContainer.querySelectorAll('.suggestion-btn').forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                document.getElementById('newNoteInput').value = suggestions[idx];
                document.getElementById('newNoteInput').focus();
            });
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(192,118,62,0.2)';
                btn.style.borderColor = 'rgba(192,118,62,0.6)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(192,118,62,0.1)';
                btn.style.borderColor = 'rgba(192,118,62,0.3)';
            });
        });
    } catch (err) {
        console.error('Error generating suggestions:', err);
        chatContainer.innerHTML = '<p style="color:var(--muted);">Error al generar sugerencias</p>';
    }
}

function generateSuggestionsLocal(sol) {
    // Sugerencias basadas en el contenido de la solicitud
    const suggestions = [];

    // Según categoría
    if (sol.descripcion || sol.mensaje) {
        const desc = (sol.descripcion || sol.mensaje).toLowerCase();
        
        if (desc.includes('cocina')) {
            suggestions.push('✅ Agendar visita técnica para medir instalación de cocina integral');
            suggestions.push('📊 Presentar presupuesto con opciones de materiales (melamina, MDF, etc.)');
            suggestions.push('🔧 Preguntar sobre plazos y si pueden esperar entrega (4-6 semanas)');
        }
        
        if (desc.includes('closet') || desc.includes('armario') || desc.includes('vestidor')) {
            suggestions.push('✅ Agendar visita para medir espacios del closet/vestidor');
            suggestions.push('💡 Sugerir incluir iluminación LED interna (valor agregado)');
            suggestions.push('👔 Ofrecer organización interna (perchas, cajas, divisiones)');
        }
        
        if (desc.includes('mesa')) {
            suggestions.push('📏 Confirmar medidas exactas y altura requerida');
            suggestions.push('🎨 Presentar muestras de colores y acabados disponibles');
            suggestions.push('💼 Enviar referencia de proyectos similares ya realizados');
        }

        // General
        if (!suggestions.length) {
            suggestions.push('✅ Contactar cliente para detalles adicionales del proyecto');
            suggestions.push('📋 Solicitar fotos del espacio (si es reforma)');
            suggestions.push('💬 Preguntar presupuesto aproximado y plazo requerido');
        }
    }

    return suggestions.slice(0, 3);
}

function insertSuggestion(text, idx) {
    const notaInput = document.getElementById('newNoteInput');
    if (notaInput) {
        notaInput.value = text;
        notaInput.focus();
    }
}

// ==================== AUTO-REFRESH ====================
let autoRefreshInterval = null;

function startAutoRefresh() {
    if (autoRefreshInterval) return;
    autoRefreshInterval = setInterval(() => {
        loadSolicitudes();
    }, 10000); // Refresh cada 10 segundos
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// ==================== INICIALIZAR ====================
document.addEventListener('DOMContentLoaded', () => {
    loadSolicitudes();
    startAutoRefresh();
});

// Stop refresh when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoRefresh();
    } else {
        loadSolicitudes();
        startAutoRefresh();
    }
});
