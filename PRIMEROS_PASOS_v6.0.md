# 🚀 PRIMEROS PASOS — v6.0 (5 Minutos)

## ⏱️ Acciones Inmediatas (Ahora)

### 1. Abre `index.html` en el navegador

```
c:\Users\User\Desktop\MADEUTIL\web\visual studio code\final\final\final\index.html
```

**Verifica:**
- ✅ Los comentarios se deslizan automáticamente en "Lo que dicen nuestros clientes"
- ✅ Hay un botón "Dejar mi reseña" funcional
- ✅ Al hacerle clic, se abre un modal limpio
- ✅ Los avatares de Google muestran iniciales

**Si NO ves esto:**
- Abre DevTools: F12 → Console
- ¿Hay errores en rojo? Anota los errores
- Verifica que los archivos `.js` estén en la carpeta `js/`

---

### 2. Abre `admin-panel.html` en el navegador

```
c:\Users\User\Desktop\MADEUTIL\web\visual studio code\final\final\final\admin-panel.html
```

**Acceso:**
- Usuario: (deja en blanco o cualquiera)
- Contraseña: `123`

**Verifica estas pestañas:**
- ✅ Portafolio (ya debería estar)
- ✅ Preguntas Frecuentes (ya debería estar)
- ✅ **Reseñas** ← NUEVA pestaña
- ✅ **Cotizaciones** ← NUEVA pestaña (con subsecciones Activas/Archivadas)

**Si una pestaña NO aparece:**
- Actualiza la página (Ctrl+F5)
- Limpia cache: DevTools → Application → Clear All

---

### 3. Prueba la Edición de Reseñas (Admin)

1. Haz clic en pestaña **Reseñas**
2. Deberías ver una o más reseñas de ejemplo
3. Haz clic en **Editar** en cualquiera
4. Se abre un modal con el formulario
5. Cambia las **estrellas** (haz clic en una estrella)
6. Modifica el **texto**
7. Haz clic en **Guardar**
8. Vuelve a la homepage (`index.html`)
9. Recarga la página
10. **Verifica:** Tu cambio debe estar allí

---

### 4. Agrega un Comentario Nuevo (Homepage)

1. En `index.html`, scroll a "Lo que dicen nuestros clientes"
2. Haz clic en **"Dejar mi reseña"** (botón marrón)
3. Se abre modal:
   - Nombre: "Tu Nombre"
   - Proyecto: "Cocina Integral — Tu Barrio"
   - Experiencia: "Escribe algo bueno 😉"
   - Estrellas: Selecciona 5
4. Haz clic en **PUBLICAR**
5. Se cierra el modal
6. **Verifica:** El comentario está al tope del carrusel
7. Cierra y abre el navegador nuevamente
8. **Verifica:** El comentario sigue ahí (se guardó en localStorage)

---

### 5. Explora Cotizaciones (Admin)

1. En `admin-panel.html`, haz clic en pestaña **Cotizaciones**
2. Deberías ver dos secciones:
   - **Cotizaciones Activas** (vacía si no hay)
   - **Cotizaciones Archivadas** (vacía si no hay)
3. Llena el formulario de solicitud:
   - Abre `solicitud.html` (o busca el formulario de cotización)
   - Completa: Nombre, teléfono, ciudad, apartamento, tamaño, categorías
   - Envía
4. Vuelve a admin
5. **Verifica:** Tu cotización aparece en "Activas"

---

## ✨ Ahora Que Funcionan Las 3 Cosas Principales

### Próximo Paso: **WhatsApp Integration**

Lee este archivo:
```
/INTEGRACION_WHATSAPP_GUIA.md
```

**En 30 minutos podrás:**
- Responder automáticamente en WhatsApp
- Los clientes preguntan y la IA responde
- Las notas se guardan en el "Blog de Notas" de la cotización

---

## 📊 Tu Checklist Personal

Marca aquí mientras pruebas:

