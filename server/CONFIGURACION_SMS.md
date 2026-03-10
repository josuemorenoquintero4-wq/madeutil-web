# 📱 CONFIGURACIÓN DE NOTIFICACIONES SMS - MADE UTIL

## 🎯 Objetivo
Enviar notificaciones SMS automáticas al admin (3005444049) cuando un cliente envía una solicitud desde el sitio web.

---

## 📋 Opción 1: Twilio (Recomendado)

### Paso 1: Crear cuenta en Twilio

1. Ir a [https://www.twilio.com/](https://www.twilio.com/)
2. Crear cuenta gratuita
3. Verificar tu número de teléfono (+57 300 544 4049)

### Paso 2: Obtener credenciales

Una vez en el dashboard de Twilio:

- **Account SID**: Aparece en el dashboard principal
- **Auth Token**: Click en "Show" para revelarlo
- **Phone Number**: Comprar número virtual (+57 xxx xxx xxxx)
  - Ir a Phone Numbers → Buy a Number
  - Seleccionar Colombia (+57)
  - Capabilities: SMS habilitado
  - Costo: ~$1 USD/mes

### Paso 3: Instalar dependencia Twilio

```bash
cd c:/Users/User/Desktop/MADEUTIL/web/final/server
npm install twilio
```

### Paso 4: Configurar variables de entorno

Crear archivo `.env` en `/server/`:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+57xxxxxxxxxx

# Admin Configuration
ADMIN_PHONE=+573005444049
BASE_URL=http://localhost:3001

# Server
PORT=3001
SESSION_SECRET=madeutil_secret_key_2024
```

### Paso 5: Actualizar server.js

Agregar al inicio del archivo `server.js`:

```javascript
require('dotenv').config();
```

Instalar dotenv si no está:

```bash
npm install dotenv
```

### Paso 6: Reiniciar servidor

```bash
node server.js
```

### Verificación

Cuando alguien envíe una solicitud desde la web, deberías ver en consola:

```
✓ Twilio SMS habilitado
📱 SMS enviado a +573005444049: SMxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Y recibir SMS en tu celular.

---

## 📋 Opción 2: WhatsApp Business API (Alternativa)

Si prefieres WhatsApp en lugar de SMS simple:

### Requisitos
- Cuenta WhatsApp Business verificada
- Facebook Business Manager
- Número dedicado para WhatsApp

### Setup
1. Ir a [https://business.whatsapp.com/](https://business.whatsapp.com/)
2. Seguir guía de verificación de negocio
3. Obtener API credentials
4. Usar librería `whatsapp-web.js` o Twilio WhatsApp API

**Código de ejemplo:**

```javascript
// Usando Twilio WhatsApp
await twilioClient.messages.create({
    from: 'whatsapp:+14155238886', // Twilio Sandbox
    to: 'whatsapp:+573005444049',
    body: messageText
});
```

---

## 📋 Opción 3: Email (Fallback)

Si por alguna razón SMS no funciona, se puede usar email como fallback.

### Paso 1: Instalar SendGrid o Nodemailer

```bash
npm install @sendgrid/mail
# o
npm install nodemailer
```

### Paso 2: Configurar

**Con SendGrid:**

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'admin@madeutil.com',
  from: 'noreply@madeutil.com',
  subject: '🔔 Nueva Solicitud Made Util',
  text: messageText,
  html: `<strong>${messageText}</strong>`,
};

await sgMail.send(msg);
```

**Con Nodemailer (Gmail):**

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-app-password' // No tu contraseña normal, sino app password
  }
});

await transporter.sendMail({
  from: 'noreply@madeutil.com',
  to: 'admin@madeutil.com',
  subject: '🔔 Nueva Solicitud',
  text: messageText
});
```

---

## 🧪 Modo de Prueba (Actual)

**Actualmente el sistema está en modo simulado:**

Cuando llega una solicitud, en lugar de enviar SMS real, se imprime en consola:

```
📱 SMS (SIMULADO - Twilio no configurado):
Para: +573005444049
Mensaje:
🔔 NUEVA SOLICITUD MADE UTIL

👤 Juan Pérez
📍 Medellín
📱 3001234567
🎨 Cocina, Closet
💰 $20M - $35M

Ver en admin: http://localhost:3001/admin.html
──────────────────────────────────────────────────
```

**Esto permite:**
✓ Desarrollar sin costo
✓ Ver qué mensajes se enviarían
✓ Testear flujo completo
✓ Activar SMS reales solo cuando esté listo

---

## 🚀 Puesta en Producción

### Checklist antes de activar SMS reales:

- [ ] Cuenta Twilio creada y verificada
- [ ] Número virtual colombiano comprado
- [ ] Credenciales en archivo `.env`
- [ ] Paquete `twilio` instalado
- [ ] Número admin (+573005444049) verificado en Twilio
- [ ] Prueba enviando SMS desde Twilio Console
- [ ] Variables de entorno cargadas con `dotenv`
- [ ] Servidor reiniciado

### Costos Twilio (Colombia)

- **Número virtual:** ~$1 USD/mes
- **SMS saliente:** ~$0.015 USD por SMS
- **SMS entrante:** ~$0.0075 USD por SMS

**Estimado mensual con 50 solicitudes:**
```
Número: $1.00
SMS (50 × $0.015): $0.75
TOTAL: ~$1.75 USD/mes
```

---

## 🔍 Troubleshooting

### Error: "Cannot find module 'twilio'"
```bash
cd server
npm install twilio
```

### Error: "Invalid credentials"
- Verificar Account SID y Auth Token en Twilio Console
- Asegurar que estén correctamente copiados en `.env`

### SMS no llegan
- Verificar que el número admin esté verificado en Twilio
- Revisar Twilio Console → Messaging Logs
- Confirmar formato E.164: `+573005444049`

### "Unverified number"
- En modo de prueba, solo números verificados manualmente
- Upgrade a cuenta paga para números sin verificar

---

## 📞 Contacto y Soporte

**Admin Made Util:**
📱 +57 300 544 4049

**Twilio Support:**
[https://support.twilio.com](https://support.twilio.com)

---

**Creado:** 2026-02-14  
**Última actualización:** 2026-02-14
