# 🏗️ MADE UTIL — Web System v3.0

Sistema completo para Made Util. Incluye sitio web público, CMS de administración, Portal de Trabajadores y Backend en Node.js con base de datos SQLite.

---

## 🚀 Inicio Rápido

Para iniciar todo el sistema (Frontend + Backend), sigue estos pasos:

1. **Abrir la terminal** en la carpeta `server`:
   ```bash
   cd server
   ```

2. **Instalar dependencias** (solo la primera vez):
   ```bash
   npm install
   ```
   *(Esto instalará Express, SQLite, Bcrypt, Multer, etc.)*

3. **Iniciar el servidor**:
   ```bash
   node server.js
   ```

   Verás un mensaje como este:
   ```
   ╔══════════════════════════════════════════╗
   ║   🏗️  MADE UTIL SERVER v3.0              ║
   ║   http://localhost:3001                  ║
   ╚══════════════════════════════════════════╝
   ```

4. **Acceder al sitio**:
   Abre tu navegador en: [http://localhost:3001](http://localhost:3001)

---

## 🔑 Credenciales de Acceso

El sistema viene pre-cargado con usuarios para pruebas:

| Panel | Rol | Usuario | Contraseña |
|-------|-----|---------|------------|
| **CMS Admin** | Administrador | `admin` | `granos2025` |
| **Portal Trabajador** | Carpintero | `josue` | `worker2024` |
| **Portal Trabajador** | Instalador | `camilo` | `worker2024` |

- **CMS Admin:** [http://localhost:3001/login.html](http://localhost:3001/login.html) -> Redirige a `/cms.html`
- **Portal Trabajador:** [http://localhost:3001/login.html](http://localhost:3001/login.html) -> Redirige a `/worker-portal.html`

---

## 🛠️ Características del Sistema

### 1. Backend (Node.js + Express + SQLite)
- **Base de Datos Real:** Usa `sql.js` y guarda los datos en `server/madeutil.db`.
- **API RESTful:** Endpoints para autenticación, leads, proyectos, clientes, tareas y trabajadores.
- **Seguridad:** Hash de contraseñas con `bcrypt`, sesiones seguras, protección contra ataques de fuerza bruta.

### 2. CMS (Administración)
- Gestión completa de **Leads** (Solicitudes de proyectos).
- Dashboard con estadísticas en tiempo real.
- Gestión de **Proyectos** del portafolio (subida de imágenes real al servidor).
- Base de datos de **Clientes**.

### 3. Portal de Trabajadores o Operarios
- **Reloj Checada:** Registro de entrada y salida con geolocalización (simulada).
- **Mis Tareas:** Lista de tareas asignadas por el admin.
- **Inventario:** Acceso a stock de materiales en tiempo real.

### 4. Sitio Web Público
- Enfocado en **Melamina y Carpintería Arquitectónica**.
- Botón flotante de WhatsApp.
- Formulario de contacto conectado al Backend.

---

## 📁 Estructura de Archivos Importantes

- `/server/server.js` -> Punto de entrada del servidor.
- `/server/db/database.js` -> Lógica de base de datos SQLite.
- `/js/api.js` -> Cliente API que conecta el frontend con el backend.
- `/js/cms.js` -> Lógica del panel de administración.
- `/js/whatsapp.js` -> Botón flotante de WhatsApp.
- `/ingenieria.html` -> Base de datos técnica de materiales (conectada a API).

---

© 2024 Made Util — Ingeniería & Diseño
