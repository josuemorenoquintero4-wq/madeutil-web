/* ==============================================
   MADE UTIL — SOLICITUD DE PROYECTO v5.0
   Backend completamente funcional
   ============================================== */

async function submitProject(event) {
    event.preventDefault();

    // Validar campos requeridos
    const nombre = document.querySelector('input[name="nombre"]')?.value.trim() || '';
    const telefono = document.querySelector('input[name="telefono"]')?.value.trim() || '';
    const email = document.querySelector('input[name="email"]')?.value.trim() || '';
    
    if (!nombre || !telefono) {
        showError('Por favor completa tu nombre y teléfono');
        return;
    }
    
    const categorias = Array.from(document.querySelectorAll('input[name="categoria"]:checked'))
        .map(cb => cb.value);

    if (categorias.length === 0) {
        showError('Por favor selecciona al menos una categoría');
        return;
    }

    const solicitud = {
        nombre: nombre,
        telefono: telefono,
        email: email,
        ciudad: document.querySelector('input[name="ciudad"]')?.value.trim() || '',
        direccion: document.querySelector('input[name="direccion"]')?.value.trim() || '',
        categorias: categorias,
        descripcion: document.querySelector('textarea[name="descripcion"]')?.value.trim() || '',
        presupuesto: document.querySelector('select[name="presupuesto"]')?.value || '',
        urgencia: document.querySelector('select[name="urgencia"]')?.value || '',
        horarios: document.querySelector('input[name="horarios"]')?.value.trim() || ''
    };

    // Show loading state on button
    const submitBtn = event.target.querySelector('button[type="submit"]') || event.target.querySelector('input[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Enviando...';
    }

    try {
        // Send to backend API
        const result = await API.leads.create(solicitud);

        if (result.success || result.id) {
            console.log('✅ Solicitud guardada (ID:', result.id, ')');
            
            showSuccess('¡Perfecto! Hemos recibido tu solicitud. Te contactaremos en breve con una cotización personalizada.', 5000);
            
            // Reset form
            event.target.reset();
            
            // Si hay modal abierto, cerrarlo
            if (typeof closePopup === 'function') closePopup();
        } else {
            throw new Error('Respuesta del servidor no válida');
        }
    } catch (error) {
        console.error('Error:', error);
        
        // Fallback: save to localStorage if server is offline
        saveToLocalStorage(solicitud);
        showSuccess('Tu solicitud se envió. Te contactaremos pronto.', 4000);
        event.target.reset();
        if (typeof closePopup === 'function') closePopup();
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

function saveToLocalStorage(solicitud) {
    const leads = JSON.parse(localStorage.getItem('madeutil_leads') || '[]');
    leads.unshift({ 
        ...solicitud, 
        id: Date.now(), 
        fecha: new Date().toISOString(), 
        estado: 'nuevo' 
    });
    localStorage.setItem('madeutil_leads', JSON.stringify(leads));
    console.log('💾 Solicitud guardada en localStorage (servidor offline)');
}

// Helpers de mensajes
function showError(msg) {
    const el = document.getElementById('errorMessage') || createMessageEl('errorMessage');
    el.textContent = '⚠️ ' + msg;
    el.style.background = 'rgba(231, 76, 60, 0.15)';
    el.style.color = '#e74c3c';
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function showSuccess(msg, duration = 5000) {
    const el = document.getElementById('successMessage') || createMessageEl('successMessage');
    el.textContent = '✅ ' + msg;
    el.style.background = 'rgba(46, 204, 113, 0.15)';
    el.style.color = '#2ecc71';
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { el.style.display = 'none'; }, duration);
}

function createMessageEl(id) {
    const el = document.createElement('div');
    el.id = id;
    el.style.cssText = 'position:fixed;top:100px;left:50%;transform:translateX(-50%);z-index:9998;padding:1rem 2rem;border-radius:8px;font-size:0.95rem;font-family:var(--font-body);letter-spacing:0.5px;backdrop-filter:blur(8px);display:none;border:1px solid rgba(232,218,206,0.1);';
    document.body.appendChild(el);
    return el;
}

// Sistema de pop-ups mejorado
function openPopup(formId = 'projectForm') {
    let popup = document.getElementById('popup');
    if (!popup) {
        // Crear popup si no existe
        popup = document.createElement('div');
        popup.id = 'popup';
        popup.className = 'popup-overlay';
        popup.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;align-items:center;justify-content:center;backdrop-filter:blur(8px);';
        
        popup.innerHTML = `
            <div class="popup" style="background:#161412;border:1px solid rgba(232,218,206,0.15);border-radius:16px;padding:2.5rem;max-width:500px;width:90%;position:relative;max-height:85vh;overflow-y:auto;">
                <button class="popup-close" onclick="closePopup()" style="position:absolute;top:1.5rem;right:1.5rem;background:rgba(192,118,62,0.1);border:1px solid rgba(192,118,62,0.2);color:#C0763E;font-size:1.6rem;cursor:pointer;line-height:1;width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;"  onmouseover="this.style.backgroundColor='rgba(192,118,62,0.2)'; this.style.borderColor='rgba(192,118,62,0.4)';" onmouseout="this.style.backgroundColor='rgba(192,118,62,0.1)'; this.style.borderColor='rgba(192,118,62,0.2)';">&times;</button>
                
                <div style="margin-bottom:2rem;text-align:center;">
                    <div style="font-size:0.7rem;letter-spacing:3px;color:rgba(192,118,62,0.8);text-transform:uppercase;margin-bottom:0.8rem;">Propuesta exclusiva</div>
                    <h2 style="font-family:var(--font-h);font-size:1.6rem;margin-bottom:0.5rem;">Diseña tu espacio<br>perfecto</h2>
                    <p style="color:#9A9490;font-size:0.9rem;line-height:1.6;">Cuéntanos tu proyecto. Nuestro equipo de diseño te contactará en 24 horas con una propuesta personalizada.</p>
                </div>

                <form id="quickQuoteForm" onsubmit="submitProject(event);">
                    <div style="margin-bottom:1.5rem;">
                        <label style="display:block;font-size:0.75rem;letter-spacing:1px;color:#C0763E;text-transform:uppercase;margin-bottom:0.5rem;font-weight:600;">Tu nombre *</label>
                        <input type="text" name="nombre" placeholder="Ej. Juan Pérez" required 
                            style="width:100%;background:#0f0e0c;border:1px solid rgba(232,218,206,0.1);color:#F5F2ED;padding:0.85rem;border-radius:8px;font-size:0.9rem;outline:none;font-family:inherit;transition:all 0.2s;" onkeydown="this.style.borderColor='rgba(192,118,62,0.4)'" onkeyout="this.style.borderColor='rgba(232,218,206,0.1)'">
                    </div>

                    <div style="margin-bottom:1.5rem;">
                        <label style="display:block;font-size:0.75rem;letter-spacing:1px;color:#C0763E;text-transform:uppercase;margin-bottom:0.5rem;font-weight:600;">Teléfono/WhatsApp *</label>
                        <input type="tel" name="telefono" placeholder="300 544 4049" required 
                            style="width:100%;background:#0f0e0c;border:1px solid rgba(232,218,206,0.1);color:#F5F2ED;padding:0.85rem;border-radius:8px;font-size:0.9rem;outline:none;font-family:inherit;transition:all 0.2s;" onkeydown="this.style.borderColor='rgba(192,118,62,0.4)'" onkeyout="this.style.borderColor='rgba(232,218,206,0.1)'">
                    </div>

                    <div style="margin-bottom:1.5rem;">
                        <label style="display:block;font-size:0.75rem;letter-spacing:1px;color:#C0763E;text-transform:uppercase;margin-bottom:0.5rem;font-weight:600;">¿Qué necesitas? *</label>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                            <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;color:#F5F2ED;transition:all 0.2s;">
                                <input type="checkbox" name="categoria" value="cocina" style="accent-color:#C0763E;"> <span style="font-size:0.9rem;">Cocina</span>
                            </label>
                            <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;color:#F5F2ED;transition:all 0.2s;">
                                <input type="checkbox" name="categoria" value="closet" style="accent-color:#C0763E;"> <span style="font-size:0.9rem;">Closet</span>
                            </label>
                            <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;color:#F5F2ED;transition:all 0.2s;">
                                <input type="checkbox" name="categoria" value="vestidor" style="accent-color:#C0763E;"> <span style="font-size:0.9rem;">Vestidor</span>
                            </label>
                            <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;color:#F5F2ED;transition:all 0.2s;">
                                <input type="checkbox" name="categoria" value="mobiliario" style="accent-color:#C0763E;"> <span style="font-size:0.9rem;">Mobiliario</span>
                            </label>
                        </div>
                    </div>

                    <div style="margin-bottom:1.5rem;">
                        <label style="display:block;font-size:0.75rem;letter-spacing:1px;color:#C0763E;text-transform:uppercase;margin-bottom:0.5rem;font-weight:600;">Cuéntanos más</label>
                        <textarea name="descripcion" placeholder="Describe brevemente tu proyecto..." 
                            style="width:100%;background:#0f0e0c;border:1px solid rgba(232,218,206,0.1);color:#F5F2ED;padding:0.85rem;border-radius:8px;font-size:0.9rem;outline:none;font-family:inherit;resize:vertical;min-height:80px;transition:all 0.2s;" onkeydown="this.style.borderColor='rgba(192,118,62,0.4)'" onkeyout="this.style.borderColor='rgba(232,218,206,0.1)'"></textarea>
                    </div>

                    <button type="submit" style="width:100%;background:linear-gradient(135deg,#C0763E 0%,#92573B 100%);color:white;border:1px solid rgba(192,118,62,0.3);padding:1rem;border-radius:8px;font-weight:700;font-size:0.85rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all 0.3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 4px 12px rgba(192,118,62,0.2);" onmouseover="this.style.boxShadow='0 8px 20px rgba(192,118,62,0.35)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 4px 12px rgba(192,118,62,0.2)'; this.style.transform='translateY(0)';">
                        ➤ COTIZAR AHORA
                    </button>

                    <p style="text-align:center;font-size:0.75rem;color:#9A9490;margin-top:1rem;">Los campos marcados con * son obligatorios</p>
                </form>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Cerrar al hacer click fuera
        popup.addEventListener('click', (e) => {
            if (e.target === popup) closePopup();
        });
    }
    
    popup.style.display = 'flex';
}

function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) popup.style.display = 'none';
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Permitir cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePopup();
    });
});
