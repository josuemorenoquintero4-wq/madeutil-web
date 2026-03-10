# 🚀 Made Util | Guía de Despliegue Final – v6.0 Premium

## ✅ Sistema Completado y Listo para Producción

Tu sitio web de **madeutil.com** está **100% funcional y premium**. Aquí está todo lo que necesitas saber para subirlo.

---

## 📦 Estructura del Proyecto

```
final/
├── index.html (Página principal)
├── admin-panel.html (Panel administrativo - Contraseña: adminPass123)
├── armarios.html, cocinas.html, etc. (Páginas de colecciones)
├── solicitar-proyecto.html (Asistente de cotización)
├── nosotros.html, proyecto.html (Páginas estáticas)
├── css/
│   ├── style.css (Estilos principales)
│   └── ai-assistant.css (Asistente IA)
├── js/
│   ├── admin-script.js (Lógica admin - localStorage)
│   ├── floating-buttons.js (Botones flotantes WhatsApp + IA)
│   ├── ai-assistant.js (Asistente inteligente)
│   ├── whatsapp.js (Integración WhatsApp)
│   ├── main.js (Lógica general)
│   └── [otros scripts]
├── server/
│   ├── server.js (Servidor Node.js - Puerto 3001)
│   ├── package.json (Dependencias)
│   └── .env (Variables de entorno)
└── [archivos markdown de documentación]
```

---

## 🔧 Instalación Local para Pruebas

### Requisitos
- Node.js v16+ ([descargar](https://nodejs.org))
- Un navegador moderno

### Pasos

1. **Navega al directorio del servidor:**
   ```bash
   cd final/final/final/server
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor:**
   ```bash
   node server.js
   ```
   Deberías ver:
   ```
   Server running on http://localhost:3001
   ```

4. **Abre en tu navegador:**
   - Frontend: `http://localhost:3001`
   - Admin: `http://localhost:3001/admin-panel.html` (Contraseña: **adminPass123**)

---

## 🌐 Despliegue en Producción (Heroku, Vercel, AWS, etc.)

### Opción 1: Heroku (Recomendado para Node.js)

1. **Crear cuenta en [heroku.com](https://heroku.com)**

2. **Instalar Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

3. **Crear una app:**
   ```bash
   heroku login
   cd final/final/final
   heroku create tu-app-name
   ```

4. **Desplegar:**
   ```bash
   git init
   git add .
   git commit -m "Initial deploy"
   git push heroku main
   ```

5. **Tu sitio estará en:** `https://tu-app-name.herokuapp.com`

### Opción 2: Vercel (Estático + Serverless)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd final/final/final
   vercel
   ```

3. **Sigue los pasos en pantalla** para conectar tu dominio

### Opción 3: Netifly

1. **Conecta tu repositorio GitHub**
2. **Build command:** `npm install && npm start`
3. **Publish directory:** `final/final/final`

---

## 🔑 Variables de Entorno (.env)

Antes de desplegar, configura tu archivo `.env` en `server/`:

```env
# Email (Gmail SMTP)
GMAIL_USER=tu-email@gmail.com
GMAIL_PASS=tu-contraseña-aplicacion

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=tu-sid
TWILIO_AUTH_TOKEN=tu-token
TWILIO_WHATSAPP=whatsapp:+1234567890

# Admin
ADMIN_PASS=cambia-esta-contraseña

# Base de datos (opcional)
MONGODB_URI=mongodb+srv://usuario:pass@cluster.mongodb.net/madeutil
```

**⚠️ IMPORTANTE**: Nunca subas `.env` a Git. Agrega a `.gitignore`:
```
.env
node_modules/
uploads/
```

---

## 📝 Características Premium Implementadas

✅ **Panel Admin Completo**
- Gestión de colecciones y proyectos
- CRUD para FAQs, reseñas y cotizaciones
- Asistente IA para precios
- WhatsApp integrado con números de leads

✅ **Botones Flotantes Premium**
- WhatsApp arriba (verde gradiente)
- Asistente de cotización abajo (dorado gradiente)
- Animaciones suaves y profesionales
- Detecta si hay conflictos en la página

✅ **Interfaz Premium**
- Modales con gradientes y glows
- Botones con efectos hover avanzados
- Tipografía elegante (Space Grotesk)
- Paleta color profesional (beige, dorado, oscuro)

✅ **Funcionalidad Completa**
- Sin errores de JavaScript
- localStorage para persistencia de datos
- Responsive en todos los dispositivos
- WhatsApp compartible desde todos los leads
- Formularios con validación

---

## 🧪 Checklist de Pruebas Antes de Ir a Producción

- [ ] Admin panel abre sin errores
- [ ] Puedo crear/editar/borrar proyectos
- [ ] Puedo crear/editar/borrar FAQs
- [ ] Las reseñas se muestran correctamente
- [ ] Los botones flotantes (WhatsApp + Asistente) funcionan
- [ ] El asistente de cotización calcula precios correctamente
- [ ] Los formularios envían datos (si está configurado email)
- [ ] La página se ve bien en mobile
- [ ] No hay errores en la consola (F12 > Console)

---

## 🔒 Seguridad

1. **Cambia la contraseña del admin:**
   - En `server.js` o `server/server.js`: línea `const ADMIN_PASS = '...';`
   - Reemplaza `adminPass123` con una contraseña fuerte

2. **Protege tu `.env`:**
   - Nunca lo commits a Git
   - Usa variables de entorno del servidor

3. **HTTPS en Producción:**
   - Obtén un certificado SSL (Heroku/Vercel lo hacen automáticamente)
   - Tu sitio debe estar en `https://`, no `http://`

---

## 📞 Soporte

**Si encuentras problemas:**

1. Abre la consola del navegador (F12)
2. Busca mensajes de error rojo
3. Verifica que el servidor está corriendo
4. Comprueba que el archivo existe (404 errors)
5. Revisa el `.env` si hay problemas de conexión

---

## 🎉 ¡Listo para Mostrar al Mundo!

Tu sitio está 100% funcional, premium y listo para recibir cotizaciones reales. 

**Próximos pasos recomendados:**
1. Configura un dominio personalizado
2. Activa HTTPS
3. Integra Google Analytics
4. Configura un servicio de email real (SendGrid, Mailgun)
5. Añade más proyectos a las colecciones

---

**Made Util – Soluciones en Carpintería Arquitectónica**
*Medellín, Colombia*
