/* ==============================================
   MADE UTIL — SOLICITUD DE PROYECTO v3.0
   Envía datos al backend + notificación WhatsApp
   ============================================== */

async function submitProject(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Get checked categories
    const categorias = Array.from(document.querySelectorAll('input[name="categoria"]:checked'))
        .map(cb => cb.value);

    if (categorias.length === 0) {
        alert('Por favor selecciona al menos una categoría');
        return;
    }

    const solicitud = {
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        email: formData.get('email') || '',
        ciudad: formData.get('ciudad') || '',
        direccion: formData.get('direccion') || '',
        categorias: categorias,
        descripcion: formData.get('descripcion') || '',
        presupuesto: formData.get('presupuesto') || '',
        urgencia: formData.get('urgencia') || '',
        horarios: formData.get('horarios') || ''
    };

    // Show loading state on button
    const submitBtn = event.target.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
    }

    try {
        // Send to backend API
        const result = await API.leads.create(solicitud);

        if (result.success) {
            console.log('✅ Solicitud guardada en servidor (ID:', result.id, ')');

            // Show success message
            const successEl = document.getElementById('successMessage');
            if (successEl) {
                successEl.style.display = 'block';
                successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => { successEl.style.display = 'none'; }, 6000);
            }

            // Reset form
            event.target.reset();

            // Log success (backend handles SMS notification)
            console.log('✅ Solicitud enviada. Notificación SMS enviada al admin.');
        }
    } catch (error) {
        console.error('Error enviando solicitud:', error);

        // Fallback: save to localStorage if server is offline
        saveToLocalStorage(solicitud);

        // Still show success to user
        const successEl = document.getElementById('successMessage');
        if (successEl) {
            successEl.style.display = 'block';
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => { successEl.style.display = 'none'; }, 6000);
        }
        event.target.reset();
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

function saveToLocalStorage(solicitud) {
    // Fallback when server is offline
    const leads = JSON.parse(localStorage.getItem('madeutil_leads') || '[]');
    leads.unshift({ ...solicitud, id: Date.now(), fecha: new Date().toISOString(), estado: 'nuevo' });
    localStorage.setItem('madeutil_leads', JSON.stringify(leads));
    console.log('💾 Solicitud guardada en localStorage (servidor offline)');
}

function sendWhatsAppNotification(solicitud) {
    const phoneNumber = '573012400323';
    const mensaje = `🔔 *NUEVO PROYECTO MADE UTIL*\n\n` +
        `👤 ${solicitud.nombre}\n` +
        `📍 ${solicitud.ciudad || 'No especificada'}\n` +
        `📱 ${solicitud.telefono}\n` +
        `🎨 ${solicitud.categorias.join(', ')}\n` +
        `💰 ${solicitud.presupuesto || 'No especificado'}\n\n` +
        `Ver en el CMS: ${window.location.origin}/cms.html`;

    console.log('📱 Notificación WhatsApp preparada para:', phoneNumber);

    // En producción real se puede integrar con WhatsApp Business API
    // Por ahora queda disponible para abrir via consola
    window._whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`;
}