```
□ He abierto index.html
□ Veo comentarios deslizándose
□ Pude agregar un comentario nuevo
□ He abierto admin-panel.html (password 123)
□ Veo la pestaña Reseñas
□ He editado una reseña desde admin
□ El cambio aparece en index.html
□ Veo la pestaña Cotizaciones
□ Pude agregar una cotización
□ Aparece en "Cotizaciones Activas"
```

Si todos tienen ✅ → **¡PERFECTO! Sistema funcionando 100%**

---

## 🎯 Plan de Acción Semanal

### **Hoy**
- ✅ Verificar que funcione todo (5 mins)
- → Documentos de referencia: `RESUMEN_v6.0.md`, `MAPA_CAMBIOS_v6.0.md`

### **Mañana**
- [ ] Implementar WhatsApp con **ManyChat** (30 mins)
- → Guía: `INTEGRACION_WHATSAPP_GUIA.md`
- → Tu número: 3005444049

### **Esta Semana**
- [ ] Hacer backup de datos actuales
- [ ] Probar en móvil (iPhone + Android)
- [ ] Solicitar feedback inicial a clientes

### **Próxima Semana**
- [ ] Considerar: exportar cotizaciones a PDF
- [ ] Considerar: notificaciones por email
- [ ] Considerar: dashboard con estadísticas

---

## 🆘 "Algo No Funciona" — Rápida Solución

### Problema: "No veo comentarios deslizándose"
**Solución: 30 segundos**
```
F12 → Console → Escribe:
initCommentCarousel()
→ Si no da error, funciona. Si da error, copia el error y busca en INTEGRACION_v6.0.md
```

### Problema: "Admin no carga reseñas"
**Solución: 30 segundos**
```
F12 → Console → Escribe:
renderReviewsAdmin()
→ Si funciona, la pestaña Reseñas debe actualizarse
```

### Problema: "Cotizaciones no aparecen"
**Solución: 1 minuto**
```
F12 → Console → Escribe:
getActiveQuotes()
→ Si retorna [  ] vacío → no hay cotizaciones guardadas
→ Si retorna error → problema en quotes-advanced.js
```

### Problema: "LocalStorage no guarda datos"
**Solución: 2 minutos**
```
- Cierra modo incógnito (si estás en él)
- Aceptar cookies del navegador
- Verificar: Configuración > Privacidad > Permitir localStorage
- Si aún no: Probar en outro navegador
```

---

## 🔐 Recordar

```
NO COMPARTAS:
- Password admin: 123
  (Cambiar en admin-panel.html línea ~950 si es necesario)

NO BORRES:
- Los archivos .js nuevos
- Los cambios en index.html, admin-panel.html, style.css

RESPALDA:
- localStorage regularmente (o exportar JSON)
- Las imágenes subidas en /uploads
```

---

## 📞 Documentación de Referencia Rápida

| Necesitas | Archivo |
|-----------|---------|
| Resumen ejecutivo | `RESUMEN_v6.0.md` |
| Guía detallada | `INTEGRACION_v6.0.md` |
| Mapa de cambios | `MAPA_CAMBIOS_v6.0.md` |
| WhatsApp setup | `INTEGRACION_WHATSAPP_GUIA.md` |
| Testing completo | `CHECKLIST_v6.0.md` |
| Este archivo | `PRIMEROS_PASOS_v6.0.md` ← Estás aquí |

---

## ✅ Confirmación Final

**Si completaste los 5 pasos principales:**

```
✔️ Todo funciona correctamente
✔️ Los datos se guardan
✔️ El diseño está centrado
✔️ El admin puede controlar reseñas y cotizaciones
✔️ Estás listo para WhatsApp
```

**Siguiente paso:**
→ Lee `INTEGRACION_WHATSAPP_GUIA.md` (20 minutes)
→ Elige entre ManyChat, Twilio, o Meta API
→ Setup en 30 minutos

---

**¡Bienvenido a v6.0! 🎉**

Cualquier duda → Revisa los documentos de referencia arriba.

