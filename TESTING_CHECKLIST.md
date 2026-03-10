# ✅ CHECKLIST DE VERIFICACIÓN - MADE UTIL v4.0

## 🧪 CÓMO PROBAR TODO EL SISTEMA

---

## 1️⃣ PROBAR ASISTENTE DE IA

### Abrir sitio web
```
http://localhost:3001/index.html
```

### Verificar:
- [ ] Aparece botón flotante "¿Ayuda?" (bottom-right)
- [ ] Al hacer hover muestra texto
- [ ] Click abre ventana de chat
- [ ] Mensaje de bienvenida visible

### Probar conversación:
```
Escribir: "cuanto cuesta una cocina"
Esperar: Respuesta con rangos de precios

Escribir: "cuanto demora"
Esperar: Respuesta con proceso de 6 pasos

Escribir: "que materiales usan"
Esperar: Respuesta con Arauco, Masisa, Blum

Escribir: "necesito el whatsapp urgente"
Esperar: Respuesta pidiendo justificación
```

### ✅ ÉXITO si:
- Chat responde correctamente
- No hay errores en consola del navegador
- Animaciones funcionan suavemente

---

## 2️⃣ PROBAR FORMULARIO DE SOLICITUD

### Abrir formulario
```
http://localhost:3001/solicitar-proyecto.html
```

### Llenar datos de prueba:
- **Nombre:** Test Usuario
- **Teléfono:** 3001234567
- **Email:** test@email.com
- **Ciudad:** Medellín
- **Categorías:** Marcar Cocina + Closet
- **Descripción:** Proyecto de prueba del sistema
- **Presupuesto:** $20M - $35M
- **Tiempo:** 1-2 meses
- **Horarios:** Lunes a viernes 5pm-7pm

### Click "Enviar Solicitud"

### Verificar en CONSOLA DEL SERVIDOR:
```
Debería aparecer:

📱 SMS (SIMULADO - Twilio no configurado):
Para: +573005444049
Mensaje:
🔔 NUEVA SOLICITUD MADE UTIL

👤 Test Usuario
📍 Medellín
📱 3001234567
🎨 Cocina, Closet
💰 $20M - $35M
...
```

### ✅ ÉXITO si:
- Formulario se resetea
- Mensaje de éxito aparece
- En consola del servidor aparece notificación SMS simulada
- Sin errores

---

## 3️⃣ PROBAR PANEL ADMIN

### Abrir admin
```
http://localhost:3001/admin.html
```

O desde cualquier página: **Presionar Ctrl+I**

### Login:
- **Usuario:** admin
- **Contraseña:** granos2025

### Verificar Dashboard:
- [ ] Contador "Leads Hoy" muestra número > 0
- [ ] Gráfico de barras renderizado
- [ ] Terminal muestra actividad

### Ir a CRM:
- [ ] Click en "2. CRM CLIENTES"
- [ ] Tabla carga con datos reales
- [ ] Aparece el lead "Test Usuario" que enviaste

### Click en el lead:
- [ ] Aparece confirmación con detalles
- [ ] Pregunta si crear tarea
- [ ] Acepta → Llena datos de tarea
- [ ] Tarea se crea correctamente

### ✅ ÉXITO si:
- Admin carga sin errores
- Leads se ven en tabla
- Se pueden crear tareas

---

## 4️⃣ PROBAR SISTEMA DE INGENIERÍA

### Desde admin:
- [ ] Click en "⚙ INGENIERÍA" (botón en sidebar)
- [ ] Carga página ingenieria.html

### Verificar secciones:
- [ ] **01. TABLEROS** - Lista de melaminas con precios
- [ ] **02. HERRAJES** - Cards de Blum/Hettich
- [ ] **03. MOTOR DE COSTEO** - Calculadora funcional
- [ ] **04. LOGÍSTICA** - Tabla de zonas y fletes
- [ ] **05. PROTOCOLOS** - Procesos técnicos
- [ ] **06. INVENTARIO** - Conectado al backend

### Probar calculadora:
- Seleccionar tablero
- Número de láminas: 3
- Desperdicio: 10%
- Honorarios: 25%
- Click "CALCULAR PRESUPUESTO"

### ✅ ÉXITO si:
- Todas las secciones cargan
- Calculadora muestra resultado
- Sin errores 404

---

## 5️⃣ PROBAR PORTAL DE TRABAJADORES

### Abrir worker portal:
```
http://localhost:3001/worker-portal.html
```

### Login como Josue:
- **Usuario:** josue
- **Contraseña:** worker2024

### Verificar:
- [ ] Ve solo SUS tareas (no todas)
- [ ] Puede cambiar estado de tarea
- [ ] Puede subir fotos
- [ ] Botón "Completar" funciona

### Logout y login como Camilo:
- **Usuario:** camilo
- **Contraseña:** worker2024

### ✅ ÉXITO si:
- Cada worker ve solo sus tareas
- Pueden actualizar estados
- Admin ve cambios en tiempo real

