/**
 * MADE UTIL — PORTFOLIO LOADER SYNC v2.0
 * Mejoras para sincronización automática del portafolio
 */

// Limpiar y reinicializar portafolio cuando detecta cambios
(function() {
    const originalGetCollections = window.getCollections;
    const originalGetProjects = window.getProjects;
    
    // Caché de datos
    let collCache = null;
    let projCache = null;
    
    // Funciones mejoradas con sincronización
    window.getCollections = function() {
        const fresh = JSON.parse(localStorage.getItem('mu_collections') || '[]');
        
        if (JSON.stringify(fresh) !== JSON.stringify(collCache)) {
            collCache = fresh;
            // Disparar evento cuando cambia
            window.dispatchEvent(new CustomEvent('collectionsChanged', { detail: fresh }));
        }
        
        return fresh;
    };
    
    window.getProjects = function() {
        const fresh = JSON.parse(localStorage.getItem('mu_projects') || '[]');
        
        if (JSON.stringify(fresh) !== JSON.stringify(projCache)) {
            projCache = fresh;
            // Disparar evento cuando cambia
            window.dispatchEvent(new CustomEvent('projectsChanged', { detail: fresh }));
        }
        
        return fresh;
    };
    
    // Escuchar cambios de otras pestañas
    window.addEventListener('storage', function(e) {
        if (e.key === 'mu_collections' || e.key === 'mu_projects') {
            // Recargar el portafolio
            if (typeof renderHomePortals === 'function') {
                renderHomePortals();
            }
        }
    });
    
    console.log('✅ Portfolio sync initialized');
})();
