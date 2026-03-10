/**
 * MADE UTIL — ADMIN SYNCHRONIZATION v1.0
 * Sincroniza cambios entre admin panel y sitio web en tiempo real
 */

// Storage Keys
const STORAGE_KEYS = {
    collections: 'mu_collections',
    projects: 'mu_projects',
    faqs: 'mu_faqs',
    reviews: 'mu_reviews_admin',
    leads: 'madeutil_leads'
};

// Sincronizar cambios cada 1 segundo
setInterval(() => {
    // Si los datos del admin cambian, recargar portafolio
    const colls = localStorage.getItem(STORAGE_KEYS.collections);
    const projs = localStorage.getItem(STORAGE_KEYS.projects);
    
    if (colls || projs) {
        // Datos listos para ser consumidos por portfolio-loader.js
        if (typeof window.getCollections === 'function') {
            // Forzar re-render del portafolio
            const event = new CustomEvent('storageUpdate', { detail: { type: 'portfolio' } });
            window.dispatchEvent(event);
        }
    }
    
    // Si las FAQs cambian, recargar FAQs
    const faqs = localStorage.getItem(STORAGE_KEYS.faqs);
    if (faqs) {
        const faqGrid = document.getElementById('faqGrid');
        if (faqGrid) {
            const faqList = JSON.parse(faqs);
            faqGrid.innerHTML = faqList.map(f => `
                <details class="faq-item">
                    <summary>${f.q}</summary>
                    <p>${f.a}</p>
                </details>`).join('');
        }
    }
    
    // Si las reseñas cambian, recargar carrusel
    const reviews = localStorage.getItem(STORAGE_KEYS.reviews);
    if (reviews && typeof initCommentCarousel === 'function') {
        initCommentCarousel();
    }
}, 1000);

// Escuchar cambios de storage desde otras pestañas
window.addEventListener('storage', (event) => {
    if (!event.key) return;
    
    if (event.key === STORAGE_KEYS.collections || event.key === STORAGE_KEYS.projects) {
        // Portafolio cambió
        window.dispatchEvent(new CustomEvent('storageUpdate', { detail: { type: 'portfolio' } }));
    } else if (event.key === STORAGE_KEYS.faqs) {
        // FAQs cambiaron - recargar si existe el elemento
        const faqGrid = document.getElementById('faqGrid');
        if (faqGrid && event.newValue) {
            const faqList = JSON.parse(event.newValue);
            faqGrid.innerHTML = faqList.map(f => `
                <details class="faq-item">
                    <summary>${f.q}</summary>
                    <p>${f.a}</p>
                </details>`).join('');
        }
    } else if (event.key === STORAGE_KEYS.reviews) {
        // Reseñas cambiaron - reinicializar carrusel
        if (typeof initCommentCarousel === 'function') {
            initCommentCarousel();
        }
    }
});

console.log('✅ Admin Sync loaded - cambios se sincronizarán automáticamente');