---

## 6️⃣ VERIFICAR NOTIFICACIONES SMS

### En consola del servidor:
Después de enviar solicitud, debería aparecer:

```bash
✅ Admin notificado via SMS
📱 SMS (SIMULADO - Twilio no configurado):
Para: +573005444049
Mensaje:
🔔 NUEVA SOLICITUD MADE UTIL
...
```

### Para activar SMS REALES:
Ver archivo: `/server/CONFIGURACION_SMS.md`

### ✅ ÉXITO si:
- Aparece log en consola
- Mensaje tiene formato correcto
- Incluye datos del cliente

---

## 7️⃣ VERIFICAR API ENDPOINTS

### Desde navegador o Postman:

**Stats de leads:**
```
GET http://localhost:3001/api/leads/stats
```
Debería devolver: `{ total: X, nuevo: Y, ... }`

**Listar leads:**
```
GET http://localhost:3001/api/leads
```
Requiere autenticación (login primero)

**Status SMS:**
```
GET http://localhost:3001/api/sms/status
```
Debería devolver:
```json
{
  "enabled": false,
  "adminPhone": "+573005444049",
  "configured": false,
  "note": "SMS en modo simulado..."
}
```

### ✅ ÉXITO si:
- Endpoints responden
- JSON válido
- Sin errores 500

---

## 8️⃣ VERIFICAR ARCHIVOS CREADOS

### Nuevos archivos JavaScript:
```bash
ls js/ai-assistant.js
ls js/admin-dashboard.js
```

### Nuevos archivos CSS:
```bash
ls css/ai-assistant.css
```

### Backend:
```bash
ls server/routes/sms.js
ls server/CONFIGURACION_SMS.md
```

### Documentación:
```bash
ls ESPECIFICACIONES_COMPLETAS.md
ls RESUMEN_CAMBIOS_v4.0.md
ls TESTING_CHECKLIST.md
```

### ✅ ÉXITO si:
- Todos los archivos existen
- Sin errores de sintaxis

---

## 🐛 TROUBLESHOOTING

### ❌ Asistente IA no aparece
**Solución:**
- Verificar que se incluyó `<script src="js/ai-assistant.js"></script>`
- Revisar consola del navegador por errores
- Verificar ruta del archivo

### ❌ Admin no muestra leads
**Solución:**
- Verificar que servidor esté corriendo: `http://localhost:3001`
- Revisar consola del navegador → Network tab
- Login correcto: admin / granos2025

### ❌ SMS no llegan
**Solución:**
- NORMAL: Sistema está en modo simulado
- Ver logs en consola del servidor
- Para activar SMS reales → Configurar Twilio

### ❌ Error "Cannot find module 'twilio'"
**Solución:**
```bash
cd server
npm install twilio
```
(Opcional, solo si quieres activar SMS)

### ❌ Puerto 3001 en uso
**Solución:**
1. Encontrar proceso: `netstat -ano | findstr :3001`
2. Matar proceso: `taskkill /PID [número] /F`
3. Reiniciar: `node server.js`

---

## 📊 RESUMEN DE FUNCIONALIDADES

### ✅ Implementado y funcionando:
- [x] Asistente IA conversacional
- [x] Sistema de solicitudes con DB
- [x] Admin dashboard en tiempo real
- [x] CRM con leads reales
- [x] Creación de tareas desde admin
- [x] Portal de trabajadores
- [x] Sistema de ingeniería (solo admin)
- [x] Notificaciones SMS (simuladas)
- [x] Autenticación y roles
- [x] Documentación completa

### ⏳ Pendiente configuración:
- [ ] Twilio para SMS reales (5 min, $1.75/mes)
- [ ] Deploy a servidor VPS (futuro)
- [ ] Dominio personalizado (futuro)

---

## 🎯 PRÓXIMOS PASOS

### Inmediato (hoy):
1. Probar cada sección de este checklist
2. Enviar solicitud de prueba
3. Verificar que aparece en admin
4. Crear tarea de prueba

### Esta semana:
1. Configurar cuenta Twilio
2. Activar SMS reales
3. Probar flujo completo con SMS

### Próximo mes:
1. Deploy a servidor de producción
2. Configurar dominio
3. SSL/HTTPS
4. Backup automático DB

---

## 📞 SOPORTE

**Documentación:**
- `ESPECIFICACIONES_COMPLETAS.md` - Sistema completo explicado
- `RESUMEN_CAMBIOS_v4.0.md` - Qué se cambió
- `server/CONFIGURACION_SMS.md` - Setup Twilio

**Credenciales:**
- Admin: admin / granos2025
- Workers: josue o camilo / worker2024

**URLs locales:**
- Frontend: http://localhost:3001
- Admin: http://localhost:3001/admin.html
- Workers: http://localhost:3001/worker-portal.html
- Ingeniería: http://localhost:3001/ingenieria.html

---

**¡Sistema listo para usar! 🚀**

_Actualizado: 2026-02-14_
