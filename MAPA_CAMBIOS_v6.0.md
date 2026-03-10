# 📍 Mapa Visual de Cambios v6.0

## index.html — CAMBIOS REALIZADOS

```html
<!-- NUEVO: Carrusel de Comentarios (Línea ~165) -->
<section class="testimonials-section reveal" id="testimonials">
    <div class="section-header">
        <h2 class="section-title">Más de 150 familias confían en nosotros</h2>
        <!-- Botón "Dejar mi reseña" -->
    </div>
    
    <!-- Contenedor para comentarios AUTO-SCROLL -->
    <div class="comment-carousel-wrapper">
        <div id="commentCarouselContainer">
            <!-- Renderizado por: comments-carousel.js -->
        </div>
    </div>
</section>

<!-- NUEVO: Modal para agregar comentarios -->
<div id="addCommentModal">
    <!-- Formulario: Nombre, Proyecto, Texto, Estrellas -->
</div>

<!-- NUEVO: Script initialization (Línea ~final) -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        initCommentCarousel();  // ← De comments-carousel.js
        // Star picker interaction
    });
</script>

<!-- NUEVO: Scripts agregados al final -->
<script src="js/comments-carousel.js"></script>      ← NUEVO
<script src="js/reviews-admin.js"></script>          ← NUEVO
<script src="js/quotes-advanced.js"></script>        ← NUEVO
```

---

## admin-panel.html — CAMBIOS REALIZADOS

```html
<!-- Pestaña de Cotizaciones (Línea ~750) -->
<button class="admin-tab" onclick="switchTab('cotizaciones',this)">
    Cotizaciones <span id="leadsCount"></span>
</button>

<!-- NUEVO: Sección de Cotizaciones (Línea ~800) -->
<div id="sectionCotizaciones" class="admin-section">
    <!-- AI Pricing Panel (existente) -->
    
    <!-- NUEVO: Cotizaciones Activas (NEW) -->
    <h2>Cotizaciones Activas</h2>
    <div id="activeQuotesList">
        <!-- Renderizado por: renderActiveQuotesAdmin() -->
    </div>
    
    <!-- NUEVO: Cotizaciones Archivadas (NEW) -->
    <h2>Cotizaciones Archivadas</h2>
    <div id="archivedQuotesList">
        <!-- Renderizado por: renderArchivedQuotesAdmin() -->
    </div>
    
    <!-- Solicitudes Recibidas (existente) -->
    <h2>Solicitudes Recibidas</h2>
    <div id="leadsList"></div>
</div>

<!-- NUEVO: Pestaña Reseñas (Línea ~750) -->
<button class="admin-tab" onclick="switchTab('resenas',this)">
    Reseñas <span id="resenaCount"></span>
</button>

<!-- NUEVO: Sección de Reseñas (Línea ~783) -->
<div id="sectionResenas" class="admin-section">
    <h1>Reseñas de Clientes</h1>
    <div id="resenasList">
        <!-- Renderizado por: renderReviewsAdmin() -->
    </div>
</div>

<!-- NUEVO: Scripts agregados (Línea ~1655) -->
<script src="js/reviews-admin.js"></script>      ← NUEVO
<script src="js/quotes-advanced.js"></script>    ← NUEVO

<script>
    document.addEventListener('DOMContentLoaded', function() {
        renderReviewsAdmin();
        renderActiveQuotesAdmin();
        renderArchivedQuotesAdmin();
    });
</script>
```

---

## css/style.css — CAMBIOS REALIZADOS

```css
/* NUEVO: Bloques de centrado (Línea ~2800) */

/* Secciones globalmente centradas */
.section,
.page-header,
.hero,
.testimonials-section,
.faq-section {
    margin-left: auto !important;
    margin-right: auto !important;
}

/* Textos centrados */
.section-header,
.section-title,
h1, h2, h3 {
    text-align: center !important;
}

/* Flex containers centrados */
.hero-content,
.cta-row,
.feature-grid {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
}

/* Y muchas más clases... */
```

---

## Nuevos Archivos Creados

### 1️⃣ js/comments-carousel.js
```
Líneas: ~270
Funciones principales:
  - initCommentCarousel()      ← Inicia el carrusel
  - submitComment()            ← Guarda comentario
  - getVisibleComments()       ← Obtiene comentarios públicos
  - getGoogleAvatar(name)      ← Genera avatar de Google API

Datos guardados en: localStorage.mu_comments
```

### 2️⃣ js/reviews-admin.js
```
Líneas: ~300
Funciones principales:
  - renderReviewsAdmin()       ← Muestra lista de reseñas en admin
  - editReview(reviewId)       ← Abre modal para editar
  - saveEditReview()           ← Guarda cambios
  - toggleReviewVisibility()   ← Oculta/muestra reseña

Datos guardados en: localStorage.mu_reviews
```

### 3️⃣ js/quotes-advanced.js
```
Líneas: ~400
Funciones principales:
  - renderActiveQuotesAdmin()   ← Muestra cotizaciones activas
  - renderArchivedQuotesAdmin() ← Muestra cotizaciones archivadas
  - searchQuotes(query)         ← Busca en todas las cotizaciones
  - openQuoteNotes(quoteId)     ← Abre blog de notas
  - addNoteToQuote()            ← Agrega nota manual
  - addAINoteToQuote()          ← IA agrega resumen

Datos guardados en: 
  - localStorage.mu_active_quotes
  - localStorage.mu_archived_quotes
```

