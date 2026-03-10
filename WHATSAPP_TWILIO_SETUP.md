# 🚀 WHATSAPP CON TWILIO — Setup Profesional (1 hora)

## Cuándo usar Twilio en lugar de ManyChat

| Aspecto | ManyChat | Twilio |
|--------|----------|--------|
| Dificultad | Muy fácil | Intermedia |
| Tiempo setup | 15 mins | 1 hora |
| Costo | Gratis/500 msgs | $0.01/msg |
| Automatización | Muy limitada | Muy flexible |
| Confiabilidad | Buena | Excelente |
| Personalización | Básica | Completa |

**Elige Twilio si:**
- ✅ Necesitas más de 500 mensajes/mes
- ✅ Quieres lógica personalizada
- ✅ Deseas integración profunda con tu sistema
- ✅ Quieres máximo control

---

## 📋 PASO 1: Crear Cuenta Twilio (5 minutos)

1. Ve a: **https://www.twilio.com**
2. Click **"Get a free account"**
3. Completa el formulario:
   ```
   Email: tu_email@gmail.com
   Contraseña: contraseña fuerte
   Número de teléfono: tu número
   ```
4. Verifica el email
5. Verifica el teléfono (SMS)
6. Dashboard de Twilio abierto ✅

---

## 🔌 PASO 2: Habilitar WhatsApp Sandbox (10 minutos)

**Por qué sandbox:** Para testing sin números reales de Twilio

1. En dashboard Twilio, ve a: **Messaging** → **Whatsapp**
2. Click en **"Sandbox"** (en rojo)
3. Busca la sección: "Sandbox Configuration"
4. En tu teléfono, abre WhatsApp
5. Envía un mensaje a: **+1 415-523-8886** (número Twilio)
6. Mensaje: `join obvious-elephant` (código mostrado en Twilio)
7. Recibirás confirmación
8. ¡Sandbox activado! ✅

---

## 💳 PASO 3: Números Teleónicos (15 minutos)

### Opción A: Usar Sandbox (Gratis, para testing)
```
- Ya está listo
- Solo funciona en testing
- Número: variable por sesión
```

### Opción B: Comprar número Twilio (Recomendado)
```
1. En Twilio, ve a: "Messaging" → "Phone Numbers"
2. Click "Buy a number"
3. Busca número de Colombia/Venezuela
4. Costo: ~$1/mes USD
5. Compra el número
```

### Opción C: Usar tu número personal (Mejor)
```
1. Contacta a Twilio Support
2. Solicita "Whatsapp on your own number"
3. Sube copia de ID
4. Espera aprobación (1-3 días)
5. Usa tu 3005444049 directamente
```

---

## ⚙️ PASO 4: API Keys y Configuración (10 minutos)

### Obtener credenciales:

1. En Twilio dashboard
2. Ve a: **Account** → **API Keys & tokens**
3. Copia estos valores:
   ```
   ACCOUNT_SID = ACxxxxxxxxxxxxxxxxx
   AUTH_TOKEN = xxxxxxxxxxxxxxx
   WHATSAPP_NUMBER = +1415523xxxx (tu número Twilio)
   ```

4. Anade a tu archivo `.env`:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxx
   TWILIO_WHATSAPP_NUMBER=+1415523xxxx
   WHATSAPP_PLATFORM=twilio
   ```

---

## 📝 PASO 5: Código del Servidor (Integración)

Tu `server.js` ya tiene soporte Twilio integrado. Solo necesitas:

```javascript
// El handler ya existe en whatsapp-handler.js
// Twilio enviará webhooks a: /api/whatsapp/webhook

// Configurar webhook en Twilio:
/*
1. En Twilio, ve a: Messaging → WhatsApp
2. Busca: "When a message comes in"
3. URL: https://tuurl.com/api/whatsapp/webhook
4. Método: POST
5. Save
*/
```

---

## 🧪 PASO 6: Probar Conexión (15 minutos)

### Test 1: Enviar mensaje de prueba

```javascript
// En Node.js, ejecuta esto localmente:

const twilio = require('twilio');
const client = twilio(
  'ACxxxxxxxxxxxxxxxxx',
  'xxxxxxxxxxxxxxx'
);

