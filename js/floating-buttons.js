/**
 * floating-buttons.js — Made Util
 * Injects the WhatsApp + AI floating buttons on every page that includes this script.
 */
(function () {
    const WA_NUMBER = '573005444049';

    // Detect if the AI assistant is already present (index.html has it)
    const hasAI = document.querySelector('.ai-bubble, #aiToggle, [data-ai-btn]');

    // Styles
    const style = document.createElement('style');
    style.textContent = `
    .mu-notification-badge {
        position: fixed;
        bottom: 7.5rem;
        right: 1.75rem;
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        box-shadow: 0 6px 20px rgba(231,76,60,0.4);
        animation: muBadgeFloat 3s ease-in-out infinite;
        z-index: 9991;
        font-family: 'Space Grotesk', sans-serif;
        animation-delay: 0.2s;
    }
    @keyframes muBadgeFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }
    .mu-float-group {
        position: fixed;
        bottom: 1.75rem;
        right: 1.75rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.75rem;
        z-index: 9990;
    }
    .mu-float-btn {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        text-decoration: none;
        transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s;
        position: relative;
    }
    .mu-float-btn:hover { transform: scale(1.13); }
    .mu-float-btn svg { display: block; }

    /* WhatsApp */
    .mu-wa-btn { background: linear-gradient(135deg, #25D366 0%, #1da452 100%); box-shadow: 0 8px 24px rgba(37,211,102,0.3); animation: muPulseWA 3s infinite 0.8s; }
    .mu-wa-btn:hover { box-shadow: 0 10px 32px rgba(37,211,102,0.55); transform: scale(1.15) !important; }
    @keyframes muPulseWA {
        0%, 100% { box-shadow: 0 8px 24px rgba(37,211,102,0.35); }
        50% { box-shadow: 0 8px 36px rgba(37,211,102,0.7); }
    }

    /* AI */
    .mu-ai-btn { background: linear-gradient(135deg, #C0763E 0%, #92573B 100%); border: 1.5px solid rgba(192,118,62,0.6); box-shadow: 0 8px 24px rgba(192,118,62,0.2); animation: muPulseAI 3s infinite 1.3s; }
    .mu-ai-btn:hover { box-shadow: 0 10px 32px rgba(192,118,62,0.45); transform: scale(1.15) !important; }
    @keyframes muPulseAI {
        0%, 100% { box-shadow: 0 8px 24px rgba(192,118,62,0.25); }
        50% { box-shadow: 0 8px 36px rgba(192,118,62,0.55); }
    }

    /* Tooltip */
    .mu-float-btn::before {
        content: attr(data-tip);
        position: absolute;
        right: calc(100% + 12px);
        background: rgba(15,14,12,0.92);
        color: #F5F2ED;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.72rem;
        letter-spacing: 0.5px;
        padding: 0.35rem 0.75rem;
        border-radius: 6px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        border: 1px solid rgba(232,218,206,0.08);
    }
    .mu-float-btn:hover::before { opacity: 1; }

    /* Bounce in */
    @keyframes muBounceIn {
        0%   { opacity: 0; transform: scale(0.3) translateY(24px); }
        60%  { transform: scale(1.12) translateY(-6px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .mu-float-btn { animation-fill-mode: both; transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s; }
    .mu-wa-btn  { animation: muBounceIn 0.6s 0.1s cubic-bezier(.34,1.56,.64,1) both, muPulseWA 3s 0.8s infinite; }
    .mu-ai-btn  { animation: muBounceIn 0.6s 0.35s cubic-bezier(.34,1.56,.64,1) both, muPulseAI 3s 1.3s infinite; }
    `;
    document.head.appendChild(style);

    // Build group
    const group = document.createElement('div');
    group.className = 'mu-float-group';

    // AI button (only add if no AI widget already on page OR if it's not index.html)
    const aiBtn = document.createElement('a');
    aiBtn.className = 'mu-float-btn mu-ai-btn';
    aiBtn.href = 'solicitar-proyecto.html';
    aiBtn.setAttribute('data-tip', 'Cotiza tu proyecto');
    aiBtn.setAttribute('aria-label', 'Asistente de cotización');
    aiBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8DACE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`;

    // WhatsApp button
    const waBtn = document.createElement('a');
    waBtn.className = 'mu-float-btn mu-wa-btn';
    waBtn.href = `https://wa.me/${WA_NUMBER}`;
    waBtn.target = '_blank';
    waBtn.rel = 'noopener';
    waBtn.setAttribute('data-tip', 'Contáctanos por WhatsApp');
    waBtn.setAttribute('aria-label', 'WhatsApp Made Util');
    waBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
    </svg>`;

    // Remove any old standalone WA buttons this page may have
    ['waBtnHome', 'waBtn'].forEach(id => {
        const old = document.getElementById(id);
        if (old) old.remove();
    });

    // On index.html the AI widget (ai-assistant.js) handles the AI button already
    // so we only add the AI link on non-index pages
    const isIndex = window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/final/');
    // Add WhatsApp on top (first), then AI below
    group.appendChild(waBtn);
    if (!isIndex) group.appendChild(aiBtn);
    document.body.appendChild(group);

    // Add notification badge
    const badge = document.createElement('div');
    badge.className = 'mu-notification-badge';
    badge.textContent = '💬 MENSAJES';
    document.body.appendChild(badge);
})();
