/* ==============================================
   MADE UTIL — SISTEMA DE RESEÑAS ADMIN v8.0 BRUTAL
   Carrusel + Drag & Drop + Estados Avanzados
   ============================================== */

const REVIEWS_KEY = 'mu_reviews_admin';

// Estados de reseñas
const REVIEW_STATES = {
    NEW: 'new',           // Recién subida, necesita revisión
    VISIBLE: 'visible',   // Mostrando en carrusel
    HIDDEN: 'hidden',     // Oculta temporalmente
    ARCHIVED: 'archived'  // Archivada permanentemente
};

// Obtener todas las reseñas
function getAllReviews() {
    const stored = localStorage.getItem(REVIEWS_KEY);
    if (!stored) {
        const defaults = [
            { id: 1, name: 'María C.', project: 'Cocina Integral — El Poblado', text: 'Quedamos encantados con el resultado. La cocina superó nuestras expectativas. El acabado es impecable.', stars: 5, state: REVIEW_STATES.VISIBLE, date: new Date().toISOString() },
            { id: 2, name: 'Andrés R.', project: 'Vestidor Walk-In — Sabaneta', text: 'El vestidor quedó espectacular. Maximizaron cada centímetro. Muy buena comunicación.', stars: 5, state: REVIEW_STATES.VISIBLE, date: new Date().toISOString() },
            { id: 3, name: 'Laura P.', project: 'Mobiliario de Estudio — Envigado', text: 'Excelente relación calidad-precio. Los muebles quedaron perfectos.', stars: 5, state: REVIEW_STATES.VISIBLE, date: new Date().toISOString() }
        ];
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(defaults));
        return defaults;
    }
    return JSON.parse(stored);
}

function getPublicReviews() {
    return getAllReviews().filter(r => r.state === REVIEW_STATES.VISIBLE);
}

function saveReviews(reviews) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    updateReviewCounts();
}

// Actualizar contadores
function updateReviewCounts() {
    const reviews = getAllReviews();
    const newCount = reviews.filter(r => r.state === REVIEW_STATES.NEW).length;
    const visibleCount = reviews.filter(r => r.state === REVIEW_STATES.VISIBLE).length;
    const archivedCount = reviews.filter(r => r.state === REVIEW_STATES.ARCHIVED).length;

    const newEl = document.getElementById('resenaCount');
    if (newEl) newEl.textContent = newCount > 0 ? newCount : '';

    const visibleEl = document.getElementById('visibleCount');
    if (visibleEl) visibleEl.textContent = visibleCount;

    const archivedEl = document.getElementById('archivedCount');
    if (archivedEl) archivedEl.textContent = archivedCount;
}

