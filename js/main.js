/* ==============================================
   MADE UTIL — AWWWARDS-LEVEL JS v8.0
   Lenis Smooth Scroll + Text Split + Custom Cursor
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       0. PAGE LOADER — Cinematic entrance
       ============================================== */
    /* ==============================================
       0. PAGE LOADER — DISABLED
       ============================================== */
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.display = 'none'; // Force hide immediately
    }

    /* ==============================================
       1. CUSTOM CURSOR — Awwwards style
       ============================================== */
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        const cursorText = document.createElement('div');
        cursorText.className = 'cursor-text';
        document.body.appendChild(cursor);
        document.body.appendChild(cursorText);

        let cx = 0, cy = 0;
        let tx = 0, ty = 0;

        document.addEventListener('mousemove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
        });

        function animateCursor() {
            // Increased sensitivity from 0.15 to 0.35 for snappier feel
            cx += (tx - cx) * 0.35;
            cy += (ty - cy) * 0.35;

            cursor.style.left = cx + 'px';
            cursor.style.top = cy + 'px';

            // Text follows slightly lagging but responsive
            cursorText.style.left = cx + 'px';
            cursorText.style.top = cy + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Interactive targets
        const addCursorEffect = (selector, className, text = '') => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add(className);
                    if (text) {
                        cursorText.textContent = text;
                        cursorText.style.opacity = '1';
                    }
                });
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove(className);
                    cursorText.style.opacity = '0';
                    cursorText.textContent = '';
                });
            });
        };

        addCursorEffect('a, button, input, textarea', 'hover');
        addCursorEffect('.category-portal', 'hover-text', 'VER');
        addCursorEffect('.work-item, .work-hero', 'hover-text', 'VER');
        addCursorEffect('.cs-carousel img', 'hover-text', 'ZOOM');
    }

    /* ==============================================
       2. NAV — Scroll effect + Mobile toggle
       ============================================== */
    const nav = document.querySelector('nav');

    // Mobile toggle
    let toggle = document.querySelector('.nav-toggle');
    if (!toggle && nav) {
        toggle = document.createElement('button');
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-label', 'Menu');
        toggle.innerHTML = '<span></span><span></span><span></span>';
        nav.appendChild(toggle);
    }

    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('open');
            document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
        });
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // Scroll nav
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        if (nav) {
            nav.classList.toggle('scrolled', sy > 100);
        }
        lastScrollY = sy;
    }, { passive: true });

    /* ==============================================
       3. HERO CAROUSEL — Enhanced
       ============================================== */
    const slides = document.querySelectorAll('.carousel-item');
    const progressBar = document.querySelector('.progress-fill');
    const heroControls = document.querySelector('.hero-nav-controls');
    const slideCounter = document.querySelector('.slide-counter');
    let currentSlide = 0;
    const SLIDE_DURATION = 6500;
    let slideInterval;

    if (slides.length > 0 && heroControls) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            heroControls.appendChild(dot);
        });
    }

    function updateCounter() {
        if (slideCounter) {
            slideCounter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
        }
    }

    function goToSlide(index) {
        if (index === currentSlide || slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        updateDots();
        updateCounter();
        resetProgress();
        restartAutoPlay();
    }

    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        updateDots();
        updateCounter();
        resetProgress();
    }

    function updateDots() {
        document.querySelectorAll('.hero-dot').forEach((d, i) =>
            d.classList.toggle('active', i === currentSlide)
        );
    }

    function resetProgress() {
        if (!progressBar) return;
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
                progressBar.style.width = '100%';
            });
        });
    }

    function restartAutoPlay() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    if (slides.length > 0) {
        slideInterval = setInterval(nextSlide, SLIDE_DURATION);
        resetProgress();
        updateCounter();
    }

    /* ==============================================
       4. TEXT SPLITTING — Word-by-word reveal
       ============================================== */
    document.querySelectorAll('.split-text').forEach(el => {
        const text = el.textContent.trim();
        const words = text.split(/\s+/);
        el.innerHTML = words.map(word =>
            `<span class="word"><span class="word-inner">${word}</span></span>`
        ).join(' ');
    });

    /* ==============================================
       5. SCROLL REVEAL — Intersection Observer
       ============================================== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Toggle active class for enter/exit blur effect
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Remove active when out of view to trigger blur-out
                // Check if element is below or above viewport
                // We want it to blur when scrolling past it (up or down)
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.1, // Trigger slightly earlier
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger, .split-text').forEach(el => {
        revealObserver.observe(el);
    });

    /* ==============================================
       6. PARALLAX — Subtle Ken Burns on hero
       ============================================== */
    const parallaxEls = document.querySelectorAll('.slide-img');
    let pTicking = false;

    function updateParallax() {
        const sy = window.scrollY;
        const vh = window.innerHeight;
        if (sy < vh * 1.2) {
            parallaxEls.forEach(el => {
                el.style.transform = `scale(1.1) translateY(${sy * 0.25}px)`;
            });
        }
        pTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!pTicking) { requestAnimationFrame(updateParallax); pTicking = true; }
    }, { passive: true });

    /* ==============================================
       7. POPUP SYSTEM
       ============================================== */
    window.openPopup = () => {
        const popup = document.querySelector('.popup-overlay');
        if (popup) {
            popup.classList.add('open');
            document.body.style.overflow = 'hidden';
        } else {
            // Fallback: redirect to full solicitud form if no popup exists
            window.location.href = 'solicitar-proyecto.html';
        }
    };

    window.closePopup = () => {
        const popup = document.querySelector('.popup-overlay');
        if (popup) {
            popup.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    document.querySelector('.popup-overlay')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) window.closePopup();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closePopup();
    });

    /* ==============================================
       8. MARQUEE DUPLICATION
       ============================================== */
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const clone = marqueeContent.innerHTML;
        marqueeContent.innerHTML += clone + clone;
    }

    /* ==============================================
       9. IMAGE LAZY LOADING
       ============================================== */
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                imageObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('loading', 'lazy');
        imageObserver.observe(img);
    });

    /* ==============================================
       10. SMOOTH SCROLL TO ANCHORS
       ============================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ==============================================
       11. MAGNETIC BUTTONS (Desktop)
       ============================================== */
    if (window.innerWidth > 768) {
        document.querySelectorAll('.impact-btn, .nav-cta, .portal-arrow').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ==============================================
       12. COUNTER ANIMATION
       ============================================== */
    const counters = document.querySelectorAll('.stat-item h3, .cs-stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const match = text.match(/(\d+)/);
                if (match) {
                    const target = parseInt(match[0]);
                    const prefix = text.substring(0, text.indexOf(match[0]));
                    const suffix = text.substring(text.indexOf(match[0]) + match[0].length);
                    let current = 0;
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) { current = target; clearInterval(timer); }
                        el.textContent = prefix + Math.ceil(current) + suffix;
                    }, 20);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    /* ==============================================
       13. TILT EFFECT ON PORTALS (Desktop)
       ============================================== */
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.category-portal').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.7s var(--ease-out)';
                setTimeout(() => card.style.transition = '', 700);
            });
        });
    }

    /* ==============================================
       14. STICKY CTA BAR (Landing pages)
       ============================================== */
    const stickyCta = document.getElementById('stickyCta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            stickyCta.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });
    }

    /* ==============================================
       15. KEYBOARD NAV FOR CAROUSEL
       ============================================== */
    document.addEventListener('keydown', (e) => {
        if (slides.length === 0) return;
        if (e.key === 'ArrowRight') goToSlide((currentSlide + 1) % slides.length);
        else if (e.key === 'ArrowLeft') goToSlide((currentSlide - 1 + slides.length) % slides.length);
    });

    /* ==============================================
       16. SCROLL VELOCITY EFFECTS
       ============================================== */
    let scrollVelocity = 0;
    let prevScroll = 0;

    window.addEventListener('scroll', () => {
        scrollVelocity = Math.abs(window.scrollY - prevScroll);
        prevScroll = window.scrollY;

        // Scale marquee speed based on scroll velocity
        if (marqueeContent) {
            const speed = Math.max(35, 35 - scrollVelocity * 0.3);
            marqueeContent.style.animationDuration = speed + 's';
        }
    }, { passive: true });

    /* ==============================================
       17. IMAGE SCALE ON SCROLL
       ============================================== */
    const scaleImages = document.querySelectorAll('.work-hero img, .work-item img');
    const scaleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ratio = entry.intersectionRatio;
                const scale = 1 + (1 - ratio) * 0.05;
                entry.target.style.transform = `scale(${scale})`;
            }
        });
    }, { threshold: Array.from({ length: 20 }, (_, i) => i / 19) });

    scaleImages.forEach(img => scaleObserver.observe(img));

    /* ==============================================
       CONSOLE BRANDING
       ============================================== */
    console.log(
        '%c MADE UTIL %c Carpintería Arquitectónica ',
        'background: #1e3427; color: #D6C2A8; padding: 10px 20px; font-weight: bold; font-size: 14px; font-family: monospace; border-radius: 4px 0 0 4px;',
        'background: #734627; color: #f0ece6; padding: 10px 20px; font-size: 14px; font-family: monospace; border-radius: 0 4px 4px 0;'
    );


    document.querySelectorAll('.cs-carousel').forEach(carousel => {
        const images = carousel.querySelectorAll('img');
        if (images.length < 2) return;

        let idx = 0;

        // Wrap images
        carousel.style.position = 'relative';
        carousel.style.overflow = 'hidden';

        // Create track
        const track = document.createElement('div');
        track.className = 'cs-carousel-track';
        images.forEach(img => track.appendChild(img));
        carousel.innerHTML = '';
        carousel.appendChild(track);

        // Show only first image
        images.forEach((img, i) => {
            img.style.display = i === 0 ? 'block' : 'none';
            img.style.width = '100%';
            img.style.borderRadius = '6px';
        });

        // Navigation arrows
        const prevBtn = document.createElement('button');
        prevBtn.className = 'cs-nav-btn cs-nav-prev';
        prevBtn.innerHTML = '‹';
        prevBtn.setAttribute('aria-label', 'Anterior');

        const nextBtn = document.createElement('button');
        nextBtn.className = 'cs-nav-btn cs-nav-next';
        nextBtn.innerHTML = '›';
        nextBtn.setAttribute('aria-label', 'Siguiente');

        carousel.appendChild(prevBtn);
        carousel.appendChild(nextBtn);

        // Counter
        const counter = document.createElement('div');
        counter.className = 'cs-carousel-counter';
        counter.textContent = `1 / ${images.length}`;
        carousel.appendChild(counter);

        function goTo(n) {
            images[idx].style.display = 'none';
            idx = (n + images.length) % images.length;
            images[idx].style.display = 'block';
            counter.textContent = `${idx + 1} / ${images.length}`;
        }

        prevBtn.addEventListener('click', () => goTo(idx - 1));
        nextBtn.addEventListener('click', () => goTo(idx + 1));

        // Swipe support for mobile
        let touchStartX = 0;
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goTo(idx + 1) : goTo(idx - 1);
            }
        }, { passive: true });

        // Auto-advance every 5 seconds
        let autoPlay = setInterval(() => goTo(idx + 1), 5000);
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
        carousel.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => goTo(idx + 1), 5000);
        });
    });

    /* ==============================================
       19. LEAD CAPTURE POPUP — Collect info for email marketing
       Shows once per session, after 4 seconds
       ============================================== */
    if (!localStorage.getItem('mu_subscribed') && !sessionStorage.getItem('mu_popup_closed')) {
        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.id = 'leadPopup';
            overlay.style.cssText = `
                position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100000;
                display:flex;align-items:center;justify-content:center;
                backdrop-filter: blur(10px);
            `;
            overlay.innerHTML = `
                <div style="
                    background: #090908;
                    border: 1px solid rgba(192,118,62,0.15);
                    border-radius: 4px;
                    padding: 3.5rem;
                    max-width: 460px;
                    width: 90%;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.8), inset 0 0 40px rgba(192,118,62,0.03);
                ">
                    <button id="closeLeadPopup" style="
                        position:absolute;top:1.5rem;right:1.5rem;background:none;
                        border:none;color:rgba(192,118,62,0.6);font-size:1.6rem;
                        cursor:pointer;width:30px;height:30px;
                        display:flex;align-items:center;justify-content:center;
                        transition:color 0.3s;
                    " onmouseover="this.style.color='#C0763E'" onmouseout="this.style.color='rgba(192,118,62,0.6)'">×</button>

                    <div style="font-size:0.6rem;letter-spacing:4px;color:#C0763E;text-transform:uppercase;margin-bottom:1rem;font-family:var(--font-h);">Membresía Exclusiva</div>
                    <h3 style="
                        font-family:'Playfair Display',serif;
                        color:#F5F2ED;font-size:2.2rem;margin-bottom:1rem;font-weight:400;line-height:1.1;
                    ">Inspiración <br><span style="color:#c0763e;font-style:italic;">premium</span></h3>
                    <p style="color:#9A9490;font-size:0.8rem;line-height:1.6;margin-bottom:2.5rem;font-family:var(--font-body);">
                        Recibe nuestros últimos proyectos arquitectónicos y ofertas reservadas.
                    </p>

                    <form id="leadForm" style="text-align:left;">
                        <div style="display:grid;gap:0.8rem;margin-bottom:1.5rem;">
                            <div style="display:flex;gap:0.8rem;">
                                <input type="text" id="leadNombre" placeholder="NOMBRE" required style="
                                    flex:1;background:transparent;border:none;border-bottom:1px solid rgba(232,218,206,0.15);
                                    color:#F5F2ED;padding:0.8rem 0;font-size:0.75rem;letter-spacing:1px;font-family:var(--font-h);
                                    text-transform:uppercase;outline:none;transition:border-color 0.3s;
                                " onfocus="this.style.borderColor='#C0763E'" onblur="this.style.borderColor='rgba(232,218,206,0.15)'">
                                <input type="text" id="leadApellido" placeholder="APELLIDO" required style="
                                    flex:1;background:transparent;border:none;border-bottom:1px solid rgba(232,218,206,0.15);
                                    color:#F5F2ED;padding:0.8rem 0;font-size:0.75rem;letter-spacing:1px;font-family:var(--font-h);
                                    text-transform:uppercase;outline:none;transition:border-color 0.3s;
                                " onfocus="this.style.borderColor='#C0763E'" onblur="this.style.borderColor='rgba(232,218,206,0.15)'">
                            </div>
                            <input type="email" id="leadEmail" placeholder="CORREO ELECTRÓNICO" required style="
                                width:100%;background:transparent;border:none;border-bottom:1px solid rgba(232,218,206,0.15);
                                color:#F5F2ED;padding:0.8rem 0;font-size:0.75rem;letter-spacing:1px;font-family:var(--font-h);
                                text-transform:uppercase;outline:none;transition:border-color 0.3s;
                            " onfocus="this.style.borderColor='#C0763E'" onblur="this.style.borderColor='rgba(232,218,206,0.15)'">
                            <input type="tel" id="leadTel" placeholder="TELÉFONO O WHATSAPP" required style="
                                width:100%;background:transparent;border:none;border-bottom:1px solid rgba(232,218,206,0.15);
                                color:#F5F2ED;padding:0.8rem 0;font-size:0.75rem;letter-spacing:1px;font-family:var(--font-h);
                                text-transform:uppercase;outline:none;transition:border-color 0.3s;
                            " onfocus="this.style.borderColor='#C0763E'" onblur="this.style.borderColor='rgba(232,218,206,0.15)'">
                            <select id="leadCiudad" required style="
                                width:100%;background:transparent;border:none;border-bottom:1px solid rgba(232,218,206,0.15);
                                color:rgba(245,242,237,0.7);padding:0.8rem 0;font-size:0.75rem;letter-spacing:1px;font-family:var(--font-h);
                                text-transform:uppercase;outline:none;appearance:none;transition:border-color 0.3s;
                            " onfocus="this.style.borderColor='#C0763E'" onblur="this.style.borderColor='rgba(232,218,206,0.15)'">
                                <option value="" style="background:#090908;">CIUDAD</option>
                                <option value="Medellín" style="background:#090908;">Medellín</option>
                                <option value="Sabaneta" style="background:#090908;">Sabaneta</option>
                                <option value="Envigado" style="background:#090908;">Envigado</option>
                                <option value="El Poblado" style="background:#090908;">El Poblado</option>
                                <option value="Otra" style="background:#090908;">Otra</option>
                            </select>
                        </div>
                        <div style="margin-bottom:2rem;">
                            <label style="display:flex;align-items:flex-start;gap:0.8rem;cursor:pointer;">
                                <input type="checkbox" id="leadPrivacy" required style="margin-top:0.2rem;accent-color:#c0763e;transform:scale(1.2);">
                                <span style="color:#9A9490;font-size:0.7rem;line-height:1.4;font-family:var(--font-body);">He leído y acepto la <a href="privacidad.html" target="_blank" style="color:#c0763e;text-decoration:underline;">política de privacidad</a>.</span>
                            </label>
                        </div>
                        <button type="submit" style="
                            width:100%;background:#C0763E;color:white;border:none;padding:1.2rem;
                            cursor:pointer;font-family:var(--font-h);font-weight:600;font-size:0.75rem;
                            letter-spacing:3px;text-transform:uppercase;transition:all 0.3s;
                        " onmouseover="this.style.background='#a65d2f'" onmouseout="this.style.background='#C0763E'">INGRESAR</button>
                    </form>
                    <p style="color:rgba(154,148,144,0.5);font-size:0.65rem;margin-top:1.5rem;letter-spacing:1px;text-transform:uppercase;font-family:var(--font-h);">Experiencia sin spam</p>
                </div>
            `;

            document.body.appendChild(overlay);

            // Close
            document.getElementById('closeLeadPopup').addEventListener('click', () => {
                overlay.remove();
                sessionStorage.setItem('mu_popup_closed', '1');
            });
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    sessionStorage.setItem('mu_popup_closed', '1');
                }
            });

            // Submit
            document.getElementById('leadForm').addEventListener('submit', (e) => {
                e.preventDefault();
                const data = {
                    nombre: document.getElementById('leadNombre').value,
                    apellido: document.getElementById('leadApellido').value,
                    email: document.getElementById('leadEmail').value,
                    telefono: document.getElementById('leadTel').value,
                    ciudad: document.getElementById('leadCiudad').value,
                    fecha: new Date().toISOString(),
                    fuente: 'popup',
                    acepta_privacidad: document.getElementById('leadPrivacy').checked
                };

                // Save locally
                const subs = JSON.parse(localStorage.getItem('mu_subscribers') || '[]');
                subs.push(data);
                localStorage.setItem('mu_subscribers', JSON.stringify(subs));
                localStorage.setItem('mu_subscribed', '1');

                // Try to send to server
                fetch('/api/subscribers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).catch(() => { });

                console.log('📬 Nuevo suscriptor:', data.nombre, data.email);

                // Show thank you
                overlay.querySelector('div').innerHTML = `
                    <div style="padding:2rem;text-align:center;">
                        <h3 style="
                            font-family:'Space Grotesk',sans-serif;
                            color:#F5F2ED;font-size:1.4rem;margin-bottom:0.8rem;
                        ">¡Bienvenido, ${data.nombre}!</h3>
                        <p style="color:#9A9490;font-size:0.9rem;line-height:1.5;">
                            Te enviaremos inspiración premium a<br>
                            <strong style="color:#c0763e;">${data.email}</strong>
                        </p>
                    </div>
                `;
                setTimeout(() => overlay.remove(), 3500);
            });

        }, 4000);
    }

    /* ==============================================
       20. ADMIN LINK IN NAV — Login popup
       ============================================== */
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !window.location.pathname.includes('admin-panel')) {
        // Add Admin link before CTA
        const adminLink = document.createElement('a');
        adminLink.href = '#';
        adminLink.textContent = 'Admin';
        adminLink.style.cssText = 'font-size:0.75rem;opacity:0.4;';
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAdminLogin();
        });

        const cta = navMenu.querySelector('.nav-cta');
        if (cta) navMenu.insertBefore(adminLink, cta);
        else navMenu.appendChild(adminLink);
    }

    function showAdminLogin() {
        const old = document.getElementById('adminLoginPopup');
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.id = 'adminLoginPopup';
        overlay.style.cssText = `
            position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100001;
            display:flex;align-items:center;justify-content:center;
        `;
        overlay.innerHTML = `
            <div style="
                background:#090908;border:1px solid rgba(192,118,62,0.15);
                padding:3.5rem 2.5rem;max-width:380px;width:90%;
                text-align:center;position:relative;
                box-shadow: 0 40px 100px rgba(0,0,0,0.8); border-radius:4px;
            ">
                <button onclick="document.getElementById('adminLoginPopup').remove()" style="
                    position:absolute;top:1.2rem;right:1.2rem;background:none;border:none;
                    color:rgba(192,118,62,0.6);font-size:1.6rem;cursor:pointer;line-height:1;transition:color 0.3s;
                " onmouseover="this.style.color='#C0763E'" onmouseout="this.style.color='rgba(192,118,62,0.6)'">×</button>
                <div style="font-size:0.65rem;letter-spacing:4px;color:#C0763E;text-transform:uppercase;margin-bottom:1rem;font-family:var(--font-h);">MóDulo Interno</div>
                <h3 style="
                    font-family:'Playfair Display',serif;color:#F5F2ED;
                    font-size:2rem;margin-bottom:2.5rem;font-weight:400;
                ">Workspace</h3>
                <input type="password" id="adminPassword" placeholder="CONTRASEÑA" style="
                    width:100%;background:transparent;border:none;border-bottom:1px solid rgba(232,218,206,0.15);
                    color:#F5F2ED;padding:0.8rem 0;font-size:0.75rem;font-family:var(--font-h); letter-spacing:2px;
                    margin-bottom:2rem;outline:none;text-align:center;text-transform:uppercase;transition:border-color 0.3s;
                " onfocus="this.style.borderColor='#C0763E'" onblur="this.style.borderColor='rgba(232,218,206,0.15)'">
                <button id="adminSubmitBtn" style="
                    width:100%;background:#C0763E;color:white;border:none;
                    padding:1.2rem;cursor:pointer;font-family:var(--font-h);
                    font-weight:600;font-size:0.75rem;letter-spacing:3px;text-transform:uppercase;transition:background 0.3s;
                " onmouseover="this.style.background='#a65d2f'" onmouseout="this.style.background='#C0763E'">ACCEDER</button>
                <p id="adminLoginError" style="
                    color:#e74c3c;font-size:0.7rem;text-align:center;
                    margin-top:1rem;display:none;font-family:var(--font-h);letter-spacing:1px;text-transform:uppercase;
                ">Contraseña incorrecta</p>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        setTimeout(() => document.getElementById('adminPassword')?.focus(), 100);

        function doLogin() {
            const pass = document.getElementById('adminPassword').value;
            if (pass === '123') {
                sessionStorage.setItem('mu_admin', '1');
                window.location.href = 'admin-panel.html';
            } else {
                document.getElementById('adminLoginError').style.display = 'block';
                document.getElementById('adminPassword').value = '';
            }
        }

        document.getElementById('adminSubmitBtn').addEventListener('click', doLogin);
        document.getElementById('adminPassword').addEventListener('keydown', e => {
            if (e.key === 'Enter') doLogin();
        });
    }

});
