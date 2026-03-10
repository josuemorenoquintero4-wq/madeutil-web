# 🚀 MADE UTIL - SISTEMA INTEGRADO v3.0 (BACKEND NODE.JS)

## 📋 RESUMEN DEL SISTEMA

Se ha implementado un **Sistema de Gestión Integral (ERP/CRM)** para Made Util, conectando el sitio web público con un backend robusto en Node.js y base de datos SQLite.

**Principales Novedades v3.0:**
1.  **Backend Real:** Servidor Node.js con Express y SQLite (`sql.js` para portabilidad sin compilación).
2.  **Persistencia de Datos:** Todos los proyectos, clientes, leads y tareas se guardan en base de datos, no en localStorage.
3.  **Portal de Trabajadores:** Interfaz dedicada para operarios con reloj checador y gestión de tareas.
4.  **Enfoque Melamina:** Todo el contenido web actualizado para reflejar "Carpintería Arquitectónica" y materiales técnicos.
5.  **WhatsApp Integrado:** Botón flotante automático en todas las páginas públicas.

---

## 🔐 1. ACCESOS Y CREDENCIALES

El sistema viene precargado con cuentas de demostración:

| Panel | Rol | URL | Usuario | Contraseña |
|-------|-----|-----|---------|------------|
| **CMS Admin** | Administrador | `http://localhost:3001/login.html` | `admin` | `granos2025` |
| **Portal Operario** | Carpintero | `http://localhost:3001/login.html` | `josue` | `worker2024` |
| **Portal Instalador** | Instalador | `http://localhost:3001/login.html` | `camilo` | `worker2024` |

*Nota: El login detecta el rol y redirige automáticamente al panel correspondiente (CMS o Portal).*

**Atajo Teclado:** `Ctrl + I` te lleva al login o a tu panel si ya tienes sesión.

---

## 🌐 2. ESTRUCTURA DEL SITIO

### Frontend Público
- **index.html**: Home con carrusel de proyectos destacados.
- **nosotros.html**: Nueva filosofía de "Ingeniería de Precisión".
- **cocinas/armarios/mobiliario.html**: Portafolios por categoría con terminología técnica correcta.
- **solicitar-proyecto.html**: Formulario conectado a la API de leads.

### Paneles Privados
- **cms.html**: Gestión total (Proyectos, Leads, Clientes, Usuarios).
- **worker-portal.html**: Panel simplificado para operarios (Tareas, Reloj, Materiales).
- **ingenieria.html**: Base de conocimientos técnica, calculadora y stock (conectado a API).

---

## 🛠️ 3. BACKEND & API

El servidor se encuentra en la carpeta `/server` y expone una API RESTful en `/api`.

### Endpoints Principales:
- `POST /api/auth/login`: Autenticación.
- `GET /api/projects`: Listar portafolio.
- `POST /api/leads`: Recibir solicitudes web (público).
- `GET /api/workers/dashboard`: Datos para el portal de trabajadores.
- `POST /api/upload`: Subida de imágenes (guardadas en `/server/uploads`).

**Base de Datos:**
Archivo: `server/madeutil.db`
Tecnología: SQLite (vía `sql.js`).
Backup automático: El servidor guarda el estado de la DB periódicamente.

---

## 🚀 4. CÓMO INICIAR EL SISTEMA

1.  **Abrir Terminal** en la carpeta raíz del proyecto.
2.  Entrar a la carpeta del servidor:
    ```bash
    cd server
    ```
3.  Instalar dependencias (solo la primera vez):
    ```bash
    npm install
    ```
4.  Iniciar el servidor:
    ```bash
    node server.js
    ```
5.  **Abrir navegador** en: `http://localhost:3001`

---

## 🔄 5. FLUJO DE TRABAJO (WORKFLOW)

1.  **Lead en Web**: Cliente llena formulario en `solicitar-proyecto.html`.
2.  **API Backend**: Recibe datos, crea entrada en DB tabla `leads` y notifica (log).
3.  **CMS Admin**:
    - Admin ve la nueva solicitud en "Solicitudes".
    - Revisa detalles, cambia estado a "Aprobado".
    - Asigna tarea de medición a "Camilo".
4.  **Portal Trabajador**:
    - Camilo entra a `worker-portal.html`.
    - Ve "Medición en [Dirección]" en sus tareas.
    - Marca "Check-in" al llegar y "Check-out" al salir.
    - Marca tarea como "Completada".
5.  **Cierre**: Admin verifica y convierte Lead a Cliente Activo.

---

Este sistema reemplaza completamente la versión anterior basada en localStorage.
**© 2024 Made Util — Ingeniería & Diseño**