// Renderizar carrusel de reseñas visibles
function renderVisibleCarousel() {
    const visibleReviews = getAllReviews().filter(r => r.state === REVIEW_STATES.VISIBLE);
    const container = document.getElementById('visibleCarousel');

    if (!container) return;

    if (visibleReviews.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:3rem;color:#9A9490;font-style:italic;">No hay reseñas visibles</div>';
        return;
    }

    // Carrusel con 3 reseñas por slide
    const slides = [];
    for (let i = 0; i < visibleReviews.length; i += 3) {
        slides.push(visibleReviews.slice(i, i + 3));
    }

    container.innerHTML = `
        <div class="carousel-wrapper" style="position:relative;overflow:hidden;border-radius:16px;">
            <div class="carousel-slides" id="carouselSlides" style="display:flex;transition:transform 0.5s cubic-bezier(.34,1.56,.64,1);">
                ${slides.map((slide, slideIndex) => `
                    <div class="carousel-slide" data-slide="${slideIndex}" style="min-width:100%;display:grid;grid-template-columns:repeat(${slide.length},1fr);gap:1.5rem;padding:2rem;">
                        ${slide.map(review => `
                            <div class="review-card" data-review-id="${review.id}" draggable="true" style="background:var(--bg-card);border:1px solid rgba(232,218,206,0.1);border-radius:12px;padding:1.5rem;text-align:center;cursor:move;">
                                <div style="color:#C0763E;font-size:1.2rem;margin-bottom:0.5rem;">${'★'.repeat(review.stars)}${'☆'.repeat(5-review.stars)}</div>
                                <p style="color:#F5F2ED;margin-bottom:1rem;line-height:1.6;font-size:0.9rem;">"${review.text}"</p>
                                <div style="font-family:var(--font-h);font-size:0.9rem;color:#F5F2ED;margin-bottom:0.3rem;">${review.name}</div>
                                <div style="font-size:0.75rem;color:#9A9490;">${review.project || ''}</div>
                                <div style="margin-top:1rem;display:flex;gap:0.5rem;justify-content:center;">
                                    <button onclick="editReview(${review.id})" style="background:rgba(241,196,15,0.1);border:1px solid rgba(241,196,15,0.2);color:#f1c40f;padding:0.4rem 0.8rem;border-radius:6px;font-size:0.7rem;cursor:pointer;">Editar</button>
                                    <button onclick="changeReviewState(${review.id}, '${REVIEW_STATES.HIDDEN}')" style="background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.2);color:#e74c3c;padding:0.4rem 0.8rem;border-radius:6px;font-size:0.7rem;cursor:pointer;">Ocultar</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>

            ${slides.length > 1 ? `
                <button class="carousel-nav carousel-prev" onclick="moveCarousel(-1)" style="position:absolute;left:1rem;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.7);border:none;color:white;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:1.2rem;">‹</button>
                <button class="carousel-nav carousel-next" onclick="moveCarousel(1)" style="position:absolute;right:1rem;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.7);border:none;color:white;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:1.2rem;">›</button>
            ` : ''}

            <div class="carousel-dots" style="text-align:center;padding:1rem;">
                ${slides.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#9A9490;margin:0 4px;cursor:pointer;"></span>`).join('')}
            </div>
        </div>
    `;

    // Inicializar drag & drop
    initDragAndDrop();
}

// Variables para carrusel
let currentSlide = 0;

// Funciones del carrusel
function moveCarousel(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;

    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

function updateCarousel() {
    const slidesContainer = document.getElementById('carouselSlides');
    if (slidesContainer) {
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Actualizar dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Renderizar lista de reseñas por estado
function renderReviewsByState(state, containerId) {
    const reviews = getAllReviews().filter(r => r.state === state);
    const container = document.getElementById(containerId);

    if (!container) return;

    if (reviews.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:2rem;color:#9A9490;font-style:italic;">Sin reseñas en esta categoría</div>';
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="review-item" data-review-id="${review.id}" draggable="true" style="background:var(--bg-card);border:1px solid ${getStateColor(state)};border-radius:12px;padding:1.5rem;margin-bottom:1rem;display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:start;cursor:move;">
            <div>
                <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;">
                    <span style="color:#C0763E;font-size:1rem;">${'★'.repeat(review.stars)}${'☆'.repeat(5-review.stars)}</span>
                    <span style="font-size:0.65rem;padding:0.2rem 0.6rem;border-radius:10px;${getStateStyle(state)};letter-spacing:1px;text-transform:uppercase;font-weight:600;">${getStateLabel(state)}</span>
                </div>
                <div style="font-family:var(--font-h);font-size:1rem;color:#F5F2ED;margin-bottom:0.3rem;">${review.name}</div>
                <div style="font-size:0.8rem;color:#9A9490;margin-bottom:0.8rem;">➜ ${review.project}</div>
                <div style="font-size:0.9rem;color:#F5F2ED;line-height:1.6;margin-bottom:0.8rem;">"${review.text}"</div>
                <div style="font-size:0.7rem;color:#9A9490;">${new Date(review.date).toLocaleDateString('es-CO')}</div>
            </div>

            <div style="display:flex;flex-direction:column;gap:0.5rem;min-width:140px;">
                ${getActionButtons(state, review.id)}
            </div>
        </div>
    `).join('');

    // Inicializar drag & drop
    initDragAndDrop();
}

// Funciones auxiliares para estados
function getStateColor(state) {
    switch(state) {
        case REVIEW_STATES.NEW: return 'rgba(52,152,219,0.25)';
        case REVIEW_STATES.VISIBLE: return 'rgba(46,204,113,0.25)';
        case REVIEW_STATES.HIDDEN: return 'rgba(149,165,166,0.25)';
        case REVIEW_STATES.ARCHIVED: return 'rgba(231,76,60,0.25)';
        default: return 'rgba(232,218,206,0.1)';
    }
}

function getStateStyle(state) {
    switch(state) {
        case REVIEW_STATES.NEW: return 'background:rgba(52,152,219,0.15);color:#3498db;';
        case REVIEW_STATES.VISIBLE: return 'background:rgba(46,204,113,0.15);color:#2ecc71;';
        case REVIEW_STATES.HIDDEN: return 'background:rgba(149,165,166,0.15);color:#95a5a6;';
        case REVIEW_STATES.ARCHIVED: return 'background:rgba(231,76,60,0.15);color:#e74c3c;';
        default: return 'background:rgba(232,218,206,0.1);color:#9A9490;';
    }
}

function getStateLabel(state) {
    switch(state) {
        case REVIEW_STATES.NEW: return '🆕 Nuevo';
        case REVIEW_STATES.VISIBLE: return '✓ Visible';
        case REVIEW_STATES.HIDDEN: return '👁️ Oculto';
        case REVIEW_STATES.ARCHIVED: return '📁 Archivado';
        default: return 'Desconocido';
    }
}

