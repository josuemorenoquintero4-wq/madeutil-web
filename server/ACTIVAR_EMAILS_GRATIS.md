# 📧 ACTIVAR EMAILS GRATIS - MADE UTIL

## ✅ NOTIFICACIONES A: madeutilantioquia@gmail.com

---

## 🎯 LO QUE NECESITAS (5 MINUTOS):

### PASO 1: Conseguir Contraseña de Aplicación de Gmail

Gmail NO permite usar tu contraseña normal por seguridad.  
Necesitas crear una "App Password" (contraseña de aplicación).

#### 1.1 Ir a tu cuenta de Google
```
https://myaccount.google.com/security
```

#### 1.2 Activar verificación en 2 pasos (si no está activa)
- Buscar "Verificación en 2 pasos"
- Activar (necesario para app passwords)
- Verificar con tu celular

#### 1.3 Crear App Password
- Buscar "Contraseñas de aplicaciones" o "App Passwords"
- Click en "Seleccionar app" → "Correo"
- Click en "Seleccionar dispositivo" → "Otro (nombre personalizado)"
- Escribir: "Made Util Server"
- Click "Generar"

#### 1.4 Copiar la contraseña
Te mostrará algo como: **abcd efgh ijkl mnop**  
(sin espacios sería: abcdefghijklmnop)

**IMPORTANTE:** Guárdala, solo la muestran una vez.

---

## PASO 2: Crear archivo .env

### 2.1 Abrir PowerShell o CMD en la carpeta server:
```bash
cd c:\Users\User\Desktop\MADEUTIL\web\final\server
```

### 2.2 Crear/editar archivo .env:
```bash
notepad .env
```

### 2.3 Pegar esto (reemplazar XXXX con tu contraseña):
```env
# Email Configuration
EMAIL_USER=madeutilantioquia@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop

# Admin Phone (para SMS futuro)
ADMIN_PHONE=+573005444049

# Server
PORT=3001
SESSION_SECRET=madeutil_secret_key_2024
BASE_URL=http://localhost:3001
```

**NOTA:** La contraseña es la que generaste en PASO 1.4 (16 caracteres sin espacios)

### 2.4 Guardar y cerrar

---

## PASO 3: Actualizar server.js

### 3.1 Abrir server.js
```
c:\Users\User\Desktop\MADEUTIL\web\final\server\server.js
```

### 3.2 Agregar al INICIO del archivo (línea 1):
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

### 3.3 Guardar

---

## PASO 4: Instalar dotenv (si no está)

```bash
cd c:\Users\User\Desktop\MADEUTIL\web\final\server
npm install dotenv
```

---

## PASO 5: Reiniciar servidor

### 5.1 Detener servidor actual
En la terminal donde está corriendo: **Ctrl+C**

### 5.2 Iniciar de nuevo
```bash
node server.js
```

### 5.3 Verificar en consola
Debería aparecer:
```
✓ Notificaciones por email habilitadas
✓ Base de datos inicializada
...
```

Si dice **"✓ Notificaciones por email habilitadas"** → **¡LISTO!**

---

## PASO 6: PROBAR 🎉

### 6.1 Ir al formulario
```
http://localhost:3001/solicitar-proyecto.html
```

### 6.2 Llenar con datos de prueba:
- Nombre: "Prueba Email"
- Teléfono: "3001234567"
- Email: "test@test.com"
- Ciudad: "Medellín"
- Marcar "Cocina"
- Presupuesto: "$20M - $35M"
- Click "Enviar Solicitud"

### 6.3 Esperar 10-30 segundos

### 6.4 ¡Revisar tu email madeutilantioquia@gmail.com!

Deberías recibir email con asunto:
```
🔔 Nueva Solicitud: Prueba Email - Cocina
```

---

## ✅ SI TODO SALIÓ BIEN:

- ✅ Email llega en 10-30 segundos
- ✅ Formato bonito con tabla de datos
- ✅ Link al panel admin
- ✅ **100% GRATIS PARA SIEMPRE**

---

## ❌ TROUBLESHOOTING

### Problema: "Invalid login"
**Solución:**
- Verificar que activaste verificación en 2 pasos
- Crear nueva App Password
- Copiar SIN espacios en .env

### Problema: Email no llega
**Solución:**
1. Revisar carpeta SPAM
2. Verificar consola del servidor (debe decir "✅ Email enviado")
3. Verificar EMAIL_PASSWORD en .env (sin espacios)

### Problema: "Less secure app access"
**Solución:**
- Usar App Password (no contraseña normal)
- App Passwords solo funciona si tienes verificación en 2 pasos

### Problema: Email llega pero va a spam
**Solución:**
1. Marcar como "No es spam"
2. Agregar tu propio email a contactos
3. Gmail aprenderá que no es spam

---

## 📧 EJEMPLO DE EMAIL QUE RECIBIRÁS:

```
De: Made Util Notificaciones
Para: madeutilantioquia@gmail.com
Asunto: 🔔 Nueva Solicitud: Juan Pérez - Cocina

╔══════════════════════════════════════╗
║     🔔 NUEVA SOLICITUD               ║
║        Made Util                     ║
╚══════════════════════════════════════╝

DETALLES DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━

👤 Nombre:       Juan Pérez
📱 Teléfono:     3001234567
📧 Email:        juan@email.com
📍 Ciudad:       Medellín
🎨 Categorías:   Cocina, Closet
💰 Presupuesto:  $20M - $35M

📝 DESCRIPCIÓN:
Necesito una cocina moderna...

🕐 HORARIOS:
Lunes a viernes 5pm-7pm

─────────────────────────────────────
[Ver en Panel Admin] ← Botón clickeable
─────────────────────────────────────

Made Util - Carpintería Arquitectónica
Medellín, Colombia
Fecha: 14 de febrero de 2024, 1:45 a.m.
```

---

## 💰 COSTO

### Email con Gmail: **$0.00 USD - GRATIS PARA SIEMPRE**

- ❌ Sin costo mensual
- ❌ Sin límite de emails (razonable)
- ✅ Profesional
- ✅ Confiable
- ✅ Instantáneo

---

## 🔐 SEGURIDAD

### ¿Es seguro guardar la contraseña en .env?
✅ SÍ, porque:
1. Es una "App Password" no tu contraseña real
2. Solo tiene acceso a enviar emails
3. Puedes revocarla cuando quieras
4. El archivo .env NO se sube a GitHub (si usas git)

---

## 📱 PRÓXIMO PASO (OPCIONAL)

Si también quieres notificaciones en el celular:
- Puedo configurar **Telegram Bot** (gratis también)
- Te llega al celular como SMS pero gratis
- Toma 10 minutos más

**¿Te interesa? Avísame!**

---

**Creado:** 2026-02-14  
**¡Disfruta tus notificaciones gratis! 🎉**
