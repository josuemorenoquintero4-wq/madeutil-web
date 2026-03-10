# Estructura de Proyectos: Landing Pages + Case Studies

Este plan implementa una arquitectura de dos niveles para la sección de trabajos, dividida en tres categorías (cocinas, armarios, mobiliario). Cada categoría contendrá **proyectos destacados** (que redirigen a landing pages de venta específicas) y **proyectos regulares** (case studies con estructura estandarizada).

## User Review Required

> [!IMPORTANT]
> **Arquitectura de Doble Nivel**
> - **Nivel 1 - Proyectos Destacados**: Un proyecto hero por categoría que enlaza a una landing page de venta optimizada (para enviar directamente a clientes)
> - **Nivel 2 - Case Studies**: Proyectos regulares con estructura técnica estandarizada (descripción, materiales, estadísticas, porqué/para qué, carrusel, antes/después)
> 
> Esta estructura permite enviar landing pages específicas a clientes potenciales sin mostrar todo el sitio web.

> [!WARNING]
> **Estandarización de Templates**
> Todos los case studies seguirán exactamente la misma estructura, independientemente de la categoría. Esto garantiza consistencia pero reduce la flexibilidad creativa para proyectos individuales.

## Proposed Changes

### Core Templates

#### [NEW] [case-study-template.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/templates/case-study-template.html)

Template base para todos los proyectos regulares con la siguiente estructura:

1. **Hero Section**: Video o imagen de impacto con título del proyecto
2. **Concepto Principal**: Grid asimétrico con:
   - Descripción del proyecto
   - Materiales utilizados
   - Estadísticas clave
   - "El Porqué y Para Qué" (filosofía del diseño)
3. **Carrusel de Imágenes**: Galería horizontal con imágenes del proyecto
4. **Antes y Después**: Grid comparativo de transformación
5. **Ficha Técnica**: Tabla con especificaciones detalladas
6. **CTA Final**: Llamado a acción para cotización

---

### Category Pages (Cocinas, Armarios, Mobiliario)

Cada página de categoría ya tiene la estructura correcta con:
- Un proyecto hero (destacado) que enlaza a landing page
- Proyectos regulares que enlazarán a case studies

#### [MODIFY] [cocinas.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/cocinas.html)

- Actualizar enlaces de proyectos regulares para usar nuevos case studies
- Verificar que el proyecto destacado enlaza correctamente a `landing-roble.html`

#### [MODIFY] [armarios.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/armarios.html)

- Actualizar enlaces de proyectos regulares para usar nuevos case studies
- Verificar que el proyecto destacado enlaza correctamente a `landing-vestidor.html`

#### [MODIFY] [mobiliario.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/mobiliario.html)

- Actualizar enlaces de proyectos regulares para usar nuevos case studies
- Verificar que el proyecto destacado enlaza correctamente a `landing-mesa.html`

---

### Case Study Examples - Cocinas

#### [MODIFY] [detalle-dark.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/detalle-dark.html)

Estandarizar siguiendo el template con:
- Descripción: El reto de integrar cocina con zona social
- Materiales: Cedro Negro, herrajes Blum, mesón Neolith
- Estadísticas: Área, capacidad de almacenamiento
- Porqué/Para qué: Crear ambiente íntimo y sofisticado
- Carrusel con 5-8 imágenes de detalles
- Antes/después de la transformación del espacio

#### [MODIFY] [detalle-minimal.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/detalle-minimal.html)

Aplicar estructura estandarizada del template.

#### [MODIFY] [detalle-industrial.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/detalle-industrial.html)

Aplicar estructura estandarizada del template.

---

### Case Study Examples - Armarios

#### [MODIFY] [detalle-closet-madera.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/detalle-closet-madera.html)

Este archivo ya tiene una excelente estructura que servirá como base del template. Actualizar para incluir explícitamente:
- Sección "Porqué y Para Qué" más destacada
- Ampliar carrusel de imágenes

#### [MODIFY] [detalle-vestidor-glass.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/detalle-vestidor-glass.html)

Aplicar estructura estandarizada del template.

---

### Case Study Examples - Mobiliario

#### [MODIFY] [detalle-mesa-nogal.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/detalle-mesa-nogal.html)

Aplicar estructura estandarizada del template.

#### [MODIFY] [detalle-consola-stone.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/detalle-consola-stone.html)

Aplicar estructura estandarizada del template.

---

### Landing Pages (Ya Existentes)

Las landing pages ya están implementadas correctamente:

- **Cocinas**: [landing-roble.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/landing-roble.html) ✓
- **Armarios**: [landing-vestidor.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/landing-vestidor.html) ✓
- **Mobiliario**: [landing-mesa.html](file:///C:/Users/User/Desktop/MADEUTIL/web/final/landing-mesa.html) ✓

Estas páginas están optimizadas para venta con CTAs agresivos y se pueden enviar directamente a clientes.

## Verification Plan

### Automated Tests

No hay tests automatizados en este proyecto. La verificación será visual.

### Manual Verification

1. **Navegación de Categorías**:
   - Abrir `cocinas.html`, `armarios.html`, `mobiliario.html`
   - Verificar que cada página tiene exactamente 1 proyecto destacado (hero) y 2-3 proyectos regulares
   - Confirmar que el proyecto destacado tiene el badge "★ PRODUCTO ESTRELLA"

2. **Flujo a Landing Pages**:
   - Hacer clic en el proyecto destacado de cada categoría
   - Verificar que redirige a la landing page correcta (landing-roble, landing-vestidor, landing-mesa)
   - Confirmar que las landing pages tienen CTAs claros y pueden compartirse directamente

3. **Flujo a Case Studies**:
   - Hacer clic en un proyecto regular de cada categoría
   - Verificar que se muestra la estructura completa:
     * ✓ Hero con video/imagen
     * ✓ Descripción + Materiales lado a lado
     * ✓ Estadísticas visibles
     * ✓ Sección "Porqué y Para Qué"
     * ✓ Carrusel de imágenes funcional
     * ✓ Grid antes/después
     * ✓ Ficha técnica en tabla
     * ✓ CTA final

4. **Consistencia Visual**:
   - Abrir 3 case studies de diferentes categorías
   - Verificar que todos siguen la misma estructura visual y de contenido
   - Confirmar que los estilos, espaciados y tipografía son idénticos

5. **Responsive Design**:
   - Probar cada tipo de página en mobile, tablet y desktop
   - Verificar que carruseles funcionan con touch en mobile
   - Confirmar que las tablas técnicas se adaptan correctamente