function getActionButtons(state, reviewId) {
    const buttons = [];

    if (state === REVIEW_STATES.NEW) {
        buttons.push(`<button onclick="changeReviewState(${reviewId}, '${REVIEW_STATES.VISIBLE}')" style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.3);color:#2ecc71;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">✓ Aprobar</button>`);
        buttons.push(`<button onclick="changeReviewState(${reviewId}, '${REVIEW_STATES.ARCHIVED}')" style="background:rgba(231,76,60,0.15);border:1px solid rgba(231,76,60,0.3);color:#e74c3c;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">📁 Archivar</button>`);
    } else if (state === REVIEW_STATES.VISIBLE) {
        buttons.push(`<button onclick="changeReviewState(${reviewId}, '${REVIEW_STATES.HIDDEN}')" style="background:rgba(149,165,166,0.15);border:1px solid rgba(149,165,166,0.3);color:#95a5a6;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">👁️ Ocultar</button>`);
        buttons.push(`<button onclick="changeReviewState(${reviewId}, '${REVIEW_STATES.ARCHIVED}')" style="background:rgba(231,76,60,0.15);border:1px solid rgba(231,76,60,0.3);color:#e74c3c;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">📁 Archivar</button>`);
    } else if (state === REVIEW_STATES.HIDDEN) {
        buttons.push(`<button onclick="changeReviewState(${reviewId}, '${REVIEW_STATES.VISIBLE}')" style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.3);color:#2ecc71;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">✓ Mostrar</button>`);
        buttons.push(`<button onclick="changeReviewState(${reviewId}, '${REVIEW_STATES.ARCHIVED}')" style="background:rgba(231,76,60,0.15);border:1px solid rgba(231,76,60,0.3);color:#e74c3c;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">📁 Archivar</button>`);
    } else if (state === REVIEW_STATES.ARCHIVED) {
        buttons.push(`<button onclick="changeReviewState(${reviewId}, '${REVIEW_STATES.VISIBLE}')" style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.3);color:#2ecc71;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">✓ Restaurar</button>`);
        buttons.push(`<button onclick="deleteReview(${reviewId})" style="background:rgba(231,76,60,0.15);border:1px solid rgba(231,76,60,0.3);color:#e74c3c;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">🗑️ Borrar</button>`);
    }

    buttons.push(`<button onclick="editReview(${reviewId})" style="background:rgba(241,196,15,0.15);border:1px solid rgba(241,196,15,0.3);color:#f1c40f;padding:0.6rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;letter-spacing:1px;text-transform:uppercase;">✏️ Editar</button>`);

    return buttons.join('');
}

// Cambiar estado de reseña
function changeReviewState(reviewId, newState) {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === reviewId);

    if (review) {
        review.state = newState;
        saveReviews(reviews);
        renderAllReviews();
    }
}

// Renderizar todo el admin de reseñas
function renderAllReviews() {
    renderVisibleCarousel();
    renderReviewsByState(REVIEW_STATES.NEW, 'newReviewsList');
    renderReviewsByState(REVIEW_STATES.HIDDEN, 'hiddenReviewsList');
    renderReviewsByState(REVIEW_STATES.ARCHIVED, 'archivedReviewsList');
    updateReviewCounts();
}

