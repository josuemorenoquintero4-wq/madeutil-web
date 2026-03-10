# 📱 ACTIVAR SMS REALES - GUÍA RÁPIDA

## ⚠️ IMPORTANTE
Actualmente el sistema está en **MODO SIMULADO**. Las notificaciones se ven en la **consola del servidor**, NO llegan a tu celular.

Para recibir SMS reales en el 3005444049, sigue estos pasos:

---

## PASO 1: Crear cuenta en Twilio (5 minutos)

### 1.1 Ir a Twilio
```
https://www.twilio.com/try-twilio
```

### 1.2 Crear cuenta gratis
- Nombre
- Email
- Contraseña
- Verificar email

### 1.3 Verificar tu número
- Te pedirá verificar tu celular: **3005444049**
- Recibirás un código SMS de verificación
- Ingresarlo

---

## PASO 2: Obtener credenciales (2 minutos)

### 2.1 En el Dashboard de Twilio
Verás algo así:

```
Account SID:    ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Auth Token:     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2.2 Copiar esos valores
- Click en "Show" para revelar Auth Token
- Copiar ambos valores

---

## PASO 3: Comprar número virtual (2 minutos)

### 3.1 En Twilio Console:
- Ir a: **Phone Numbers** → **Buy a Number**
- Seleccionar país: **Colombia** (+57)
- Capabilities: Marcar **SMS**
- Click **Search**

### 3.2 Comprar número
- Aparecerán números disponibles
- Elegir uno (ej: +57 xxx xxx xxxx)
- Click **Buy**
- Costo: ~$1 USD/mes

### 3.3 Copiar número
Ejemplo: +573001234567

---

## PASO 4: Configurar en el servidor (3 minutos)

### 4.1 Crear archivo .env

En la carpeta `/server/` crear archivo llamado `.env`

```bash
cd c:\Users\User\Desktop\MADEUTIL\web\final\server
notepad .env
```

### 4.2 Pegar esto (con TUS datos):

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+573001234567

# Admin Configuration
ADMIN_PHONE=+573005444049

# Server
PORT=3001
SESSION_SECRET=madeutil_secret_key_2024
BASE_URL=http://localhost:3001
```

**IMPORTANTE:** Reemplazar las X con tus valores reales de Twilio

---

## PASO 5: Instalar dependencias (1 minuto)

```bash
cd c:\Users\User\Desktop\MADEUTIL\web\final\server
npm install twilio dotenv
```

---

## PASO 6: Actualizar server.js

### 6.1 Abrir server.js

Agregar al INICIO del archivo (línea 1):

```javascript
require('dotenv').config();
```

El archivo debería empezar así:

```javascript
require('dotenv').config();

/* ==============================================
   MADE UTIL — EXPRESS SERVER v3.0
   ...
```

---

## PASO 7: Reiniciar servidor

### 7.1 Detener servidor actual
En la terminal donde está corriendo, presionar: `Ctrl+C`

### 7.2 Iniciar de nuevo
```bash
node server.js
```

### 7.3 Verificar en consola
Debería aparecer:

```
✓ Twilio SMS habilitado
✓ Base de datos inicializada
...
```

Si dice "✓ Twilio SMS habilitado" → **¡LISTO!**

---

## PASO 8: PROBAR

### 8.1 Ir al formulario
```
http://localhost:3001/solicitar-proyecto.html
```

### 8.2 Llenar y enviar

### 8.3 Esperar 5-10 segundos

### 8.4 ¡Revisar tu celular 3005444049!

Deberías recibir SMS:

```
🔔 NUEVA SOLICITUD MADE UTIL

👤 [Nombre]
📍 [Ciudad]
📱 [Teléfono]
🎨 [Categorías]
💰 [Presupuesto]

Ver en admin: [URL]
```

---

## ✅ VERIFICACIÓN

### Si todo salió bien:
- ✅ Servidor dice "✓ Twilio SMS habilitado"
- ✅ Al enviar solicitud, recibes SMS en 5-10 segundos
- ✅ SMS con formato correcto

### Si no funciona:

**Revisar en Twilio Console:**
- Phone Numbers → Messaging Logs
- Ahí verás si se envió el SMS y cualquier error

**Errores comunes:**
- ❌ Number not verified → Verificar número en Twilio
- ❌ Invalid credentials → Revisar Account SID y Auth Token
- ❌ Insufficient funds → Agregar crédito en Twilio

---

## 💰 COSTOS

### Twilio Colombia:
- **Número virtual:** $1.00 USD/mes
- **SMS saliente:** $0.015 USD por SMS
- **Crédito inicial gratis:** $15.50 USD (trial)

### Con 50 solicitudes/mes:
```
Número mensual:    $1.00
50 SMS × $0.015:   $0.75
─────────────────────────
TOTAL:              $1.75 USD/mes
```

**Muy barato y te llega cada solicitud al celular!**

---

## 🔍 TROUBLESHOOTING

### Problema: "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### Problema: "Cannot find module 'twilio'"
```bash
npm install twilio
```

### Problema: SMS no llegan
1. Verificar Twilio Console → Messaging Logs
2. Verificar formato número: +573005444049 (con +57)
3. Verificar cuenta Twilio tiene crédito

### Problema: "Unverified number"
En modo trial, solo números verificados manualmente.
Solución: Upgrade a cuenta paga (no cobran hasta que uses)

---

## 📞 SOPORTE

**Twilio Support:**
https://support.twilio.com

**Video tutorial:**
https://www.youtube.com/watch?v=fV1AdxvOUZ0

---

## ⏱️ TIEMPO TOTAL: ~15 minutos

**¿Vale la pena?** ¡Definitivamente! Recibirás cada solicitud al instante en tu celular.

---

**Creado:** 2026-02-14  
**Última actualización:** 2026-02-14