### 4️⃣ INTEGRACION_v6.0.md
```
Documentación completa:
- Cómo funciona cada sistema
- Testing instructions
- Troubleshooting
- Próximos pasos
```

### 5️⃣ RESUMEN_v6.0.md
```
Resumen ejecutivo de cambios
- Lo completado
- Estado final
- Próximos pasos
```

### 6️⃣ CHECKLIST_v6.0.md
```
Verificación antes de producción
- Testing checklist
- Troubleshooting
- Performance checks
- Security review
```

---

## Flujos de Interacción

### Flujo 1: Agregar Comentario
```
Usuario en index.html
    ↓
Click en "Dejar mi reseña"
    ↓
Se abre modal → Selecciona estrellas, escribe nombre/proyecto/texto
    ↓
Click en "PUBLICAR"
    ↓
submitComment() → Guarda en localStorage.mu_comments
    ↓
initCommentCarousel() → Re-renderiza carrusel
    ↓
Comentario visible en homepage + admin
```

### Flujo 2: Editar Reseña (Admin)
```
Admin en admin-panel.html → Pestaña "Reseñas"
    ↓
Ve lista de todas las reseñas
    ↓
Click en "Editar" en una reseña
    ↓
Se abre modal con valores precargados
    ↓
Modifica estrellas/texto/proyecto
    ↓
Click en "Guardar"
    ↓
saveEditReview() → Actualiza localStorage.mu_reviews
    ↓
renderReviewsAdmin() → Lista se actualiza
    ↓
Cambios visibles en index.html INMEDIATAMENTE
```

### Flujo 3: Gestionar Cotizaciones
```
Cliente completa formulario solicitud.html
    ↓
Se guarda en localStorage.mu_active_quotes
    ↓
Admin ve en admin-panel.html → Pestaña "Cotizaciones" → "Activas"
    ↓
Admin puede:
  - Ver detalles (nombre, teléfono, categorías)
  - Click en "Notas" → Ve blog de conversación
  - Agregar nota manual o nota IA
  - Mover a "Archivadas" cuando se completa
```

### Flujo 4: Buscar Cotizaciones
```
Admin en Cotizaciones
    ↓
Escribe en buscador (si existe)
    ↓
searchQuotes(query) → Busca en:
  - Nombre cliente
  - Teléfono
  - Ciudad
  - Categorías
  - Notas
    ↓
Retorna coincidencias
```

---

## Estructura de Datos localStorage

### Comentarios
```javascript
// localStorage.mu_comments
[
  {
    id: "timestamp",
    name: "María C.",
    project: "Cocina Integral",
    text: "Muy buena experiencia...",
    stars: 5,
    avatar_url: "https://ui-avatars.com/api/?name=Maria+C&background=...",
    visible: true,  // false = oculto en homepage
    date: "2024-01-15"
  },
  ...
]
```

### Reseñas
```javascript
// localStorage.mu_reviews
[
  {
    id: unique_id,
    name: "Cliente",
    project: "Proyecto",
    text: "Texto",
    stars: 5,
    visible: true/false  // false = oculto
  },
  ...
]
```

### Cotizaciones Activas
```javascript
// localStorage.mu_active_quotes
[
  {
    id: unique_id,
    client_name: "Juan",
    phone: "3005444049",
    apartment: "Apto 502",
    city: "Medellín",
    size_m2: 25,
    categories: ["Cocina", "Muebles"],
    notes: [
      { text: "Cliente preguntó sobre plazos", type: "manual", date: "..." },
      { text: "Necesita presupuesto para...", type: "ai", date: "..." }
    ],
    created_at: "2024-01-15",
    status: "active"
  },
  ...
]

// localStorage.mu_archived_quotes  ← Misma estructura, status: "archived"
```

---

## Referencias Rápidas

| Elemento | Archivo | Línea | Función |
|----------|---------|-------|---------|
| Carrusel comentarios | index.html | ~165 | Sección testimonios |
| Modal comentario | index.html | ~190 | addCommentModal |
| Script carousel | index.html | ~245 | initCommentCarousel |
| Admin reseñas | admin-panel.html | ~783 | sectionResenas |
| Admin cotizaciones | admin-panel.html | ~800 | sectionCotizaciones |
| Centrado CSS | style.css | ~2800 | Nuevas clases |
| Comments JS | js/comments-carousel.js | Completo | Sistema carrusel |
| Reviews Admin | js/reviews-admin.js | Completo | CRUD reseñas |
| Quotes Advanced | js/quotes-advanced.js | Completo | Cotizaciones |

---

## Instrucciones Depuración

### Ver qué está en localStorage
```javascript
// Console (F12)
console.table(JSON.parse(localStorage.getItem('mu_comments')))
console.table(JSON.parse(localStorage.getItem('mu_reviews')))
console.table(JSON.parse(localStorage.getItem('mu_active_quotes')))
```

### Limpiar localStorage (reset)
```javascript
// Console
localStorage.clear()
// Recarga página
location.reload()
```

### Forzar re-render en admin
```javascript
// Console
renderReviewsAdmin()
renderActiveQuotesAdmin()
renderArchivedQuotesAdmin()
initCommentCarousel()
```

---

**Mapa Completo v6.0** ✅