// Drag & Drop
function initDragAndDrop() {
    const reviewItems = document.querySelectorAll('.review-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    reviewItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.reviewId);
    e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = 'rgba(192,118,62,0.1)';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '';

    const reviewId = parseInt(e.dataTransfer.getData('text/plain'));
    const newState = e.currentTarget.dataset.dropState;

    if (reviewId && newState) {
        changeReviewState(reviewId, newState);
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    renderAllReviews();
});

// Modal para editar reseña
function editReview(reviewId) {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);';
    
    modal.innerHTML = `
        <div style="background:#161412;border:1px solid rgba(232,218,206,0.15);border-radius:16px;padding:2.5rem;max-width:500px;width:90%;">
            <h2 style="font-family:var(--font-h);font-size:1.4rem;margin-bottom:2rem;">Editar Reseña</h2>
            
            <label style="display:block;font-size:0.75rem;letter-spacing:1px;color:#9A9490;text-transform:uppercase;margin-bottom:0.5rem;">Nombre</label>
            <input type="text" id="editName" value="${review.name}" style="width:100%;background:#0f0e0c;border:1px solid rgba(232,218,206,0.1);color:#F5F2ED;padding:0.85rem;border-radius:8px;font-size:0.9rem;outline:none;margin-bottom:1.5rem;font-family:inherit;">
            
            <label style="display:block;font-size:0.75rem;letter-spacing:1px;color:#9A9490;text-transform:uppercase;margin-bottom:0.5rem;">Proyecto</label>
            <input type="text" id="editProject" value="${review.project}" style="width:100%;background:#0f0e0c;border:1px solid rgba(232,218,206,0.1);color:#F5F2ED;padding:0.85rem;border-radius:8px;font-size:0.9rem;outline:none;margin-bottom:1.5rem;font-family:inherit;">
            
            <label style="display:block;font-size:0.75rem;letter-spacing:1px;color:#9A9490;text-transform:uppercase;margin-bottom:0.5rem;">Calificación</label>
            <div style="display:flex;gap:0.5rem;margin-bottom:1.5rem;">
                ${[1,2,3,4,5].map(s => `
                    <button onclick="document.querySelectorAll('[data-star]').forEach((b, i) => b.style.color = i < ${s} ? '#C0763E' : '#333'); document.getElementById('editStars').value = ${s};" data-star="${s}" style="background:none;border:none;font-size:1.8rem;color:${s <= review.stars ? '#C0763E' : '#333'};cursor:pointer;">★</button>
                `).join('')}
            </div>
            <input type="hidden" id="editStars" value="${review.stars}">
            
            <label style="display:block;font-size:0.75rem;letter-spacing:1px;color:#9A9490;text-transform:uppercase;margin-bottom:0.5rem;">Comentario</label>
            <textarea id="editText" style="width:100%;background:#0f0e0c;border:1px solid rgba(232,218,206,0.1);color:#F5F2ED;padding:0.85rem;border-radius:8px;font-size:0.9rem;outline:none;resize:vertical;min-height:100px;font-family:inherit;margin-bottom:1.5rem;">${review.text}</textarea>
            
            <div style="display:flex;gap:1rem;">
                <button onclick="saveEditReview(${review.id})" style="flex:1;background:#C0763E;border:none;color:white;padding:1rem;border-radius:8px;font-weight:700;font-size:0.85rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;">
                    Guardar
                </button>
                <button onclick="document.querySelector('[style*=\\'position:fixed\\']').remove()" style="flex:1;background:transparent;border:1px solid rgba(232,218,206,0.15);color:#9A9490;padding:1rem;border-radius:8px;font-weight:700;font-size:0.85rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;">
                    Cancelar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function saveEditReview(reviewId) {
    const reviews = getAllReviews();
    const idx = reviews.findIndex(r => r.id === reviewId);
    
    if (idx >= 0) {
        reviews[idx] = {
            ...reviews[idx],
            name: document.getElementById('editName').value,
            project: document.getElementById('editProject').value,
            text: document.getElementById('editText').value,
            stars: parseInt(document.getElementById('editStars').value)
        };
        saveReviews(reviews);
        document.querySelector('[style*="position:fixed"]').remove();
        renderReviewsAdmin();
    }
}

function toggleReviewVisibility(reviewId) {
    const reviews = getAllReviews();
    const idx = reviews.findIndex(r => r.id === reviewId);
    
    if (idx >= 0) {
        reviews[idx].visible = reviews[idx].visible === false ? true : false;
        saveReviews(reviews);
        renderReviewsAdmin();
    }
}

function deleteReview(reviewId) {
    if (typeof showConfirm === 'function') {
        showConfirm('¿Borrar esta reseña?', () => {
            const reviews = getAllReviews().filter(r => r.id !== reviewId);
            saveReviews(reviews);
            renderReviewsAdmin();
        });
    } else {
        const reviews = getAllReviews().filter(r => r.id !== reviewId);
        saveReviews(reviews);
        renderReviewsAdmin();
    }
}

// Renderizar público
function renderPublicReviews() {
    const reviews = getPublicReviews();
    const container = document.getElementById('testimonialsGrid');
    
    if (!container) return;
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:3rem;">Sin comentarios aún</p>';
        return;
    }
    
    container.innerHTML = reviews.map(r => `
        <div class="testimonial-card">
            <div class="testimonial-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
            <p class="testimonial-text">"${r.text}"</p>
            <div class="testimonial-author">
                <div class="testimonial-avatar">${r.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</div>
                <div><strong>${r.name}</strong><span>${r.project}</span></div>
            </div>
        </div>
    `).join('');
}

// Inicializar públicas al cargar
document.addEventListener('DOMContentLoaded', () => {
    renderPublicReviews();
});
// ==================== FUNCIÓN PRINCIPAL DEL ADMIN ====================
// Función principal que inicializa todo el sistema de reseñas del admin
function renderReviewsAdmin() {
    console.log('Inicializando sistema de reseñas del admin...');
    
    // Renderizar todas las secciones
    renderAllReviews();
    
    // Inicializar drag & drop
    initDragAndDrop();
    
    // Actualizar contadores
    updateReviewCounts();
    
    console.log('Sistema de reseñas del admin inicializado correctamente');
}

// Hacer la función global para que sea accesible desde admin-panel.html
window.renderReviewsAdmin = renderReviewsAdmin;