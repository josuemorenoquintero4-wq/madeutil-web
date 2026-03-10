# 🏗️ PLAN MAESTRO — MADE UTIL v3.0 PRODUCCIÓN

## 📋 RESUMEN EJECUTIVO

Made Util es una empresa de carpintería especializada en **aglomerado / tableros de melamina** 
(NO madera maciza), ubicada en Medellín, Colombia. Este plan transforma el sitio web de 
prototipo a producción completa con backend funcional.

---

## 🔴 CAMBIOS CRÍTICOS DE ENFOQUE

### 1. MATERIAL PRINCIPAL: MELAMINA / AGLOMERADO
La empresa trabaja principalmente con:
- **Tableros de melamina** (aglomerado recubierto)
- **MDF** (fibra de densidad media)
- **Tableros de partículas / aglomerado**
- **Fórmica / laminado de alta presión (HPL)**
- Herrajes y accesorios de marcas como Blum, Hettich, Hafele
- Cantos/bordes de PVC y ABS
- Bisagras, correderas, sistemas de cierre suave

**NO trabaja con madera maciza** (nogal, cedro, etc.) - La sección de ingeniería 
actual está completamente equivocada y debe actualizarse.

### ¿Qué es la Melamina/Aglomerado?
- Es un tablero compuesto por partículas de madera prensadas con resinas
- Se recubre con papel melamínico decorativo que simula texturas (madera, piedra, etc.)
- Es el material más usado en mobiliario moderno por su:
  - Costo accesible
  - Variedad de diseños y colores
  - Resistencia a manchas y humedad
  - Facilidad de mantenimiento
  - Uniformidad de acabado

---

## 📦 ESTRUCTURA DEL PROYECTO

```
MADEUTIL/web/final/
├── server/                    # NUEVO - Backend Node.js
│   ├── server.js             # Servidor Express principal
│   ├── package.json          # Dependencias
│   ├── db/                   # Base de datos
│   │   └── database.js       # SQLite setup + modelos
│   ├── routes/               # Rutas API
│   │   ├── auth.js           # Autenticación
│   │   ├── projects.js       # CRUD proyectos
│   │   ├── leads.js          # Gestión leads
│   │   ├── clients.js        # Gestión clientes
│   │   ├── workers.js        # Gestión trabajadores
│   │   ├── tasks.js          # Sistema de tareas
│   │   └── upload.js         # Subida de imágenes
│   ├── middleware/           # Middleware
│   │   └── auth.js           # Verificación de sesión
│   └── uploads/              # Carpeta para imágenes subidas
├── css/
│   └── style.css             # Estilos (mantener estructura)
├── js/
│   ├── main.js               # JS público (mantener)
│   ├── cms.js                # CMS actualizado
│   ├── solicitud.js          # Formulario actualizado
│   ├── worker-portal.js      # NUEVO - Portal trabajador
│   └── api.js                # NUEVO - Cliente API
├── index.html                # Homepage (actualizar textos)
├── cms.html                  # CMS admin (actualizar)
├── worker-portal.html        # NUEVO - Portal trabajadores
├── login.html                # Login (actualizar)
├── ingenieria.html           # REHACER - Melamina/Aglomerado
└── ... (demás páginas)
```

---

## 🧪 100 PRUEBAS DE USUARIO (SIMULADAS)

### CATEGORÍA 1: PRIMERA IMPRESIÓN (Pruebas 1-15)
1. ✅ Diseño premium dark — impresiona
2. ⚠️ Page loader tarda demasiado en algunos devices
3. ❌ No hay favicon — se ve poco profesional
4. ⚠️ Imágenes son de Unsplash genéricas, no de trabajos reales
5. ✅ Tipografía elegante y consistente
6. ❌ No hay logo real, solo texto "MADE UTIL"
7. ⚠️ Textos hablan de "madera" pero la empresa usa melamina — INCOHERENTE
8. ✅ Animaciones suaves y no invasivas
9. ⚠️ Grain effect puede molestar en móviles de gama baja
10. ❌ No hay testimonios de clientes reales
11. ⚠️ Footer dice © 2024, debería ser dinámico
12. ❌ No hay redes sociales (Instagram es CLAVE para este negocio)
13. ✅ CTA "COTIZAR" siempre visible — bien
14. ⚠️ El marquee repite mucho — podría tener más variedad
15. ❌ No hay WhatsApp flotante — esencial en Colombia

### CATEGORÍA 2: NAVEGACIÓN (Pruebas 16-30)
16. ✅ Menú simple y claro
17. ❌ No hay breadcrumbs en páginas internas
18. ⚠️ Botón COTIZAR en nav a veces va a popup, a veces a página — inconsistente
19. ✅ Menú hamburguesa funciona bien
20. ❌ No hay barra de búsqueda
21. ⚠️ Links del footer no incluyen todas las páginas
22. ❌ No hay 404 page personalizada
23. ✅ Scroll suave funciona
24. ⚠️ En mobile el menú podría ser más grande
25. ❌ No hay indicador de página activa en el menú
26. ✅ Portales de categoría son intuitivos
27. ⚠️ Ctrl+I para admin — nadie lo sabe sin documentación
28. ❌ No hay mapa del sitio (sitemap.xml)
29. ⚠️ Algunos links abren popup en vez de ir a solicitar-proyecto
30. ✅ Back button funciona correctamente

