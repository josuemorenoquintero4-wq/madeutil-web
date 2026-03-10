# ✅ Checklist de Verificación v6.0

## Antes de Usar en Producción

### **Carrusel de Comentarios**
- [ ] Abierto `index.html` en navegador
- [ ] Desplazado a "Lo que dicen nuestros clientes"
- [ ] Comentarios se deslizan cada ~5 segundos
- [ ] Los avatares muestran iniciales (Google API)
- [ ] Botón "Dejar mi reseña" abre modal
- [ ] Puedo seleccionar estrellas (1-5)
- [ ] Puedo escribir nombre, proyecto, opinión
- [ ] Al guardar, el comentario aparece en el carrusel
- [ ] Recargo la página y el comentario sigue ahí (localStorage)

### **Admin - Gestión de Reseñas**
- [ ] Abierto `admin-panel.html`
- [ ] Password: `123` funciona
- [ ] Pestaña "Reseñas" visible
- [ ] Puedo ver todas las reseñas en una lista
- [ ] Cada reseña tiene botón "Editar"
- [ ] Cada reseña tiene un "Ojo" (ocultar/mostrar)
- [ ] Click en "Editar" abre modal con formulario
- [ ] Puedo cambiar estrellas en el modal
- [ ] Puedo cambiar el texto de la reseña
- [ ] Al guardar, la reseña se actualiza en la lista
- [ ] Al guardar, la reseña se actualiza en `index.html`
- [ ] Click en "Ojo" oculta la reseña
- [ ] La reseña oculta sigue visible en admin pero NO en homepage

### **Cotizaciones - Activas y Archivadas**
- [ ] Pestaña "Cotizaciones" en admin existe
- [ ] Veo dos secciones: "Activas" y "Archivadas"
- [ ] Puedo ver encabezados: Cliente, Tel, Categorías, Fecha, Notas
- [ ] Cada cotización muestra los datos correctamente
- [ ] Puedo hacer clic en "Ver Notas" para abrir blog
- [ ] El blog muestra:
  - [ ] Nota original del cliente
  - [ ] Fecha de creación
  - [ ] Botón para agregar nota
  - [ ] Historial de conversaciones
- [ ] Puedo buscar cotizaciones (si hay búsqueda implementada)
- [ ] Puedo mover cotización de Activa a Archivada

### **Diseño Centrado**
- [ ] Headers de secciones están centrados (H2, H3)
- [ ] Subtítulos están centrados
- [ ] Botones de CTA están centrados
- [ ] Las galerías de imágenes están centradas
- [ ] Los cards están centrados
- [ ] Las secciones tienen márgenes iguales a los lados
- [ ] Nada está alineado a la izquierda incorrectamente
- [ ] Responsive en mobile, tablet y desktop

### **Integración de Scripts**
- [ ] `index.html` carga `comments-carousel.js`
- [ ] `index.html` carga `reviews-admin.js`
- [ ] `index.html` carga `quotes-advanced.js`
- [ ] `admin-panel.html` carga `reviews-admin.js`
- [ ] `admin-panel.html` carga `quotes-advanced.js`
- [ ] DevTools (F12) → Console NO muestra errores 404
- [ ] DevTools → Console NO muestra errores JavaScript rojos

### **LocalStorage**
- [ ] Los datos persisten después de recargar la página
- [ ] Los datos persisten después de cerrar y abrir navegador
- [ ] Los datos se sincronizan entre pestañas (abre 2 pestañas)
- [ ] Los datos funcionan en modo incógnito (si es necesario)

### **WhatsApp Integration (Próximo Paso)**
- [ ] Leído: `INTEGRACION_WHATSAPP_GUIA.md`
- [ ] Decision tomada: ¿ManyChat, Twilio, o Meta API?
- [ ] Número de teléfono guardado: 3005444049
- [ ] Servicio elegido en setup inicial
- [ ] IA responde mensajes WhatsApp automáticamente (si aplicable)

---

## Pruebas de Estrés

### **Prueba 1: Muchos Comentarios**
- [ ] Agrega 25 comentarios manualmente
- [ ] El sistema mantiene máximo 20 (los antiguos se descartan)
- [ ] El carrusel sigue siendo smooth

### **Prueba 2: Caracteres Especiales**
- [ ] Agrega un comentario con: `É Á "comillas" & ampersand`
- [ ] Se guarda correctamente
- [ ] Se muestra correctamente

### **Prueba 3: Búsqueda Compleja**
- [ ] Agrega cotización con: Nombre "Juan", Ciudad "Medellín", Categoría "Cocina"
- [ ] Busca por "juan"
- [ ] Busca por "medellín"
- [ ] Busca por "cocina"
- [ ] Todas las búsquedas encuentran el resultado

### **Prueba 4: Edición Rápida**
- [ ] Edita una reseña 5 veces seguidas
- [ ] No hay conflictos ni pérdida de datos
- [ ] Todos los cambios se guardan

---

## Solución de Problemas

### Si no ves comentarios:
```
1. F12 → Console
2. Escribe: localStorage.getItem('mu_comments')
3. ¿Retorna un array? Si no → localStorage está vacío
4. ¿Retorna error? → Hay problema con comments-carousel.js
```

### Si admin no carga reseñas:
```
1. F12 → Console
2. Escribe: renderReviewsAdmin()
3. ¿Se ejecuta sin error? Si no → archivo reviews-admin.js no cargó
4. Verifica: Network → ¿reviews-admin.js descargó?
```

### Si cotizaciones no aparecen:
```
1. Asegúrate de haber completado un formulario de cotización
2. F12 → Console
3. Escribe: getActiveQuotes()
4. ¿Retorna un array? Si sí → cotizaciones se guardaron
5. Si no retorna → formula no se envió correctamente
```

---

## Performance

- [ ] El carrusel no causa lag en el navegador
- [ ] Admin carga en menos de 2 segundos
- [ ] Buscar cotizaciones es instant
- [ ] Editar reseña no causa latencia

---

## Seguridad

- [ ] PASSWORD admin no está visible en código (está en admin-panel.html)
- [ ] No hay números de teléfono hardcodeados en cliente (excepto 3005444049)
- [ ] localStorage solo almacena datos públicos (sin credenciales)
- [ ] HTTPS recomendado para producción (especialmente con WhatsApp)

---

## Documentación

- [ ] Leído: `INTEGRACION_v6.0.md` (guía detallada)
- [ ] Leído: `RESUMEN_v6.0.md` (resumen ejecutivo)
- [ ] Leído: `INTEGRACION_WHATSAPP_GUIA.md` (para WhatsApp)

---

## Go-Live Checklist

- [ ] Todos los checkboxes anteriores están ✅
- [ ] He probado en Chrome, Firefox y Safari (al menos 2)
- [ ] He probado en móvil (iPhone o Android)
- [ ] He probado en tablet
- [ ] No hay console errors
- [ ] No hay console warnings
- [ ] Los datos se guardan correctamente
- [ ] Email de backup enviado (si aplica)
- [ ] Backups lokales realizados

---

**¡Listo para Producción!** 🚀