client.messages.create({
  from: 'whatsapp:+1415523xxxx',
  to: 'whatsapp:+573005444049',
  body: 'Hola! This is a test message from Twilio'
})
.then(message => console.log('Enviado:', message.sid))
.catch(err => console.error('Error:', err));
```

**Esperado:** Recibes mensaje en tu WhatsApp ✅

### Test 2: Recibir mensaje

1. Envía un mensaje a tu número Twilio desde tu WhatsApp
2. El servidor debe procesar en `/api/whatsapp/webhook`
3. Debería responder automáticamente
4. Verifica en `database.json`

---

## 🤖 PASO 7: Lógica Personalizada

Twilio es más flexible. Puedes crear respuestas complejas:

```javascript
// En whatsapp-handler.js, modifica processMessage()

function processMessage(userMessage, phoneNumber) {
    const normalized = sanitizeInput(userMessage);
    
    // Lógica de precio
    if (normalized.includes('cocina') && normalized.includes('precio')) {
        return {
            type: 'quote',
            response: 'Una cocina integral a medida cuesta de $8.000.000 a $20.000.000 COP, según materiales. ¿Quieres detalles?',
            confidence: 0.9
        };
    }
    
    // Agendar cita
    if (normalized.includes('agendar') || normalized.includes('cita')) {
        return {
            type: 'appointment',
            response: 'Me encantaría! Estamos en Medellín. Disponible: Lunes-Viernes 8am-6pm, Sábados 9am-2pm. ¿Qué día prefieres?',
            confidence: 0.85
        };
    }
    
    // Default
    return {
        type: 'generic',
        response: 'Gracias por escribir. Un especialista te responderá a breve. 🔧',
        confidence: 0.6
    };
}
```

---

## 💾 PASO 8: Ver Mensajes en Admin

Las conversaciones se guardan automáticamente:

1. Abre `admin-panel.html`
2. Pestaña **"Cotizaciones"**
3. Busca cliente por número
4. Click **"Ver Notas"**
5. Verás histórico de WhatsApp completo ✅

---

## 📊 Monitoreo & Estadísticas

### Status del servidor
```
GET http://localhost:3001/api/status
```

Retorna:
```json
{
  "status": "online",
  "whatsappMessages": 45,
  "quotes": 12,
  "reviews": 8,
  "uptime": 3600
}
```

### Estadísticas WhatsApp
```
GET http://localhost:3001/api/whatsapp/stats
```

Retorna:
```json
{
  "totalMessages": 45,
  "quotesWithChat": 12,
  "averageMessagesPerQuote": 3
}
```

---

## 🛠️ Troubleshooting Twilio

### "No recibo mensajes"
1. Verifica que webhook esté configurado en Twilio
2. El server está corriendo: `npm start` ?
3. Logs del servidor: mira la console

### "Error: ACCOUNT_SID no definido"
1. Verifica `.env` tiene variables correctas
2. Reinicia el servidor
3. Verifica que `require('dotenv').config()` esté en server.js

### "Número Twilio rechaza mensajes"
1. Verifica que está en WhatsApp
2. Verifica que es una zona soportada
3. Contacta soporte Twilio

---

## 💰 Costos Twilio

| Item | Costo |
|------|-------|
| Mensajes enviados | $0.0079 USD c/u |
| Mensajes recibidos | $0.009 USD c/u |
| Número de teléfono | $1 USD/mes |
| Account | Gratis |

**Ejemplo:** 500 mensajes/mes = ~$4 USD/mes

---

## 🎯 Próximos Pasos

- [ ] Crear cuenta Twilio
- [ ] Conectar WhatsApp
- [ ] Configurar webhook
- [ ] Probar envío/recibimiento
- [ ] Personalizar respuestas
- [ ] Monitor en admin panel

---

## ⚡ Referencia Rápida

```env
# .env para Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+1415523xxxx
WHATSAPP_PLATFORM=twilio
```

```bash
# Iniciar servidor
npm install twilio
npm start
```

```javascript
// Test en Node REPL
node
> const twilio = require('twilio');
> const client = twilio('SID', 'TOKEN');
> // ... código de envío
```

---

**Twilio vs ManyChat:**
- **Rápido + Fácil:** ManyChat (15 mins)
- **Profesional + Flexible:** Twilio (1 hora)

Elige según tus necesidades. ¡Ambos funcionan perfectamente!