### CATEGORÍA 3: CONTENIDO (Pruebas 31-45)
31. ❌ Habla de "ebanistería" y "madera noble" — FALSO si usa melamina
32. ❌ "Precisión alemana" — ¿tienen certificación alemana?
33. ⚠️ "Madera certificada" — si no usa madera, es engañoso
34. ❌ "Esculpimos atmósferas" — pretencioso para aglomerado
35. ⚠️ Precios en formulario ($10M-$50M+) podrían no ser realistas
36. ❌ No hay información de garantía real
37. ❌ No hay política de privacidad ni términos
38. ⚠️ Ficha técnica de proyectos usa datos genéricos
39. ❌ No hay blog o contenido educativo
40. ✅ Proceso de 6 pasos bien explicado
41. ⚠️ Descripción del estudio muy poética, poco concreta
42. ❌ No hay video de la empresa/taller
43. ❌ Fotos de Unsplash, no muestran trabajo real
44. ⚠️ Stats (+150 espacios) — ¿verificable?
45. ⚠️ "4a garantía" — debería ser más específico

### CATEGORÍA 4: FORMULARIOS Y CONVERSIÓN (Pruebas 46-55)
46. ✅ Formulario completo con campos necesarios
47. ❌ Popup de contacto NO envía datos realmente — solo cierra
48. ❌ No hay validación visual de campos
49. ⚠️ No hay confirmación por email
50. ✅ Mensaje de éxito aparece correctamente
51. ❌ Datos se guardan en localStorage — se pierden fácil
52. ⚠️ No hay captcha ni protección anti-spam
53. ❌ SMS/WhatsApp está simulado, no funciona
54. ✅ Campos requeridos bien marcados
55. ⚠️ Select de presupuesto podría tener más opciones

### CATEGORÍA 5: ADMIN/CMS (Pruebas 56-75)
56. ❌ Credenciales expuestas en la página de login
57. ❌ Auth es solo localStorage — inseguro
58. ❌ No se pueden subir imágenes reales desde el disco
59. ❌ No se pueden asignar tareas a trabajadores
60. ❌ Sistema de tareas no funciona correctamente
61. ❌ Datos se pierden al limpiar el navegador
62. ⚠️ CMS no diferencia entre roles de usuario
63. ❌ No hay panel de trabajadores independiente
64. ❌ No hay notificaciones reales
65. ✅ Dashboard tiene buenas estadísticas
66. ❌ No hay backup de datos
67. ⚠️ Leads no se pueden exportar
68. ❌ No hay historial de cambios
69. ✅ Filtrado de leads funciona
70. ❌ Asignación de leads no notifica al trabajador
71. ❌ No hay calendario de instalaciones
72. ❌ Admin enterprise tiene datos mock hardcodeados
73. ⚠️ No hay reportes generables
74. ❌ Staff workstations solo funcionan en mismo navegador
75. ❌ No hay control de permisos por rol

### CATEGORÍA 6: INGENIERÍA (Pruebas 76-85)
76. ❌ Maderas listadas SON MADERA MACIZA — la empresa usa melamina
77. ❌ Densidad/Janka/Contracción son propiedades de madera maciza
78. ❌ Costos de madera por m³ no aplican a melamina
79. ❌ Falta información de tableros: espesores (9mm, 12mm, 15mm, 18mm, 25mm)
80. ❌ Falta catálogo de colores/texturas de melamina
81. ❌ Falta info de cantos PVC (0.4mm, 1mm, 2mm)
82. ✅ Herrajes Blum son correctos — es lo que se usa
83. ⚠️ Rutas de despacho podrían estar actualizadas
84. ❌ Falta cálculo de material para un proyecto
85. ❌ Falta lista de proveedores

### CATEGORÍA 7: MOBILE Y RENDIMIENTO (Pruebas 86-95)
86. ⚠️ CSS es 50KB — mucho para un sitio estático
87. ✅ Responsive funciona en general
88. ⚠️ Imágenes son muy grandes (Unsplash 2400px)
89. ❌ No hay PWA / offline support
90. ⚠️ Custom cursor no funciona en touch
91. ✅ Lazy loading implementado
92. ⚠️ Animaciones podrían causar jank en low-end devices
93. ❌ No hay compresión de assets
94. ❌ No hay CDN configurado
95. ✅ Google Fonts bien configuradas con preconnect

### CATEGORÍA 8: SEO Y LEGAL (Pruebas 96-100)
96. ❌ No hay robots.txt
97. ❌ No hay sitemap.xml
98. ❌ No hay Open Graph / meta social
99. ❌ No hay Google Analytics ni tracking
100. ❌ No hay política de privacidad (obligatorio)

---

## 🔨 PLAN DE EJECUCIÓN (Prioridad)

### FASE 1: BACKEND + BASE DE DATOS
- [ ] Crear servidor Express con SQLite
- [ ] API de autenticación con bcrypt + sessions
- [ ] API CRUD: proyectos, leads, clientes, tareas, trabajadores
- [ ] Sistema de upload de imágenes (multer)
- [ ] Roles y permisos (admin, trabajador)

### FASE 2: CORRECCIÓN DE CONTENIDO  
- [ ] Actualizar TODA referencia a madera → melamina/aglomerado
- [ ] Rehacer sección de ingeniería con datos de melamina reales
- [ ] Actualizar textos del manifiesto y filosofía
- [ ] Corregir footer con año dinámico

### FASE 3: ADMIN FUNCIONAL
- [ ] CMS conectado al backend (no localStorage)
- [ ] Upload de imágenes desde escritorio
- [ ] Sistema de tareas con asignación por especialidad
- [ ] Panel de trabajadores separado
- [ ] Notificaciones de tareas

### FASE 4: MEJORAS UX/UI
- [ ] WhatsApp flotante
- [ ] Redes sociales
- [ ] Consistencia en CTAs
- [ ] Mejoras mobile

### FASE 5: PRODUCCIÓN
- [ ] Variables de entorno
- [ ] Seguridad (CORS, helmet, rate limiting)
- [ ] Scripts de inicio
- [ ] Documentación de deploy
