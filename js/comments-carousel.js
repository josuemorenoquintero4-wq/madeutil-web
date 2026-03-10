/* ==============================================
   MADE UTIL — CARRUSEL DE COMENTARIOS v6.0
   Auto-scroll + Avatares Google + Admin control
   ============================================== */

const COMMENTS_CONFIG = {
    maxVisible: 30, // Aumentado de 20 a 30
    autoScrollInterval: 5000, // ms
    key: 'mu_reviews_admin' // Sincronizado con admin panel
};

// Obtener avatar de Google
function getGoogleAvatar(name) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F'];
    const colorIndex = name.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=60&bold=true&font-size=0.4`;
}

// Inicializar carrusel
function initCommentCarousel() {
    const carousel = document.getElementById('commentsCarousel');
    if (!carousel) return;
    
    let currentIndex = 0;
    const visibleSlides = 3; // 3 comentarios a la vez
    
    function getVisibleComments() {
        const all = getComments();
        return all.filter(c => c.state === 'visible').slice(0, COMMENTS_CONFIG.maxVisible);
    }
    
    function renderCarousel() {
        const comments = getVisibleComments();
        if (comments.length === 0) {
            carousel.innerHTML = '<div style="text-align:center;padding:4rem;color:#9A9490;">Sin comentarios aún</div>';
            return;
        }
        
        const slides = [];
        for (let i = 0; i < comments.length; i += visibleSlides) {
            slides.push(comments.slice(i, i + visibleSlides));
        }
        
        if (slides.length === 0) return;
        
        // Mantener índice válido
        if (currentIndex >= slides.length) currentIndex = 0;
        
        const currentSlide = slides[currentIndex];
        
        carousel.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(${Math.min(visibleSlides, currentSlide.length)}, 1fr);gap:1.5rem;padding:2rem;">
                ${currentSlide.map(c => `
                    <div style="background:var(--bg-card);border:1px solid rgba(232,218,206,0.1);border-radius:16px;padding:2rem;text-align:center;">
                        <img src="${getGoogleAvatar(c.name)}" 
                             alt="${c.name}" 
                             style="width:60px;height:60px;border-radius:50%;margin:0 auto 1rem;display:block;border:2px solid var(--brand-brown);">
                        <div style="color:#C0763E;font-size:1.2rem;margin-bottom:0.5rem;">${'★'.repeat(c.stars)}${'☆'.repeat(5-c.stars)}</div>
                        <p style="color:#F5F2ED;margin-bottom:1rem;line-height:1.6;">"${c.text}"</p>
                        <div style="font-family:var(--font-h);font-size:0.9rem;color:#F5F2ED;margin-bottom:0.3rem;">${c.name}</div>
                        <div style="font-size:0.75rem;color:#9A9490;">${c.project || ''}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Auto-scroll
        currentIndex = (currentIndex + 1) % slides.length;
    }
    
    renderCarousel();
    setInterval(renderCarousel, COMMENTS_CONFIG.autoScrollInterval);
}

// Obtener comentarios
function getComments() {
    const stored = localStorage.getItem(COMMENTS_CONFIG.key);
    if (!stored) {
        const defaults = [
            { id: 1, name: 'María García', project: 'Cocina Integral El Poblado', text: 'Quedamos encantados con el resultado. La cocina superó nuestras expectativas. El equipo fue puntual y el acabado es impecable.', stars: 5, state: 'visible', date: new Date().toISOString() },
            { id: 2, name: 'Andrés Rodríguez', project: 'Vestidor Walk-In Sabaneta', text: 'El vestidor quedó espectacular. Maximizaron cada centímetro del espacio. Muy buena comunicación durante todo el proceso.', stars: 5, state: 'visible', date: new Date().toISOString() },
            { id: 3, name: 'Laura Pérez', project: 'Mobiliario Estudio Envigado', text: 'Los muebles del estudio y la biblioteca a medida quedaron perfectos. Excelente relación calidad-precio.', stars: 5, state: 'visible', date: new Date().toISOString() }
        ];
        localStorage.setItem(COMMENTS_CONFIG.key, JSON.stringify(defaults));
        return defaults;
    }
    return JSON.parse(stored);
}

function saveComments(comments) {
    localStorage.setItem(COMMENTS_CONFIG.key, JSON.stringify(comments));
}

// Para usar en formulario
function submitComment(event) {
    if (event) {
        event.preventDefault();
    }
    
    const name = document.getElementById('commentName')?.value.trim();
    const project = document.getElementById('commentProject')?.value.trim();
    const text = document.getElementById('commentText')?.value.trim();
    
    // Usar window.getSelectedStars si está disponible, sino intentar desde commentStars, por defecto 5
    const stars = typeof window.getSelectedStars === 'function' 
        ? window.getSelectedStars() 
        : parseInt(document.getElementById('commentStars')?.value || 5);
    
    if (!name || !text) {
        alert('Por favor completa nombre y comentario');
        return;
    }
    
    const comments = getComments();
    const newComment = {
        id: Math.max(...comments.map(c => c.id), 0) + 1,
        name,
        project,
        text,
        stars,
        state: 'new', // Nuevo: marca como "new" para revisión
        date: new Date().toISOString()
    };
    
    comments.unshift(newComment);
    
    // Mantener máximo 30 visibles
    if (comments.length > COMMENTS_CONFIG.maxVisible) {
        comments.splice(COMMENTS_CONFIG.maxVisible);
    }
    
    saveComments(comments);
    
    // Limpiar formulario y cerrar modal
    if(document.getElementById('commentName')) document.getElementById('commentName').value = '';
    if(document.getElementById('commentProject')) document.getElementById('commentProject').value = '';
    if(document.getElementById('commentText')) document.getElementById('commentText').value = '';
    if(document.getElementById('commentStars')) document.getElementById('commentStars').value = '5';
    
    // Reset stars styling loop to default color
    if (typeof window.getSelectedStars === 'function') {
        const starSpans = document.querySelectorAll('#commentStarPicker span');
        starSpans.forEach(s => s.style.color = '#C0763E'); // all back to orange
        // Need to communicate the reset to index.html logic but since it relies on window state,
        // it's easier to just reload the page or hide the modal.
    }
    
    // Cerrar modal si existe
    const modal = document.getElementById('addCommentModal') || document.getElementById('commentModal');
    if (modal) modal.style.display = 'none';
    
    alert('¡Gracias por tu reseña! Será revisada para mostrarse públicamente.');
    
    // Refresco de página si es apropiado
    if (typeof initCommentCarousel === 'function') {
        initCommentCarousel();
    }
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    initCommentCarousel();
});
