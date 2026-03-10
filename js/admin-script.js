'use strict';

const ADMIN_PASS = '123';
const COLL_KEY = 'mu_collections';
const PROJ_KEY = 'mu_projects';

// ── Storage helpers ──────────────────────────────────────────────
const getColls = () => JSON.parse(localStorage.getItem(COLL_KEY) || '[]');
const getProjs = () => JSON.parse(localStorage.getItem(PROJ_KEY) || '[]');
const saveColls = d => localStorage.setItem(COLL_KEY, JSON.stringify(d));
const saveProjs = d => localStorage.setItem(PROJ_KEY, JSON.stringify(d));

// ── Seed ─────────────────────────────────────────────────────────
function seedData() {
    if (!localStorage.getItem(COLL_KEY)) {
        saveColls([
            { id: 'cocinas', name: 'Cocinas', description: 'El corazon del hogar.', cover: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80' },
            { id: 'armarios', name: 'Armarios', description: 'Sistemas modulares a medida.', cover: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1200&q=80' },
            { id: 'mobiliario', name: 'Mobiliario', description: 'Piezas unicas para tu espacio.', cover: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200&q=80' }
        ]);
    }
    if (!localStorage.getItem(PROJ_KEY)) {
        saveProjs([
            { id: 1700000001, collection: 'cocinas', name: 'Residencia Roble', type: 'destacado', location: 'Medellin, 2024', description: 'Melamina de alta resistencia con herrajes europeos.', specs: [{ label: 'Material', value: 'Roble Europeo' }, { label: 'Herrajes', value: 'Blum' }], media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80' }] },
            { id: 1700000002, collection: 'cocinas', name: 'Dark Matter', type: 'normal', location: 'Envigado', description: 'Bloque monolitico de acabado oscuro.', specs: [{ label: 'Acabado', value: 'Grafito Mate' }], media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80' }] },
            { id: 1700000003, collection: 'cocinas', name: 'White Minimal', type: 'normal', location: 'Poblado', description: 'Pureza geometrica en laca blanca.', specs: [{ label: 'Acabado', value: 'Laca Blanca Mate' }], media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&q=80' }] },
            { id: 1700000101, collection: 'armarios', name: 'Walk-In Master', type: 'destacado', location: 'Llanogrande', description: 'Vestidor modular de alta gama.', specs: [{ label: 'Tipo', value: 'Vestidor Modular' }], media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1200&q=80' }] },
            { id: 1700000102, collection: 'armarios', name: 'Vestidor Glass', type: 'normal', location: 'Medellin', description: 'Vidrio templado oscuro de alta elegancia.', specs: [{ label: 'Cristaleria', value: 'Vidrio Templado' }], media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80' }] },
            { id: 1700000201, collection: 'mobiliario', name: 'Mesa Monolito', type: 'destacado', location: 'Rionegro', description: 'Presencia escultorica en nogal solido.', specs: [{ label: 'Material', value: 'Nogal Solido' }], media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200&q=80' }] },
            { id: 1700000202, collection: 'mobiliario', name: 'Stone Console', type: 'normal', location: 'Medellin', description: 'Consola minimalista de concreto y acero.', specs: [{ label: 'Material', value: 'Concreto + Acero' }], media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1519961655809-34fa156820ff?w=800&q=80' }] }
        ]);
    }
}
seedData();

// ── Auth ─────────────────────────────────────────────────────────
function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminMain').style.display = 'block';
    renderDashboard();
}

function tryLogin() {
    if (document.getElementById('adminPass').value === ADMIN_PASS) {
        sessionStorage.setItem('mu_admin', '1');
        showDashboard();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

document.getElementById('loginBtn').addEventListener('click', tryLogin);
document.getElementById('adminPass').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
document.getElementById('btnLogout').addEventListener('click', () => { sessionStorage.removeItem('mu_admin'); location.reload(); });

if (sessionStorage.getItem('mu_admin')) showDashboard();

// ── Render Dashboard ─────────────────────────────────────────────
function renderDashboard() {
    const colls = getColls();
    const projs = getProjs();
    const container = document.getElementById('collectionsList');

    if (!colls.length) {
        container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:4rem;">No hay colecciones todavia. Crea la primera.</p>';
        return;
    }

    container.innerHTML = colls.map(c => {
        const cProjs = projs.filter(p => p.collection === c.id);
        const cards = cProjs.map(p => {
            const thumb = (p.media && p.media[0]) ? p.media[0].data : '';
            const isVideo = thumb && p.media[0].type && p.media[0].type.startsWith('video');
            const media = thumb
                ? (isVideo ? `<video class="project-thumb" src="${thumb}" muted></video>` : `<img class="project-thumb" src="${thumb}">`)
                : `<div class="project-thumb"></div>`;
            return `
            <div class="project-card">
                ${media}
                <div class="project-meta">
                    ${p.type === 'destacado' ? '<span class="project-badge">DESTACADO</span>' : ''}
                    <div class="project-name">${p.name}</div>
                    <div style="font-size:0.72rem;color:var(--muted);margin-bottom:0.5rem;">${p.location || ''}</div>
                    <div class="project-actions">
                        <button class="btn-sm" data-edit="${p.id}">Editar</button>
                        <button class="btn-sm del" data-proj-id="${p.id}">Borrar</button>
                    </div>
                </div>
            </div>`;
        }).join('');

        return `
        <div class="collection-block">
            <div class="collection-header">
                <div class="collection-info">
                    <h2>${c.name}</h2>
                    <p>${c.description || ''}</p>
                </div>
                <button class="btn-sm-danger" data-del-coll="${c.id}">Eliminar Coleccion</button>
            </div>
            <div class="projects-grid">
                ${cards}
                <div class="add-project-card" data-add-to="${c.id}">
                    <div class="plus">+</div>
                    Anadir a ${c.name}
                </div>
            </div>
        </div>`;
    }).join('');

    // Event listeners – attached fresh after every render
    container.querySelectorAll('[data-del-coll]').forEach(b =>
        b.addEventListener('click', () => deleteCollection(b.dataset.delColl)));

    container.querySelectorAll('[data-proj-id]').forEach(b =>
        b.addEventListener('click', () => deleteProject(b.dataset.projId)));

    container.querySelectorAll('[data-edit]').forEach(b =>
        b.addEventListener('click', () => {
            const p = getProjs().find(x => String(x.id) === String(b.dataset.edit));
            if (p) openEditModal(p);
        }));

    container.querySelectorAll('[data-add-to]').forEach(card =>
        card.addEventListener('click', () => openAddModal(card.dataset.addTo)));
}

// ── Collection CRUD ───────────────────────────────────────────────
let colCoverB64 = '';

document.getElementById('btnNewColl').addEventListener('click', () => {
    document.getElementById('colName').value = '';
    document.getElementById('colDesc').value = '';
    document.getElementById('colCoverPreview').innerHTML = '';
    colCoverB64 = '';
    openModal('modalCollection');
});

document.getElementById('colCoverInput').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
        colCoverB64 = ev.target.result;
        document.getElementById('colCoverPreview').innerHTML = `<img src="${colCoverB64}" style="width:100%;border-radius:6px;">`;
    };
    r.readAsDataURL(f);
});

document.getElementById('btnSaveColl').addEventListener('click', () => {
    const name = document.getElementById('colName').value.trim();
    if (!name) { alert('Escribe un nombre para la coleccion'); return; }
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const colls = getColls();
    if (colls.find(c => c.id === id)) { alert('Ya existe una coleccion con ese nombre'); return; }
    colls.push({
        id,
        name,
        description: document.getElementById('colDesc').value.trim(),
        cover: colCoverB64 || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80'
    });
    saveColls(colls);
    closeModals();
    renderDashboard();
});

function deleteCollection(id) {
    const coll = getColls().find(c => c.id === id);
    const name = coll ? coll.name : id;
    showConfirm(`Eliminar la coleccion "${name}" y TODOS sus proyectos?`, () => {
        saveColls(getColls().filter(c => c.id !== id));
        saveProjs(getProjs().filter(p => p.collection !== id));
        renderDashboard();
    });
}

// ── Custom confirm dialog (replaces browser confirm for file:// compat) ──
function showConfirm(message, onAccept) {
    const old = document.getElementById('muConfirm');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'muConfirm';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:99999;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `
        <div style="background:#1a1714;border:1px solid rgba(192,118,62,0.3);border-radius:12px;padding:2rem;max-width:380px;width:90%;text-align:center;">
            <p style="font-family:'Space Grotesk',sans-serif;font-size:1rem;margin-bottom:1.5rem;line-height:1.5;">${message}</p>
            <div style="display:flex;gap:1rem;">
                <button id="muConfirmCancel" style="flex:1;background:transparent;border:1px solid rgba(232,218,206,0.15);color:#9A9490;padding:0.75rem;border-radius:6px;cursor:pointer;font-size:0.85rem;">Cancelar</button>
                <button id="muConfirmOk" style="flex:1;background:#e74c3c;border:none;color:white;padding:0.75rem;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.85rem;">Borrar</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);
    document.getElementById('muConfirmCancel').addEventListener('click', () => overlay.remove());
    document.getElementById('muConfirmOk').addEventListener('click', () => { overlay.remove(); onAccept(); });
}

// ── Project CRUD ──────────────────────────────────────────────────
let projMedia = [];

function openAddModal(collId) {
    document.getElementById('projId').value = '';
    document.getElementById('projCollId').value = collId;
    document.getElementById('projName').value = '';
    document.getElementById('projType').value = 'normal';
    document.getElementById('projLoc').value = '';
    document.getElementById('projDesc').value = '';
    document.getElementById('projSpecs').innerHTML = '';
    document.getElementById('projPreviews').innerHTML = '';
    projMedia = [];
    addSpecRow();
    document.getElementById('projModalTitle').textContent = 'Anadir Proyecto';
    openModal('modalProject');
}

function openEditModal(p) {
    document.getElementById('projId').value = String(p.id);
    document.getElementById('projCollId').value = p.collection;
    document.getElementById('projName').value = p.name || '';
    document.getElementById('projType').value = p.type || 'normal';
    document.getElementById('projLoc').value = p.location || '';
    document.getElementById('projDesc').value = p.description || '';
    projMedia = Array.isArray(p.media) ? [...p.media] : [];
    renderMediaPreviews();
    document.getElementById('projSpecs').innerHTML = '';
    (p.specs && p.specs.length ? p.specs : [{}]).forEach(s => addSpecRow(s.label, s.value));
    document.getElementById('projModalTitle').textContent = 'Editar Proyecto';
    openModal('modalProject');
}

document.getElementById('btnSaveProj').addEventListener('click', () => {
    const idVal = document.getElementById('projId').value;
    const name = document.getElementById('projName').value.trim();
    if (!name) { alert('El nombre del proyecto es obligatorio'); return; }

    const specs = Array.from(document.querySelectorAll('#projSpecs .spec-row')).map(row => {
        const ins = row.querySelectorAll('input');
        return { label: ins[0].value.trim(), value: ins[1].value.trim() };
    }).filter(s => s.label && s.value);

    const proj = {
        id: idVal ? parseInt(idVal, 10) : Date.now(),
        collection: document.getElementById('projCollId').value,
        name,
        type: document.getElementById('projType').value,
        location: document.getElementById('projLoc').value.trim(),
        description: document.getElementById('projDesc').value.trim(),
        media: [...projMedia],
        specs
    };

    let projs = getProjs();
    if (idVal) {
        const idx = projs.findIndex(x => String(x.id) === idVal);
        if (idx >= 0) { projs[idx] = proj; }
        else { projs.unshift(proj); }
    } else {
        projs.push(proj);
    }
    saveProjs(projs);
    closeModals();
    renderDashboard();
});

function deleteProject(id) {
    showConfirm('Borrar este proyecto? Esta accion no se puede deshacer.', () => {
        const projs = getProjs();
        const filtered = projs.filter(p => String(p.id) !== String(id));
        saveProjs(filtered);
        renderDashboard();
    });
}

// ── Spec rows ─────────────────────────────────────────────────────
document.getElementById('btnAddSpec').addEventListener('click', () => addSpecRow());

function addSpecRow(l = '', v = '') {
    const row = document.createElement('div');
    row.className = 'spec-row';
    row.innerHTML = `
    <input class="form-input" placeholder="Etiqueta" value="${l}">
    <input class="form-input" placeholder="Valor"    value="${v}">
    <button class="btn-sm del" type="button" style="padding:0.3rem 0.5rem;" onclick="this.closest('.spec-row').remove()">×</button>`;
    document.getElementById('projSpecs').appendChild(row);
}

// ── Media upload (images compressed to avoid localStorage quota) ──
function compressImage(file, callback) {
    const MAX = 900, QUALITY = 0.75;
    const reader = new FileReader();
    reader.onload = ev => {
        if (file.type.startsWith('video')) {
            callback({ name: file.name, type: file.type, data: ev.target.result });
            return;
        }
        const img = new Image();
        img.onload = () => {
            let w = img.width, h = img.height;
            if (w > MAX || h > MAX) {
                if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                else { w = Math.round(w * MAX / h); h = MAX; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            callback({ name: file.name, type: 'image/jpeg', data: canvas.toDataURL('image/jpeg', QUALITY) });
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
}

document.getElementById('projMediaInput').addEventListener('change', e => {
    const files = Array.from(e.target.files);
    let processed = 0;
    const results = new Array(files.length);
    files.forEach((f, idx) => {
        compressImage(f, mediaObj => {
            results[idx] = mediaObj;
            processed++;
            if (processed === files.length) {
                results.forEach(m => projMedia.push(m));
                renderMediaPreviews();
            }
        });
    });
    e.target.value = '';
});


function renderMediaPreviews() {
    document.getElementById('projPreviews').innerHTML = projMedia.map((m, i) => {
        const el = m.type && m.type.startsWith('video')
            ? `<video src="${m.data}" style="width:88px;height:66px;object-fit:cover;border-radius:4px;display:block;" muted></video>`
            : `<img  src="${m.data}" style="width:88px;height:66px;object-fit:cover;border-radius:4px;display:block;">`;
        return `<div style="position:relative;display:inline-block;margin:0 0.4rem 0.4rem 0;vertical-align:top;">
        ${el}
        <button type="button" onclick="removeMedia(${i})" style="position:absolute;top:-7px;right:-7px;width:20px;height:20px;background:var(--red);border:none;border-radius:50%;color:white;cursor:pointer;font-size:0.75rem;line-height:20px;text-align:center;">×</button>
    </div>`;
    }).join('');
}

function removeMedia(i) { projMedia.splice(i, 1); renderMediaPreviews(); }

// ── Modal helpers ─────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
}

// ==================== TABS ==================
function switchTab(tab, btn) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    const map = { portfolio: 'sectionPortfolio', faq: 'sectionFaq', resenas: 'sectionResenas', cotizaciones: 'sectionCotizaciones', suscriptores: 'sectionSuscriptores' };
    document.getElementById(map[tab]).classList.add('active');
    if (tab === 'faq') renderFaqList();
    if (tab === 'resenas') renderResenas();
    if (tab === 'cotizaciones') loadSolicitudes();
    if (tab === 'suscriptores') loadSubscribers();
}

// ==================== FAQ CRUD ==================
const FAQ_KEY = 'mu_faqs';
const DEFAULT_FAQS = [
    { q: '¿Cómo se maneja el precio de un proyecto?', a: 'Cada proyecto es único. El precio depende del diseño, tamaño, materiales y herrajes. Agenda una visita técnica gratuita.' },
    { q: '¿Qué materiales utilizan?', a: 'Melaminas Arauco, herrajes Blum (Alemania), perfilería de aluminio, vidrio templado, y mesones en cuarzo.' },
    { q: '¿Cuánto tiempo toma un proyecto?', a: 'Promedio de 4-8 semanas desde la aprobación del diseño hasta la instalación.' },
    { q: '¿Ofrecen garantía?', a: '4 años de garantía estructural. Herrajes Blum: garantía del fabricante de por vida.' },
    { q: '¿Qué zonas cubren?', a: 'Todo el Área Metropolitana: Medellín, El Poblado, Envigado, Sabaneta, Llanogrande, Rionegro.' },
    { q: '¿Cómo inicio mi proyecto?', a: 'Formulario de cotización, llamada al 300 544 4049 o WhatsApp. Respuesta en menos de 24h.' }
];
function getFaqs() {
    const s = localStorage.getItem(FAQ_KEY);
    if (s) return JSON.parse(s);
    localStorage.setItem(FAQ_KEY, JSON.stringify(DEFAULT_FAQS));
    return DEFAULT_FAQS;
}
function saveFaqs(d) { localStorage.setItem(FAQ_KEY, JSON.stringify(d)); }

let editingFaqIdx = -1;
function openFaqModal(idx) {
    editingFaqIdx = idx !== undefined ? idx : -1;
    const modal = document.getElementById('modalFaq');
    if (editingFaqIdx >= 0) {
        const f = getFaqs()[editingFaqIdx];
        document.getElementById('faqQ').value = f.q;
        document.getElementById('faqA').value = f.a;
    } else {
        document.getElementById('faqQ').value = '';
        document.getElementById('faqA').value = '';
    }
    modal.classList.add('open');
}
// btnSaveFaq bound in DOMContentLoaded (modal is after </script>)
function deleteFaq(idx) {
    showConfirm('Eliminar esta pregunta?', () => {
        const faqs = getFaqs();
        faqs.splice(idx, 1);
        saveFaqs(faqs);
        renderFaqList();
    });
}
function renderFaqList() {
    const faqs = getFaqs();
    const el = document.getElementById('faqList');
    if (!faqs.length) {
        el.innerHTML = '<p style="text-align:center;color:var(--muted);padding:4rem;">No hay preguntas. Agrega la primera.</p>';
        return;
    }
    el.innerHTML = faqs.map((f, i) => `
    <div class="faq-edit-item">
        <div class="faq-texts">
            <div class="faq-q">${f.q}</div>
            <div class="faq-a">${f.a}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <button class="btn-sm" onclick="openFaqModal(${i})">Editar</button>
            <button class="btn-sm del" onclick="deleteFaq(${i})">Borrar</button>
        </div>
    </div>`).join('');
}

// ==================== LEADS / COTIZACIONES ==================
const LEADS_KEY = 'madeutil_leads';
function getLeads() { return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'); }

function updateLeadsCount() {
    const n = getLeads().length;
    const el = document.getElementById('leadsCount');
    if (el) el.textContent = n > 0 ? n : '';
}
updateLeadsCount();

function renderLeads() {
    const leads = getLeads();
    updateLeadsCount();
    const el = document.getElementById('leadsList');
    if (!leads.length) {
        el.innerHTML = '<p style="text-align:center;color:var(--muted);padding:4rem;">Todavía no hay cotizaciones. Cuando alguien llene el formulario aparecerá aquí.</p>';
        return;
    }
    el.innerHTML = [...leads].reverse().map((l, i) => {
        const cats = (l.categorias || []).join(', ');
        const waMsg = encodeURIComponent(`Hola ${l.nombre || ''}! Soy de Made Util 🙏
Gracias por cotizar con nosotros.
Vi que te interesa: ${cats}.
En Medellín, ${l.ciudad || ''}, les damos una atención personalizada.
¿Cuándo podríamos coordinar una visita de medición y asesoría gratuita?`);
        const phone = (l.telefono || '').replace(/\D/g, '');
        const waLink = phone ? `https://wa.me/57${phone}?text=${waMsg}` : '#';
        const fecha = l.fecha ? new Date(l.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Fecha desconocida';
        return `
        <div class="lead-card">
            <div class="lead-header">
                <div>
                    <div class="lead-name">${l.nombre || 'Sin nombre'}</div>
                    <div class="lead-date">${fecha}</div>
                </div>
                <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                    ${waLink !== '#' ? `<a href="${waLink}" target="_blank" class="wa-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                        </svg>
                        WhatsApp
                    </a>` : ''}
                    <button class="btn-sm del" onclick="deleteLead(${leads.length - 1 - i})">Archivar</button>
                </div>
            </div>
            <div class="lead-chips">
                ${(l.categorias || []).map(c => `<span class="lead-chip">${c}</span>`).join('')}
                ${l.estilo ? `<span class="lead-chip">${l.estilo}</span>` : ''}
                ${l.urgencia ? `<span class="lead-chip" style="background:rgba(46,204,113,0.1);border-color:rgba(46,204,113,0.3);color:#2ecc71;">${l.urgencia}</span>` : ''}
            </div>
            <div class="lead-desc">
                ${l.descripcion ? `<b>Proyecto:</b> ${l.descripcion}<br>` : ''}
                ${l.medidas ? `<b>Medidas:</b> ${l.medidas}<br>` : ''}
                ${l.ciudad ? `<b>Ciudad:</b> ${l.ciudad}<br>` : ''}
            </div>
            <div style="font-size:0.82rem;">
                ${l.telefono ? `📱 ${l.telefono} &nbsp;&nbsp;` : ''}
                ${l.email ? `✉️ ${l.email}` : ''}
            </div>
        </div>`;
    }).join('');
}
function deleteLead(idx) {
    showConfirm('Archivar esta cotización?', () => {
        const leads = getLeads();
        leads.splice(idx, 1);
        localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
        renderLeads();
    });
}
function clearLeads() {
    showConfirm('Borrar TODAS las cotizaciones?', () => {
        localStorage.removeItem(LEADS_KEY);
        renderLeads();
    });
}

// ==================== AI PRICING ASSISTANT ==================
const PRICES = {
    melamina_blanca: 72000, melamina_gris: 80000, melamina_madera: 88000,
    mdf_lacado: 110000, bisagra_blum: 28000, corredera_blum: 65000,
    cuarzo: 320000, mano_obra: 150000
};

function getPricingAIResponse(text) {
    const t = text.toLowerCase();

    // Cocina calculation
    if ((t.includes('cocina') || t.includes('kitchen')) && (t.includes('metro') || /\d/.test(t))) {
        const match = t.match(/(\d+(?:\.\d+)?)/);
        const m = match ? parseFloat(match[1]) : 3;
        const mat = m * 1.5 * PRICES.melamina_blanca;
        const obra = m * PRICES.mano_obra;
        const herrajes = 12 * PRICES.bisagra_blum + 6 * PRICES.corredera_blum;
        const total = mat + obra + herrajes;
        const alto = Math.round(total * 1.35);
        return `Para una cocina de ${m}m, calculo aproximado:<br>
        • Material (melamina blanca): <b>$${mat.toLocaleString('es-CO')}</b><br>
        • Herrajes Blum: <b>$${herrajes.toLocaleString('es-CO')}</b><br>
        • Mano de obra: <b>$${obra.toLocaleString('es-CO')}</b><br>
        <b>Total aprox: $${total.toLocaleString('es-CO')}</b> sugerido venta: <b>$${alto.toLocaleString('es-CO')}</b>
        (margen 35%). Recuerda que el mesón en cuarzo va aparte (~$${(m * PRICES.cuarzo).toLocaleString('es-CO')}).`;
    }

    // Closet calculation
    if (t.includes('closet') || t.includes('vestidor') || t.includes('armario')) {
        const match = t.match(/(\d+(?:\.\d+)?)/);
        const m = match ? parseFloat(match[1]) : 2.5;
        const mat = m * 1.2 * PRICES.melamina_madera;
        const obra = m * PRICES.mano_obra * 0.9;
        const total = mat + obra;
        return `Closet de ${m}m (melamina madera):<br>
        • Material: <b>$${mat.toLocaleString('es-CO')}</b><br>
        • Mano de obra: <b>$${obra.toLocaleString('es-CO')}</b><br>
        <b>Total: $${total.toLocaleString('es-CO')}</b> (venta: $${Math.round(total * 1.35).toLocaleString('es-CO')}).<br>
        Si el cliente quiere puertas corredizas con vidrio templado, suma ~$85.000/m lineal.`;
    }

    // Prices
    if (t.includes('melamina blanca') || t.includes('blanca')) return 'Melamina blanca 18mm Arauco/Madecol: <b>$72.000 x m²</b>. En Madrecentro puedes negocia precio por volumen (desde 10 hojas).';
    if (t.includes('melamina gris') || t.includes('antracita')) return 'Melamina gris antracita 18mm: <b>$80.000 x m²</b>. Muy pedida en cocinas modernas. Alta rotación en Madrecentro.';
    if (t.includes('melamina madera') || t.includes('roble') || t.includes('nogal')) return 'Melaminas tipo madera (roble, nogal, wengue) 18mm: <b>$88.000 x m²</b>. Las más vendidas para closets y bibliotecas.';
    if (t.includes('mdf') || t.includes('lacado')) return 'MDF lacado blanco 15mm: <b>$110.000 x m²</b>. Se usa para puertas premium y frentes de cocina de alta gama. Requiere trabajo más cuidadoso.';
    if (t.includes('blum') || t.includes('bisagra')) return 'Bisagras Blum Clip Top Blumotion: <b>$28.000 c/u</b>. Correderas Blum Tandem 500mm: <b>$65.000 par</b>. Son las mejores del mercado, el cliente lo percibe.';
    if (t.includes('cuarzo') || t.includes('silestone') || t.includes('meson')) return 'Cuarzo Silestone blanco: <b>$320.000 x m²</b>. Para una isla de 1.2m² son ~$384.000. El posicionamiento vale: es resistente a calor, manchas y gérmenes.';
    if (t.includes('descuento') || t.includes('muy caro') || t.includes('rebaja') || t.includes('precio más bajo')) return 'Responde así: <i>"Entiendo que el presupuesto es importante para ti. Nuestra propuesta incluye materiales certificados de primera línea y herrajes Blum con garantía de por vida. Podemos ajustar el diseño para optimizar el costo sin bajar la calidad. ¿Hablámos de qué elementos son más importantes para ti?"</i>';
    if (t.includes('no ha respondido') || t.includes('no contest') || t.includes('seguimiento')) return 'Mensaje de seguimiento WhatsApp: <i>"Hola [Nombre]! Soy [tu nombre] de Made Util. Hace unos días cotizaste con nosotros. Quiero saber si tienes alguna duda o si ya tomaste una decisión. Estamos disponibles para una visita de medición GRATIS esta semana. 🙏"</i>';
    if (t.includes('primer contacto') || t.includes('cómo responder') || t.includes('que le digo') || t.includes('primera vez')) return 'Primer contacto perfecto: <i>"Hola [Nombre]! Gracias por contactar a Made Util 🙏\nVi que te interesa [tipo de mueble]. Somos especialistas en carpintería arquitectónica en Medellín.\nPara darte una cotización exacta, podemos hacer una visita técnica GRATIS. ¿Cuándo estarías disponible?"</i>';
    if (t.includes('madrecentro') || t.includes('proveedor') || t.includes('donde comprar')) return 'Madrecentro Medellín está en el sector de Naranjal y tienen sucursal en Envigado. Precios de tablero 18mm (~2.44x2.15m): blanco $170k, gris $188k, madera $206k. Compra por volumen para mejor precio. También Almacenes Decorceramica tiene buenos precios en herrajes.';
    return 'No tengo una respuesta específica para eso. Te recomiendo: 1) Calcular materiales (melamina + herrajes + mano de obra) y aplicar margen del 35-40%. 2) Siempre ofrecer visita técnica gratuita como primer paso. 3) Enviar cotización formal por WhatsApp o email en PDF. ¿Hay algo más específico?';
}

function sendPricingMsg() {
    const input = document.getElementById('pricingInput');
    const msg = input.value.trim();
    if (!msg) return;
    const chat = document.getElementById('pricingChat');
    chat.innerHTML += `<div class="ai-msg user">${msg}</div>`;
    input.value = '';
    chat.scrollTop = chat.scrollHeight;
    setTimeout(() => {
        chat.innerHTML += `<div class="ai-msg bot">${getPricingAIResponse(msg)}</div>`;
        chat.scrollTop = chat.scrollHeight;
    }, 500);
}

// ==================== REVIEWS / RESENAS ADMIN ==================
const REVIEWS_KEY = 'mu_reviews_admin';
const DEFAULT_REVIEWS_ADMIN = [
    { name: 'María C.', project: 'Cocina Integral — El Poblado', text: '"Quedamos encantados con el resultado. El acabado es impecable."', stars: 5, visible: true },
    { name: 'Andrés R.', project: 'Vestidor Walk-In — Sabaneta', text: '"El vestidor quedó espectacular. Muy buena comunicación."', stars: 5, visible: true },
    { name: 'Laura P.', project: 'Mobiliario de Estudio — Envigado', text: '"Excelente relación calidad-precio."', stars: 5, visible: true }
];
function getReviews() {
    const s = localStorage.getItem(REVIEWS_KEY);
    if (!s) { localStorage.setItem(REVIEWS_KEY, JSON.stringify(DEFAULT_REVIEWS_ADMIN)); return DEFAULT_REVIEWS_ADMIN; }
    return JSON.parse(s);
}
// Sistema de reseñas actualizado - usa reviews-admin.js
function updateResenaCount() {
    // Esta función ahora está en reviews-admin.js como updateReviewCounts()
    if (typeof updateReviewCounts === 'function') {
        updateReviewCounts();
    }
}
function renderResenas() {
    // Esta función ahora está en reviews-admin.js como renderAllReviews()
    if (typeof renderAllReviews === 'function') {
        renderAllReviews();
    }
}
function toggleReview(idx) {
    // Esta función está obsoleta - usa changeReviewState() de reviews-admin.js
    console.log('Función toggleReview obsoleta - usa el nuevo sistema de drag & drop');
}
function deleteReview(idx) {
    // Esta función está obsoleta - usa deleteReview() de reviews-admin.js
    console.log('Función deleteReview obsoleta - usa el nuevo sistema');
}

// Inicializar contadores
updateResenaCount();

// ==================== DOMContentLoaded BINDINGS ==================
// (elements created after need to wait for DOMContentLoaded)

// ==================== DOMContentLoaded BINDINGS ==================
// (elements created after need to wait for DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    const btnSaveFaq = document.getElementById('btnSaveFaq');
    if (btnSaveFaq) {
        btnSaveFaq.addEventListener('click', () => {
            const q = document.getElementById('faqQ').value.trim();
            const a = document.getElementById('faqA').value.trim();
            if (!q || !a) { alert('Escribe la pregunta y la respuesta.'); return; }
            const faqs = getFaqs();
            if (editingFaqIdx >= 0) faqs[editingFaqIdx] = { q, a };
            else faqs.push({ q, a });
            saveFaqs(faqs);
            document.getElementById('modalFaq').classList.remove('open');
            renderFaqList();
        });
    }
    // Re-bind close buttons for dynamically placed modals
    document.querySelectorAll('[data-close-modal]').forEach(btn =>
        btn.addEventListener('click', closeModals));
    document.querySelectorAll('.modal').forEach(modal =>
        modal.addEventListener('click', e => { if (e.target === modal) closeModals(); }));
});