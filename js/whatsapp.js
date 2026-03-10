/* ==============================================
   MADE UTIL — WHATSAPP FLOATING BUTTON
   Auto-injects on all pages
   ============================================== */

(function () {

    const PHONE = '573012400323';
    const MESSAGE = '¡Hola! Me interesa un proyecto con Made Util. ¿Podrían darme más información?';

    // Create WhatsApp button
    const btn = document.createElement('a');
    btn.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.id = 'whatsapp-float';
    btn.setAttribute('aria-label', 'Escribenos por WhatsApp');
    btn.innerHTML = `
        <svg viewBox="0 0 32 32" width="32" height="32" fill="white">
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.502 1.134 6.746 3.058 9.382L1.058 31.17l6.012-1.93A15.91 15.91 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.53 22.612c-.396 1.116-2.328 2.136-3.21 2.21-.882.076-1.704.396-5.736-1.194-4.854-1.916-7.914-6.89-8.154-7.208-.24-.318-1.956-2.604-1.956-4.968s1.236-3.528 1.674-4.012c.438-.484.954-.606 1.272-.606.318 0 .636.002.914.016.294.014.69-.112 1.078.822.396.954 1.35 3.294 1.47 3.534.12.24.198.518.038.836-.16.318-.24.518-.478.796-.24.278-.504.622-.72.836-.24.236-.488.492-.21.966.278.474 1.236 2.04 2.652 3.306 1.824 1.632 3.36 2.136 3.834 2.376.474.24.75.198 1.026-.12.278-.318 1.188-1.386 1.506-1.866.318-.478.636-.396 1.074-.236.438.16 2.778 1.31 3.252 1.55.474.24.79.358.91.558.118.198.118 1.156-.278 2.274z"/>
        </svg>`;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        #whatsapp-float {
            position: fixed;
            bottom: 25px;
            right: 25px;
            width: 60px;
            height: 60px;
            background: #25D366;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
            z-index: 9999;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        #whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(37, 211, 102, 0.6);
        }
        #whatsapp-float svg {
            width: 30px;
            height: 30px;
        }

        /* Pulse animation */
        #whatsapp-float::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #25D366;
            z-index: -1;
            animation: whatsapp-pulse 2s ease-in-out infinite;
        }

        @keyframes whatsapp-pulse {
            0% { transform: scale(1); opacity: 0.5; }
            70% { transform: scale(1.3); opacity: 0; }
            100% { transform: scale(1.3); opacity: 0; }
        }

        @media (max-width: 768px) {
            #whatsapp-float {
                bottom: 15px;
                right: 15px;
                width: 55px;
                height: 55px;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(btn);
})();
