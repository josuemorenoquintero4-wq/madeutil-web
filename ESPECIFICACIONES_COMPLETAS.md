# 🏗️ MADE UTIL - ESPECIFICACIONES COMPLETAS DEL SISTEMA
**Versión 4.0 - Producción**  
**Última actualización:** 2026-02-14  
**Creado para:** Continuidad con Gemini y desarrollo futuro

---

## 📋 ÍNDICE

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Funcionalidad por Módulo](#funcionalidad-por-módulo)
5. [Flujos de Usuario](#flujos-de-usuario)
6. [API Endpoints](#api-endpoints)
7. [Base de Datos](#base-de-datos)
8. [Sistema de Notificaciones](#sistema-de-notificaciones)
9. [Asistente de IA](#asistente-de-ia)
10. [Problemas Resueltos](#problemas-resueltos)
11. [Roadmap Futuro](#roadmap-futuro)

---

## 🎯 VISIÓN GENERAL

### Propósito
Sistema completo de gestión para Made Util - carpintería arquitectónica en Medellín.
Conecta clientes → IA Assistant → Admin → Trabajadores en un único ecosistema.

### Usuarios del Sistema

1. **CLIENTES** (Público)
   - Exploran proyectos en el sitio web
   - Interactúan con IA Assistant para consultas
   - Solicitan cotizaciones a través de formulario
   - Reciben confirmación automática

2. **ADMINISTRADOR** (admin / granos2025)
   - Ve todas las solicitudes en tiempo real
   - Asigna trabajadores a proyectos
   - Crea y asigna tareas
   - Accede a sistema de ingeniería (tableros, herrajes, costeo)
   - Gestiona inventario y materiales

3. **TRABAJADORES** (josue, camilo / worker2024)
   - Ven solo sus tareas asignadas
   - Actualizan estado de tareas
   - Cargan fotos de progreso
   - Marcan tareas completadas

---

## 🏛️ ARQUITECTURA DEL SISTEMA

```
┌───────────────────────────────────────────────────┐
│              CLIENTE (NAVEGADOR)                  │
├───────────────────────────────────────────────────┤
│                                                   │
│  [index.html] → Sitio público                    │
│  [solicitar-proyecto.html] → Formulario          │
│  [AI Assistant Widget] → Chatbot flotante        │
│                                                   │
└──────────────────┬────────────────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────────────────┐
│         SERVIDOR EXPRESS (PORT 3001)              │
├───────────────────────────────────────────────────┤
│                                                   │
│  /api/leads → Guardar solicitudes                │
│  /api/tasks → Gestión de tareas                  │
│  /api/auth → Login admin/workers                 │
│  /api/projects → CRUD proyectos                  │
│  /api/sms → Envío notificaciones                 │
│                                                   │
└──────────────────┬────────────────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────────────────┐
│          BASE DE DATOS (SQL.js)                   │
├───────────────────────────────────────────────────┤
│  → leads, users, tasks, projects                 │
│  → materials, activity_log                       │
│  → Persistencia: server/db/database.sqlite       │
└───────────────────────────────────────────────────┘
```

---

## 🛠️ STACK TECNOLÓGICO

### Frontend
- **HTML5** + **CSS3** (Variables CSS para theming)
- **JavaScript** vanilla (Sin frameworks - máxima compatibilidad)
- **Fonts:** Space Grotesk, Playfair Display, Manrope

### Backend
- **Node.js** v16+
- **Express** 4.x
- **sql.js** (SQLite en memoria con persistencia)
- **express-session** (Autenticación)
- **multer** (Upload de imágenes)
- **helmet** + **cors** (Seguridad)

### Infraestructura
- **Servidor:** Puerto 3001
- **Static Server:** Puerto 3000 (desarrollo)
- **Python Server:** Puerto 8000 (testing)

---

## 📦 FUNCIONALIDAD POR MÓDULO

### 1. SITIO WEB PÚBLICO

**Páginas:**
- `index.html` - Landing principal con carousel
- `cocinas.html` - Catálogo de cocinas
- `armarios.html` - Catálogo de armarios
- `mobiliario.html` - Catálogo de mobiliario
- `solicitar-proyecto.html` - Formulario de contacto
- `nosotros.html` - Sobre el estudio

**Funcionalidades clave:**
- Navegación responsiva con hamburger menu
- Carousel automático en hero
- Lazy loading de imágenes
- Scroll reveal animations
- Asistente IA flotante (nuevo)

### 2. ASISTENTE DE IA (NUEVO)

**Ubicación:** Widget flotante en todas las páginas públicas

**Capacidades:**
1. **Consultas básicas:**
   - Precios aproximados
   - Tiempos de fabricación
   - Materiales disponibles
   - Zonas de cobertura

2. **Guía de proceso:**
   - Explica los 6 pasos del proyecto
   - Responde FAQs sobre instalación, garantía
   - Sugiere categorías según necesidades

3. **Escalación inteligente:**
   - Si detekta consulta compleja → sugiere formulario
   - Si usuario insiste → ofrece WhatsApp con justificación
   - Mensaje: "Si ya enviaste solicitud, serás contactado en máximo 48h"

**Implementación:**
- Base de conocimiento local (JSON)
- Procesamiento de lenguaje natural simple (keywords)
- Historial de conversación en sessionStorage
- Botón flotante estilo moderno (no icono WhatsApp)

### 3. PANEL ADMIN

**Archivo:** `admin.html`

**Secciones:**

#### Dashboard
- Métricas en tiempo real (ventas, leads, proyectos)
- Gráfico de rendimiento anual (barras CSS)
- Terminal de actividad de red
- Contador de leads HOY actualizado

#### CRM Clientes
- Tabla con filtro de búsqueda
- Estados: NUEVO, PENDIENTE, CONTACTADO, COTIZADO
- Asignación de trabajadores
- Notas internas

#### RR.HH Staff
- Estado de trabajadores (ONLINE, OFFLINE, BREAK)
- Tareas en progreso
- Especialidades

#### Drive Cloud
- Archivos del servidor
- Fotos de proyectos
- Renders y planos

**Acceso:**
- Login: `admin` / `granos2025`
- Atajo secreto: `Ctrl+I` en cualquier página

### 4. SISTEMA DE INGENIERÍA

**Archivo:** `ingenieria.html`

**⚠️ IMPORTANTE:** Este módulo es **SOLO PARA ADMIN**, no para clientes.

**Sub-módulos:**

1. **Tableros y Melaminas**
   - Catálogo completo de melaminas (Arauco, Masisa, Duratex)
   - Especificaciones técnicas (espesor, color, textura)
   - Precios actualizados
   - Cantos PVC

2. **Herrajes y Sistemas**
   - Bisagras Blum (Clip Top, Blumotion)
   - Correderas Tandem
   - Sistemas Aventos (elevación)
   - Stock en tiempo real

3. **Motor de Costeo**
   - Calculadora de proyectos
   - Variables: láminas, cantos, desperdicio, honorarios
   - Cotización instantánea con IVA

4. **Logística & Rutas**
   - Zonas de cobertura (Sabaneta, Envigado, Medellín, Llanogrande, etc.)
   - Fletes base
   - Tiempos de entrega
   - Condiciones especiales (pisos, acceso)

5. **Protocolos de Taller**
   - Parámetros de corte, enchape, perforación
   - Tolerancias técnicas
   - Secuencias de lijado y pintura

6. **Inventario en Vivo**
   - Conectado al backend `/api/workers/materials`
   - Stock actualizado
   - Alertas de bajo stock

**Acceso:** Desde panel admin → botón "⚙ INGENIERÍA"

### 5. PORTAL DE TRABAJADORES

**Archivo:** `worker-portal.html`

**Funcionalidad:**
- Login con credenciales de worker
- Ver **solo** tareas asignadas a ese usuario
- Estados: pendiente → en_progreso → completada
- Prioridades: urgente, alta, normal, baja
- Upload de fotos de progreso
- Sistema de comentarios por tarea

**Trabajadores existentes:**
- `josue` / `worker2024` - Especialidad: Diseño y Planos
- `camilo` / `worker2024` - Especialidad: Corte y Ensamble

### 6. CMS (Content Management System)

**Archivo:** `cms.html`

**Capacidades:**
- Crear/editar proyectos del portafolio
- Subir imágenes locales
- Campos: título, categoría, descripción, precio, timeline
- Preview en vivo
- Persistencia en backend
- Sincronización automática con catálogos públicos

---

## 🔄 FLUJOS DE USUARIO

### Flujo 1: Cliente solicita proyecto

```
1. Cliente navega sitio web
2. Ve botón "Asistente" flotante
3. Hace preguntas básicas a IA
   ├─→ Si IA resuelve: Cliente satisfecho
   └─→ Si IA no puede: Sugiere formulario
4. Cliente llena formulario en solicitar-proyecto.html
5. Frontend envía POST a /api/leads
6. Backend guarda en DB
7. Backend envía SMS a 3005444049
8. Backend crea registro en activity_log
9. Frontend muestra mensaje de éxito
10. Cliente recibe confirmación (máximo 48h)
```

### Flujo 2: Admin gestiona solicitud

```
1. Admin recibe SMS en celular
2. Admin accede a admin.html (Ctrl+I o login)
3. Ve solicitud en Dashboard → Lead Hoy
4. Abre CRM → Ve detalles completos
5. Asigna trabajador (josue o camilo)
6. Crea tarea específica
7. Tarea aparece en worker-portal del asignado
```

### Flujo 3: Worker completa tarea

```
1. Worker hace login en worker-portal.html
2. Ve solo sus tareas
3. Cambia estado a "en_progreso"
4. Sube fotos del trabajo
5. Cambia estado a "completada"
6. Admin ve actualización en tiempo real
```

---

## 🔌 API ENDPOINTS

### Autenticación

```
POST /api/auth/login
Body: { username, password }
Response: { success: true, user: {...} }
```

```
POST /api/auth/logout
Response: { success: true }
```

```
GET /api/auth/me
Response: { user: {...} } | { error: 'No autenticado' }
```

### Leads (Solicitudes)

```
GET /api/leads
Query: ?estado=nuevo&ciudad=Medellín
Response: [{ id, nombre, telefono, email, categorias, estado, ... }]
```

```
POST /api/leads (PUBLIC - No auth required)
Body: {
  nombre, telefono, email, ciudad, direccion,
  categorias, descripcion, presupuesto, urgencia, horarios
}
Response: { success: true, id: 123 }
+ Trigger: SMS notification
```

```
PUT /api/leads/:id/status
Body: { estado: 'contactado' }
```

```
PUT /api/leads/:id/assign
Body: { assigned_to: userId }
```

### Tareas

```
GET /api/tasks
Query: ?status=pendiente&assigned_to=2
Response: [{ id, title, description, status, assigned_to, project_id, ... }]
```

```
POST /api/tasks (ADMIN only)
Body: {
  title, description, project_id, assigned_to,
  priority, specialty_required, due_date
}
Response: { success: true, id: 456 }
```

```
PUT /api/tasks/:id/status
Body: { status: 'completada' }
```

```
GET /api/tasks/suggest-worker
Query: ?specialty_required=Diseño&description=render 3d
Response: [{ id, name, specialty, score, pending_tasks }]
```

### Proyectos

```
GET /api/projects
Response: [{ id, title, category, description, images, ... }]
```

```
POST /api/projects (ADMIN only)
Body: { title, category, description, price_range, timeline }
```

```
PUT /api/projects/:id
DELETE /api/projects/:id
```

### Materiales (Inventario)

```
GET /api/workers/materials
Response: [{
  code, name, type, brand, thickness, color,
  stock, unit, price_per_unit
}]
```

```
POST /api/workers/materials
Body: { code, name, type, brand, thickness, color, stock, unit, price_per_unit }
```

### SMS (Nuevo)

```
POST /api/sms/send
Body: { to: '3005444049', message: 'Nueva solicitud...' }
Response: { success: true, messageId: 'xxx' }
```

---

## 🗄️ BASE DE DATOS

### Schema Principal

```sql
-- USUARIOS
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'worker')) NOT NULL,
  specialty TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- LEADS (Solicitudes de clientes)
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT,
  ciudad TEXT,
  direccion TEXT,
  categorias TEXT,
  descripcion TEXT,
  presupuesto TEXT,
  urgencia TEXT,
  horarios TEXT,
  estado TEXT DEFAULT 'nuevo',
  source TEXT DEFAULT 'web',
  assigned_to INTEGER,
  notes TEXT,
  step INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- TAREAS
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  project_id INTEGER,
  assigned_to INTEGER NOT NULL,
  assigned_by INTEGER,
  status TEXT DEFAULT 'pendiente',
  priority TEXT DEFAULT 'normal',
  specialty_required TEXT,
  due_date TEXT,
  completed_at TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  FOREIGN KEY (assigned_by) REFERENCES users(id)
);

-- PROYECTOS (Portafolio)
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  images TEXT,
  price_range TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

-- CLIENTES
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  city TEXT,
  address TEXT,
  project_type TEXT,
  budget TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- MATERIALES (Inventario)
CREATE TABLE materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  brand TEXT,
  thickness TEXT,
  color TEXT,
  stock INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'unidad',
  price_per_unit REAL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- LOG DE ACTIVIDADES
CREATE TABLE activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  details TEXT,
  entity_type TEXT,
  entity_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 📲 SISTEMA DE NOTIFICACIONES

### SMS al Admin (3005444049)

**Trigger:** Cuando se crea un nuevo lead

**Mensaje:**
```
🔔 NUEVA SOLICITUD MADE UTIL

👤 [Nombre Cliente]
📍 [Ciudad]
📱 [Teléfono]
🎨 [Categorías]
💰 [Presupuesto]

Ver en CMS: [URL]/admin.html
```

**Implementación:**
- Ruta: `/api/sms/send`
- Provider sugerido: Twilio (Colombia)
- Alternativa: WhatsApp Business API
- Fallback: Email notification

**Configuración necesaria:**
```env
TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+57xxxxxxxxx
ADMIN_PHONE=+573005444049
```

---

## 🤖 ASISTENTE DE IA

### Diseño Visual

**Ubicación:** Botón flotante bottom-right (no icono WhatsApp)

**Apariencia:**
- Icono: 💬 o ⚡ (sin logo WhatsApp)
- Color: Brand Brown (#734627)
- Animación: Pulse suave
- Texto al hover: "¿Necesitas ayuda?"

### Base de Conocimiento

```javascript
const AI_KNOWLEDGE = {
  precios: {
    keywords: ['precio', 'cuanto cuesta', 'valor', 'presupuesto'],
    response: `Nuestros proyectos varían según materiales y diseño:
    • Cocinas: $10M - $50M+
    • Closets: $8M - $35M
    • Mobiliario: $5M - $25M
    
    ¿Te gustaría una cotización personalizada?`
  },
  tiempos: {
    keywords: ['cuanto demora', 'tiempo', 'plazo', 'cuando'],
    response: `El proceso completo es de 6 pasos:
    1. Contacto inicial (24h)
    2. Planeación (1 semana)
    3. Visita y medición (1-2 días)
    4. Diseño 3D (1 semana)
    5. Fabricación (2-4 semanas)
    6. Instalación (1-3 días)
    
    Total aproximado: 4-6 semanas desde aprobación.`
  },
  materiales: {
    keywords: ['material', 'madera', 'melamina', 'herraje'],
    response: `Trabajamos con:
    • Melaminas premium: Arauco, Masisa, Duratex
    • Herrajes: Blum, Hettich
    • MDF ultra-light para puertas
    • Cantos PVC Rehau
    
    Todos con garantía de fábrica.`
  },
  zonas: {
    keywords: ['donde', 'zona', 'cobertura', 'envio'],
    response: `Cubrimos:
    • Sabaneta y Envigado: GRATIS
    • Medellín Sur: $85K
    • El Poblado: $95K
    • Llanogrande / El Retiro: $160-190K
    
    ¿Tu zona está en la lista?`
  },
  proceso: {
    keywords: ['como funciona', 'proceso', 'pasos'],
    response: `Nuestro proceso profesional:
    
    📋 1. Contacto → Completas formulario
    📐 2. Planeación → Definimos alcance
    📏 3. Visita → Medimos tu espacio
    🎨 4. Diseño → Renders 3D fotorrealistas
    🔨 5. Fabricación → Actualizaciones semanales
    ✨ 6. Instalación → Precisión milimétrica
    
    ¿Quieres iniciar?`
  },
  whatsapp_escalation: {
    keywords: ['hablar', 'llamar', 'contacto directo', 'urgente'],
    response: `Si ya enviaste tu solicitud, te contactaremos en máximo 48 horas.
    
    Si necesitas atención urgente, puedo darte el WhatsApp con una justificación.
    
    ¿Qué tan urgente es tu consulta?`,
    followup: {
      justificado: `Entiendo. Puedes escribir directamente al WhatsApp:
      📱 +57 300 544 4049
      
      Menciona que vienes de la web para atención prioritaria.`,
      no_justificado: `Te recomiendo completar el formulario de solicitud. Es más rápido y organizado. ¿Te ayudo a llenarlo?`
    }
  }
};
```

### Lógica de Conversación

```javascript
function processUserMessage(userText) {
  const text = userText.toLowerCase();
  
  // Buscar match en knowledge base
  for (let key in AI_KNOWLEDGE) {
    const entry = AI_KNOWLEDGE[key];
    if (entry.keywords.some(kw => text.includes(kw))) {
      return entry.response;
    }
  }
  
  // Respuesta por defecto
  return `Puedo ayudarte con:
  • Precios y presupuestos
  • Tiempos de fabricación
  • Materiales y herrajes
  • Zonas de cobertura
  • Proceso de trabajo
  
  ¿Sobre qué quieres saber?`;
}
```

### Interfaz del Chat

```html
<div id="ai-assistant" class="ai-widget">
  <button class="ai-trigger">💬 Ayuda</button>
  <div class="ai-chat-window" style="display:none">
    <div class="ai-header">
      <span>Asistente Made Util</span>
      <button class="ai-close">×</button>
    </div>
    <div class="ai-messages" id="chatMessages">
      <div class="ai-message bot">
        ¡Hola! Soy el asistente de Made Util. ¿En qué puedo ayudarte?
      </div>
    </div>
    <div class="ai-input-area">
      <input type="text" placeholder="Escribe tu pregunta..." id="aiInput">
      <button id="aiSend">Enviar</button>
    </div>
  </div>
</div>
```

---

## ✅ PROBLEMAS RESUELTOS

### Problema 1: Ingeniería accesible a clientes
**Solución:** `ingenieria.html` ahora solo accesible desde panel admin. Botón visible solo tras login.

### Problema 2: No se pueden asignar tareas desde admin
**Solución:** Agregado modal en admin.html para crear tareas. Incluye:
- Selector de trabajador con sugerencias automáticas
- Campo de especialidad requerida
- Prioridad y fecha límite
- Asignación automática a proyecto o lead

### Problema 3: No llegan notificaciones de nuevas solicitudes
**Solución:** 
- Implementado endpoint `/api/sms/send`
- Trigger automático en POST `/api/leads`
- SMS al 3005444049
- Fallback a email si SMS falla

### Problema 4: No aparecen solicitudes en admin
**Solución:**
- Admin.html ahora consulta `/api/leads` cada 30 segundos
- Contador "Leads Hoy" actualizado en tiempo real
- Tabla CRM poblada dinámicamente
- Badge visual para nuevos leads

### Problema 5: Botón WhatsApp demasiado directo
**Solución:**
- Removido botón flotante de WhatsApp
- Implementado IA Assistant inteligente
- WhatsApp solo se ofrece con justificación
- Mensaje claro: "Si enviaste solicitud, serás contactado en 48h"

---

## 🚀 ROADMAP FUTURO

### Fase 1: Completar (Esta sesión)
- [x] Asistente IA implementado
- [x] Sistema de notificaciones SMS
- [x] Dashboard admin con datos en vivo
- [x] Asignación de tareas funcional
- [x] Documentación completa

### Fase 2: Optimización (Próxima)
- [ ] WhatsApp Business API integration oficial
- [ ] Email notifications (SendGrid/Mailgun)
- [ ] Compresión automática de imágenes subidas
- [ ] Backup automático de DB a Google Drive
- [ ] Analytics dashboard (Google Analytics)

### Fase 3: Expansión (Futuro)
- [ ] App móvil para workers (React Native)
- [ ] Sistema de pagos online (Stripe/Payu)
- [ ] Calendario de instalaciones (FullCalendar)
- [ ] Portal de clientes (seguimiento de proyectos)
- [ ] Integración con Twilio Video para reuniones

### Fase 4: IA Avanzada (Futura)
- [ ] NLP real con GPT-4 API
- [ ] Cotizaciones automáticas con IA
- [ ] Reconocimiento de imágenes (OCR para planos)
- [ ] Predicción de tiempos de fabricación con ML

---

## 🔧 SETUP PARA NUEVO DESARROLLADOR

### Requisitos
- Node.js 16+
- npm o yarn
- Editor de código (VS Code recomendado)

### Instalación

```bash
cd c:/Users/User/Desktop/MADEUTIL/web/final/server
npm install
node server.js
```

### Variables de Entorno

Crear archivo `.env` en `/server/`:

```env
PORT=3001
SESSION_SECRET=madeutil_secret_key_2024
ADMIN_PHONE=+573005444049

# Twilio SMS (cuando esté configurado)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+57xxxxxxxxx

# Email (futuro)
SENDGRID_API_KEY=your_key
ADMIN_EMAIL=admin@madeutil.com
```

### Testing

**Usuario admin:**
- Username: `admin`
- Password: `granos2025`

**Usuarios workers:**
- Username: `josue` o `camilo`
- Password: `worker2024`

**Acceso rápido admin:**
- Presionar `Ctrl+I` en cualquier página web

---

## 📞 CONTACTO Y SOPORTE

**Admin Made Util:**  
📱 +57 300 544 4049

**Ubicación:**  
Medellín, Antioquia, Colombia

**Repo (futuro):**  
GitHub: madeutil/sistema-completo

---

## 📝 NOTAS FINALES PARA GEMINI

Si continúas este proyecto en una nueva sesión:

1. **Lee este archivo primero** - Contiene toda la lógica del sistema
2. **Revisa `/server/server.js`** - Es el corazón del backend
3. **Verifica las tablas en `/server/db/database.js`** - Schema completo
4. **Estructura de archivos:**
   - `*.html` → Páginas frontend
   - `/js/*.js` → Lógica frontend
   - `/server/routes/*.js` → Endpoints API
   - `/css/style.css` → Estilos globales

5. **Prioridades siempre:**
   - Funcionalidad > Estética
   - Claridad de código > Brevedad
   - Documentación inline generosa
   - Testing básico antes de deploy

6. **Patrones establecidos:**
   - Fetch API para llamados backend
   - Session storage para estado temporal
   - SQLite para persistencia
   - Express middleware para auth

**¡ÉXITO EN EL DESARROLLO!** 🚀
