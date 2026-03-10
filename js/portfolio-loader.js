/* ==============================================
   PORTFOLIO & COLLECTIONS LOADER 
   ============================================== */

(function () {
    'use strict';

    const PROJ_KEY = 'mu_projects';
    const COLL_KEY = 'mu_collections';

    // Seed Initial Data
    function seedInitialData() {
        if (!localStorage.getItem(COLL_KEY)) {
            const initialColls = [
                { id: 'cocinas', name: 'Cocinas', description: 'El corazón técnico del hogar.', cover: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2000&q=80', url: 'cocinas.html', createdAt: Date.now() },
                { id: 'armarios', name: 'Armarios', description: 'Sistemas modulares y diseño técnico.', cover: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=2000&q=80', url: 'armarios.html', createdAt: Date.now() + 1 },
                { id: 'mobiliario', name: 'Mobiliario', description: 'Piezas únicas y monolíticas.', cover: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=2000&q=80', url: 'mobiliario.html', createdAt: Date.now() + 2 }
            ];
            localStorage.setItem(COLL_KEY, JSON.stringify(initialColls));
        }

        if (!localStorage.getItem(PROJ_KEY)) {
            const initialProjects = [
                {
                    id: 1700000000001, name: "Residencia Roble", collection: "cocinas", type: "destacado", location: "Medellín, 2024",
                    description: "El corazón técnico del hogar. Fusionamos tableros de melamina de alta resistencia con herrajes europeos.",
                    specs: [{ label: "Madera", value: "Roble Europeo" }, { label: "Herrajes", value: "Blum" }],
                    media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2000&q=80' }], createdAt: new Date().toISOString()
                },
                {
                    id: 1700000000002, name: "Dark Matter", collection: "cocinas", type: "normal", location: "Medellín",
                    description: "Un bloque monolítico de roble ahumado diseñado para anclar el espacio social.",
                    specs: [{ label: "Material", value: "Roble Ahumado" }],
                    media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80' }], createdAt: new Date().toISOString()
                },
                {
                    id: 1700000000101, name: "Walk-In Master", collection: "armarios", type: "destacado", location: "Llanogrande",
                    description: "Diseñamos el escenario para tu colección personal.",
                    specs: [{ label: "Tipo", value: "Vestidor Modular" }],
                    media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=2000&q=80' }], createdAt: new Date().toISOString()
                },
                {
                    id: 1700000000201, name: "Mesa Monolito", collection: "mobiliario", type: "destacado", location: "Rionegro",
                    description: "Muebles únicos para tu espacio. Presencia escultórica.",
                    specs: [{ label: "Material", value: "Nogal Sólido" }],
                    media: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=2000&q=80' }], createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(PROJ_KEY, JSON.stringify(initialProjects));
        }
    }

    // Getters
    window.getCollections = () => JSON.parse(localStorage.getItem(COLL_KEY) || '[]');
    window.getProjects = () => JSON.parse(localStorage.getItem(PROJ_KEY) || '[]');
    window.getByCollection = (collId) => window.getProjects().filter(p => p.collection === collId);

    // Detect Current Page
    function detectContext() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('index.html') || path === '/' || path.endsWith('/final/') || path.endsWith('/final')) return { page: 'home' };
        if (path.includes('proyecto.html')) return { page: 'detail' };
        if (path.includes('coleccion.html')) return { page: 'generic_coll' };
        if (path.includes('cocinas')) return { page: 'coll', id: 'cocinas' };
        if (path.includes('armarios')) return { page: 'coll', id: 'armarios' };
        if (path.includes('mobiliario')) return { page: 'coll', id: 'mobiliario' };
        return { page: 'other' };
    }

    // Render Home Portals – ALL collections from localStorage (none hardcoded)
    function renderHomePortals() {
        const section = document.getElementById('proyectos');
        if (!section) return;

        const colls = window.getCollections();
        section.innerHTML = ''; // clear everything, re-render from localStorage

        if (!colls.length) return;

        colls.forEach((c, idx) => {
            const num = String(idx + 1).padStart(2, '0');
            const url = c.url || `coleccion.html?id=${c.id}`;
            const a = document.createElement('a');
            a.href = url;
            a.className = 'category-portal reveal';
            a.style.backgroundImage = `url('${c.cover}')`;
            a.innerHTML = `
                <div class="portal-content">
                    <div>
                        <span class="brand-tag">COLECCION ${num}</span>
                        <h2>${c.name}</h2>
                    </div>
                    <div class="portal-arrow">
                        <svg viewBox="0 0 24 24">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                </div>`;
            section.appendChild(a);
        });
        setupReveals(section);
    }

    // Render Collection Grid
    function renderCollectionGrid(collId) {
        const container = document.getElementById('dynamicProjects');
        if (!container) return;

        // If it's the generic page, we might need to update the title
        if (window.location.pathname.includes('coleccion.html')) {
            const coll = window.getCollections().find(c => c.id === collId);
            if (coll) {
                document.title = `${coll.name} | Made Util`;
                const headTitle = document.getElementById('genCollTitle');
                if (headTitle) headTitle.textContent = coll.name;
                const headDesc = document.getElementById('genCollDesc');
                if (headDesc) headDesc.textContent = coll.description || '';
            }
        }

        const projects = window.getByCollection(collId);
        if (projects.length === 0) {
            container.innerHTML = '<p style="text-align:center;width:100%;color:var(--muted);padding:4rem;">Aún no hay trabajos en esta colección.</p>';
            return;
        }

        const html = projects.map(p => {
            const thumb = p.media && p.media[0] ? p.media[0].data : '';
            if (p.type === 'destacado') {
                return `
                    <a href="proyecto.html?id=${p.id}" class="work-hero reveal">
                        ${p.media && p.media[0] && p.media[0].type.startsWith('video') ? `<video src="${thumb}" style="width:100%;height:100%;object-fit:cover;" autoplay muted loop playsinline></video>` : `<img src="${thumb}" alt="${p.name}">`}
                        <div class="work-info">
                            <h2>${p.name}</h2>
                            <span class="impact-badge">PRODUCTO ESTRELLA</span>
                        </div>
                    </a>
                `;
            } else {
                return `
                    <a href="proyecto.html?id=${p.id}" class="work-item reveal">
                        ${p.media && p.media[0] && p.media[0].type.startsWith('video') ? `<video src="${thumb}" style="width:100%;height:100%;object-fit:cover;" autoplay muted loop playsinline></video>` : `<img src="${thumb}" alt="${p.name}">`}
                        <div class="work-info">
                            <span>${p.name}</span>
                            <span>VER PROYECTO</span>
                        </div>
                    </a>
                `;
            }
        }).join('');

        container.innerHTML = html;
        setupReveals(container);
    }

    // Render Project Detail
    function renderProjectDetail() {
        const container = document.getElementById('projectDetailRoot');
        if (!container) return;

        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id'));
        if (!id) { window.location.href = 'index.html'; return; }

        const project = window.getProjects().find(p => p.id === id);
        if (!project) { window.location.href = 'index.html'; return; }

        document.title = `${project.name} | Made Util`;
        const coll = window.getCollections().find(c => c.id === project.collection);
        const collName = coll ? coll.name : project.collection;

        container.innerHTML = `
            <div class="project-carousel" id="projCarousel">
                ${project.media.map((m, i) =>
            m.type && m.type.startsWith('video')
                ? `<video src="${m.data}" ${i === 0 ? 'class="active"' : ''} controls muted playsinline></video>`
                : `<img src="${m.data}" alt="${project.name}" ${i === 0 ? 'class="active"' : ''}>`
        ).join('')}
                <div class="carousel-controls">
                    <button class="carousel-btn" onclick="projSlide(-1)">‹</button>
                    <button class="carousel-btn" onclick="projSlide(1)">›</button>
                </div>
                <div class="carousel-dots" id="projDots"></div>
                ${project.media.length > 1 ? `<div class="carousel-counter" id="projCounter">1 / ${project.media.length}</div>` : ''}
            </div>

            <div class="project-info">
                <div class="project-header">
                    <h1 class="project-name">${project.name}</h1>
                    <span class="project-tag">${collName}${project.type === 'destacado' ? ' — Destacado' : ''}</span>
                </div>
                <p class="project-description" style="font-size: 1.1rem; line-height: 1.8; color: var(--white); font-weight: 300; margin-bottom: 3rem; padding-bottom: 3rem; border-bottom: 1px solid var(--border);">
                    ${project.description || ''}
                </p>

                ${project.specs && project.specs.length > 0 ? `
                    <div style="margin-bottom:2rem; font-family:'Space Grotesk'; font-size: 0.8rem; letter-spacing:2px; color:var(--brand-brown); text-transform:uppercase;">
                        Especificaciones Técnicas
                    </div>
                    <div class="tech-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:2rem;">
                        ${project.specs.map(s => `
                            <div style="padding-bottom:1rem;border-bottom:1px solid rgba(232,218,206,0.1);">
                                <div style="font-size:0.75rem; color:var(--muted); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:0.5rem;">${s.label}</div>
                                <div style="font-size:1.05rem; color:var(--white);">${s.value}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            <div class="project-cta" style="margin-top:4rem;">
                <h3 style="font-weight:400;font-size:1.8rem;">¿Te interesa una propuesta?</h3>
                <p style="margin-bottom:2rem;">Cada proyecto es único y adaptado a ti.</p>
                <a href="solicitar-proyecto.html">SOLICITAR COTIZACIÓN</a>
            </div>
        `;

        if (window.initProjectCarousel) window.initProjectCarousel();
    }

    // Nav Updater - injects dynamic collections into footer and nav links
    function updateNavMenus() {
        const colls = window.getCollections();

        // Update footer nav if it contains hardcoded cocinas, etc
        document.querySelectorAll('.footer-nav').forEach(nav => {
            // we can swap the links inside. But it usually has Inicio, Cocinas, etc.
            // Let's just create generic links
            let linksHTML = `<a href="index.html" class="footer-link">Inicio</a>`;
            colls.forEach(c => {
                const url = c.url || `coleccion.html?id=${c.id}`;
                linksHTML += `<a href="${url}" class="footer-link">${c.name}</a>`;
            });
            nav.innerHTML = linksHTML;
        });
    }

    // Utils
    function setupReveals(container) {
        setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) e.target.classList.add('active');
                });
            }, { threshold: 0.1 });
            container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }, 100);
    }

    // Auto-Initialization
    document.addEventListener('DOMContentLoaded', () => {
        seedInitialData();
        updateNavMenus();

        const ctx = detectContext();
        if (ctx.page === 'home') renderHomePortals();
        if (ctx.page === 'coll') renderCollectionGrid(ctx.id);
        if (ctx.page === 'generic_coll') {
            const params = new URLSearchParams(window.location.search);
            renderCollectionGrid(params.get('id'));
        }
        if (ctx.page === 'detail') renderProjectDetail();
    });

})();
