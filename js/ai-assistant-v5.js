/* ==============================================
   MADE UTIL — AI ASSISTANT v5.0
   Asistente inteligente completamente funcional
   ============================================== */

const AI_KNOWLEDGE = {
    greetings: {
        keywords: ['hola', 'buenos', 'buenas', 'hey', 'saludos', 'hi', 'hello'],
        response: `¡Hola! 👋 Soy el asistente virtual de Made Util.

Puedo ayudarte con:
• 💰 Precios y presupuestos
• ⏱️ Tiempos de fabricación
• 🪵 Materiales y herrajes
• 📍 Zonas de cobertura
• 🔨 Nuestro proceso de trabajo
• 📅 Disponibilidad para visitas

¿En qué te puedo ayudar hoy?`
    },
    precios: {
        keywords: ['precio', 'cuanto', 'cuesta', 'valor', 'presupuesto', 'costo', 'valor aproximado'],
        response: `Los precios varían según materiales, diseño y tamaño:

**COCINAS**     $10M - $50M+
**CLOSETS**      $8M - $35M
**MOBILIARIO**   $5M - $25M

Factores que afectan el precio:
✓ Tipo de melamina (estándar o premium)
✓ Herrajes (Blum es más costoso pero premium)
✓ Tamaño del proyecto
✓ Acabados especiales

¿Te gustaría solicitar una cotización personalizada? 📋`
    },
    tiempos: {
        keywords: ['cuanto demora', 'tiempo', 'plazo', 'cuando', 'duracion', 'semanas', 'meses'],
        response: `Nuestro proceso completo tiene 6 etapas:

**01.** Contacto inicial → 24 horas
**02.** Planeación → 1 semana
**03.** Visita y medición → 1-2 días
**04.** Diseño 3D → 1 semana
**05.** Fabricación → 2-4 semanas
**06.** Instalación → 1-3 días

⏱️ **Tiempo total:** 4 a 6 semanas desde la aprobación del diseño.

¿Tienes una fecha específica en mente? 📅`
    },
    materiales: {
        keywords: ['material', 'madera', 'melamina', 'herraje', 'calidad', 'marca', 'blum', 'arauco'],
        response: `Trabajamos solo con materiales premium:

**TABLEROS**
• Melamina: Arauco, Masisa, Duratex
• MDF Ultra-light para puertas
• Espesores: 9mm, 12mm, 15mm, 18mm

**HERRAJES**
• Bisagras: Blum Clip Top, Blumotion
• Correderas: Blum Tandem (cierre suave)
• Sistemas de elevación: Aventos

**CANTOS**
• PVC Rehau 2mm (premium)
• Colores exactos a melamina

Todos con garantía de fábrica! 🏆`
    },
    zonas: {
        keywords: ['donde', 'zona', 'cobertura', 'envio', 'entrega', 'ciudad', 'ubicacion', 'medellín'],
        response: `Nuestra cobertura en Antioquia:

✅ **GRATIS:**
   • Sabaneta
   • Envigado
   • El Poblado

💰 **CON FLETE:**
   • Medellín zona norte: $120,000
   • La Estrella: $95,000
   • Llanogrande: $160,000
   • El Retiro: $190,000
   • Guatapé: $450,000

⏱️ Entrega: 24-72 horas según zona

¿En qué ciudad estás ubicado? 📍`
    },
    proceso: {
        keywords: ['como funciona', 'proceso', 'pasos', 'metodologia', 'que hago', 'como empezar'],
        response: `Nuestro proceso garantiza calidad excepcional:

**PASO 1 → CONTACTO**
Nos cuentas tu necesidad vía formulario

**PASO 2 → PLANEACIÓN**
Organizamos brief: presupuesto, tiempos, estilo

**PASO 3 → VISITA**
Medimos tu espacio con precisión

**PASO 4 → DISEÑO 3D**
Renders fotorrealistas para que visualices todo

**PASO 5 → FABRICACIÓN**
Producción con actualizaciones semanales

**PASO 6 → INSTALACIÓN**
Montaje profesional + capacitación

¿Quieres iniciar tu proyecto? 🚀`
    },
    garantia: {
        keywords: ['garantia', 'warranty', 'respaldo', 'servicio', 'problema'],
        response: `Nuestras garantías:

✅ **1 AÑO** en herrajes y estructura
✅ **6 MESES** en acabados superficiales
✅ **LIFETIME** en asesoría de mantenimiento

Realizamos servicio post-venta gratuito en el primer mes.

¿Tienes alguna preocupación específica? 🛡️`
    },
    categorias: {
        keywords: ['cocina', 'closet', 'vestidor', 'mueble', 'mobiliario', 'que hacen', 'que ofrecen'],
        response: `Fabricamos 3 categorías principales:

🍳 **COCINAS**
Modulares, en L, en U, con isla
Electrodomésticos empotrados opcional

👔 **CLOSETS Y VESTIDORES**
Walk-in, lineales, en esquina
Sistemas de almacenaje inteligente

🪑 **MOBILIARIO**
Mesas, consolas, bibliotecas
Muebles de TV, escritorios

¿Cuál te interesa? 🎨`
    },
    formulario: {
        keywords: ['solicitar', 'cotizar', 'formulario', 'empezar', 'iniciar', 'proyecto', 'llenar'],
        response: `¡Excelente! Voy a ayudarte a completar el formulario. 📋

Para cotizar necesito:
1. **Tu nombre completo**
2. **Teléfono/WhatsApp**
3. **Lo que quieres** (cocina, closet, etc)
4. **Descripción del proyecto**

Puedes:
✅ Hacer clic en "COTIZAR" en la página
✅ Escribirme aquí y te guío paso a paso
✅ Llamarme al 301 240 0323

¿Por dónde prefieres empezar? 🚀`
    },
    contacto: {
        keywords: ['contacto', 'llamar', 'teléfono', 'whatsapp', 'email', 'comunicar'],
        response: `¡Perfecto! Aquí está nuestro contacto:

📞 **TELÉFONO/WHATSAPP:** 301 240 0323
💬 **ENLACE DIRECTO:** wa.me/573012400323
📧 **CORREO:** madeutilantioquia@gmail.com
🧑 **ATENCIÓN:** Isaac David Moreno Quintero


Horarios:
🕖 Lunes a Viernes: 8:00 AM - 6:00 PM
📅 Sábados: 9:00 AM - 2:00 PM
🚫 Domingos: Cerrado

Podemos coordinar una visita técnica **GRATIS** cuando mejor te venga. ¿Cuándo estarías disponible? 📅`
    }
};

function getAIResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    // Buscar en la base de conocimientos
    for (const [key, item] of Object.entries(AI_KNOWLEDGE)) {
        if (item.keywords.some(keyword => msg.includes(keyword))) {
            return item.response;
        }
    }

    // Respuesta por defecto
    return `No tengo una respuesta específica para eso, pero puedo ayudarte con:
    
• Precios y cotizaciones
• Tiempos de entrega
• Materiales que usamos
• Nuestros procesos
• Zonas de cobertura
• Cómo iniciar tu proyecto

¿Hay algo de esto que te interese? O si prefieres hablar con Isaac, llama directo al 301 240 0323 📞`;
}

// Crear widget de chat si no existe
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('aiChat')) {
        createAIChatWidget();
    }
});

function createAIChatWidget() {
    const widget = document.createElement('div');
    widget.id = 'aiChat';
    widget.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 380px;
        height: 500px;
        background: #161412;
        border: 1px solid rgba(232,218,206,0.15);
        border-radius: 16px;
        display: none;
        flex-direction: column;
        z-index: 9990;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    `;

    widget.innerHTML = `
        <div style="padding: 1.5rem; border-bottom: 1px solid rgba(232,218,206,0.1); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-size: 0.75rem; letter-spacing: 2px; color: #C0763E; text-transform: uppercase;">Asistente IA</div>
                <h3 style="font-size: 1.1rem; margin: 0; color: #F5F2ED; font-family: var(--font-h);">¿Cómo te ayudo?</h3>
            </div>
            <button onclick="toggleAIChat()" style="background: none; border: none; color: #9A9490; font-size: 1.4rem; cursor: pointer; padding: 0.5rem; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center;" onmouseover="this.style.color='#C0763E'; this.style.backgroundColor='rgba(192,118,62,0.1)';" onmouseout="this.style.color='#9A9490'; this.style.backgroundColor='transparent';">&times;</button>
        </div>
        
        <div id="aiMessages" style="flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
            <div style="background: rgba(192,118,62,0.1); border: 1px solid rgba(192,118,62,0.2); border-radius: 12px; padding: 1rem; color: #F5F2ED; line-height: 1.6;">
                Hola! 👋 Soy el asistente IA de Made Util. Preguntame sobre precios, procesos, materiales, disponibilidad... ¡lo que necesites! 
            </div>
        </div>
        
        <div style="padding: 1rem; border-top: 1px solid rgba(232,218,206,0.1); display: flex; gap: 0.75rem;">
            <input type="text" id="aiInput" placeholder="Escribe tu pregunta..." style="flex: 1; background: #0f0e0c; border: 1px solid rgba(232,218,206,0.1); color: #F5F2ED; padding: 0.75rem; border-radius: 8px; font-size: 0.9rem; outline: none; font-family: inherit;">
            <button onclick="sendAIMessage()" style="background: linear-gradient(135deg, #C0763E 0%, #92573B 100%); border: 1px solid rgba(192,118,62,0.3); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s cubic-bezier(.34,1.56,.64,1); box-shadow: 0 4px 12px rgba(192,118,62,0.2); display: flex; align-items: center; justify-content: center;" onmouseover="this.style.boxShadow='0 8px 20px rgba(192,118,62,0.35)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 4px 12px rgba(192,118,62,0.2)'; this.style.transform='translateY(0)';">➤</button>
        </div>
    `;

    document.body.appendChild(widget);

    // Event listeners
    document.getElementById('aiInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendAIMessage();
    });
}

function toggleAIChat() {
    const chat = document.getElementById('aiChat');
    chat.style.display = chat.style.display === 'none' ? 'flex' : 'none';
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const msg = input.value.trim();
    if (!msg) return;

    const messagesDiv = document.getElementById('aiMessages');

    // Mostrar mensaje del usuario
    const userDiv = document.createElement('div');
    userDiv.style.cssText = 'align-self: flex-end; background: rgba(245,242,237,0.08); border-radius: 12px; padding: 0.75rem 1rem; max-width: 80%; color: #F5F2ED; word-wrap: break-word;';
    userDiv.textContent = msg;
    messagesDiv.appendChild(userDiv);

    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Respuesta después de 300ms
    setTimeout(() => {
        const response = getAIResponse(msg);
        const botDiv = document.createElement('div');
        botDiv.style.cssText = 'align-self: flex-start; background: rgba(192,118,62,0.1); border: 1px solid rgba(192,118,62,0.2); border-radius: 12px; padding: 0.75rem 1rem; max-width: 80%; color: #F5F2ED; line-height: 1.6; word-wrap: break-word;';
        botDiv.innerHTML = response.replace(/\n/g, '<br>');
        messagesDiv.appendChild(botDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 300);
}

// Botón flotante para abrir chat
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('aiToggleBtn')) {
        const btn = document.createElement('button');
        btn.id = 'aiToggleBtn';
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #C0763E 0%, #d4945a 100%);
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(192,118,62,0.4);
            z-index: 9989;
            animation: pulse-ai 3s infinite;
            transition: transform 0.2s;
        `;
        btn.innerHTML = '🤖';
        btn.onclick = toggleAIChat;
        document.body.appendChild(btn);

        // Agregar estilos de animación
        if (!document.querySelector('#aiStyles')) {
            const style = document.createElement('style');
            style.id = 'aiStyles';
            style.textContent = `
                @keyframes pulse-ai {
                    0%, 100% { box-shadow: 0 4px 20px rgba(192,118,62,0.4); }
                    50% { box-shadow: 0 4px 32px rgba(192,118,62,0.7); }
                }
                #aiChat::-webkit-scrollbar {
                    width: 6px;
                }
                #aiChat::-webkit-scrollbar-track {
                    background: transparent;
                }
                #aiChat::-webkit-scrollbar-thumb {
                    background: rgba(192,118,62,0.4);
                    border-radius: 3px;
                }
                #aiChat::-webkit-scrollbar-thumb:hover {
                    background: rgba(192,118,62,0.6);
                }
            `;
            document.head.appendChild(style);
        }
    }
});
