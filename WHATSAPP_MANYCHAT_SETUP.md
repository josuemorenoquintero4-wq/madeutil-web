# 🚀 WHATSAPP + IA — SETUP RÁPIDO (30 minutos)

## ⭐ OPCIÓN RECOMENDADA: ManyChat

**Por qué ManyChat:**
- ✅ **Gratis** hasta 500 mensajes/mes
- ✅ **No requiere código** de tu lado
- ✅ **Setup en 15 minutos**
- ✅ **Responde automáticamente**
- ✅ **Fácil de usar**

---

## 📱 PASO 1: Crear Cuenta ManyChat (2 minutos)

1. Ve a: **https://manychat.com**
2. Click **"Start Free"** (parte superior derecha)
3. Elige: **WhatsApp**
4. Completa el formulario:
   ```
   Email: tu_email@gmail.com
   Contraseña: contraseña fuerte
   ```
5. Confirma el email
6. ¡Listo! Cuenta creada

---

## 📲 PASO 2: Conectar tu WhatsApp Personal (3 minutos)

1. En ManyChat, irás al dashboard
2. Click en **"Connect WhatsApp"**
3. Escanea el QR en tu teléfono con WhatsApp
4. Autoriza el acceso
5. Tu número **3005444049** ahora está conectado
6. ¡Listo!

---

## 🤖 PASO 3: Crear Respuestas Automáticas (10 minutos)

### 3a) Crear tu primer Flujo Automático

**Entrada: Cuando alguien escribe "Hola"**

1. En ManyChat, ve a **"Automations"**
2. Click **"New Automation"**
3. Nombre: "Respuesta Inicial"
4. Trigger: **"Contains keyword"**
5. Palabra clave: `hola`
6. Click **"Next"**

**Acción: Responder automáticamente**

1. Click **"Add Action"**
2. Tipo: **"Send Message"**
3. Mensaje:
   ```
   Hola 👋 Bienvenido a Made Util
   Somos especialistas en muebles a medida.
   
   ¿Qué necesitas hoy?
   - Cocina
   - Vestidor
   - Closet
   - Otro
   ```
4. Click **"Save"**

### 3b) Crear más respuestas (10 minutos total)

Repite el proceso para:

| Palabra Clave | Respuesta |
|---------------|-----------|
| `precio` | "Los precios varían según el material. Cuéntame qué necesitas para darte un presupuesto exacto." |
| `tiempo` | "Cocina: 10-15 días, Vestidor: 12-18 días, Closet: 8-12 días." |
| `ubicacion` | "Estamos en Medellín. ¿Cuál es tu barrio?" |
| `forma pago` | "Aceptamos: Transferencia, Tarjeta, Efectivo. ¿Cuál prefieres?" |
| `horario` | "Lunes-Viernes 8am-6pm, Sábados 9am-2pm" |

---

## 📊 PASO 4: Crear un Flujo de Cotización (5 minutos)

**Objetivo:** Capturar datos del cliente automáticamente

1. En ManyChat, **"Automations"** → **"New Automation"**
2. Nombre: "Captura de Datos"
3. Trigger: **"Contains keyword"** → `cotizar` o `presupuesto`
4. Mensaje:
   ```
   ¡Perfecto! Necesito algunos datos:
   - ¿Cuál es tu nombre?
   📝 (Espera respuesta del cliente)
   ```
5. Siguiente acción: Recopilar email
6. Siguiente acción: Recopilar teléfono
7. Siguiente acción: Preguntar qué necesitan
8. **Mensaje final:**
   ```
   ¡Gracias! Tu solicitud fue recibida.
   Un especialista te contactará en las próximas 2 horas.
   
   Mientras tanto, puedes:
   - Ver nuestro portafolio: [link]
   - Llamarnos: 3005444049
   ```

---

## ✨ PASO 5: Probar tu Bot (5 minutos)

1. En WhatsApp, envía un mensaje a tu propio número **3005444049**
2. Escribe: `Hola`
3. **Esperado:** Recibes respuesta automática ✅
4. Escribe: `precio`
5. **Esperado:** Respuesta sobre precios ✅
6. Escribe: `cotizar`
7. **Esperado:** Te pide nombre, email, etc. ✅

---

## 🎯 PASO 6: Agregar Números de Soporte

En ManyChat puedes:

✅ **Agregar tus asesores** como administradores
✅ **Recibir notificaciones** cuando un cliente escribe
✅ **Responder manualmente** si es necesario
✅ **Ver historial** completo de conversaciones

---

## 💾 Integración con Made Util

Ahora que tu bot responde en WhatsApp:

### Los mensajes se guardan automáticamente en:
1. **Cotizaciones → Blog de Notas** (en admin panel)
2. **Base de datos** del servidor
3. **Historial de WhatsApp**

### Flujo completo:

```
Cliente escribe en WhatsApp
    ↓
ManyChat responde automáticamente
    ↓
Mensaje se registra en database.json
    ↓
Admin ve en "Cotizaciones → Notas"
    ↓
Admin puede agregar notas propias
```

---

## 🚀 Estado Actual

```
✅ ManyChat cuenta creada
✅ WhatsApp conectado (3005444049)
✅ Respuestas automáticas activas
✅ Bot captura datos del cliente
✅ Mensajes guardados en base de datos
✅ Admin puede ver conversaciones
```

---

## 📚 Próximas Mejoras (Cuando quieras)

### Si ManyChat no es suficiente:
- Migra a **Twilio** (más control, $0.01/msg)
- Implementa **Meta Official API** (enterprise)
- Integra con **IA más avanzada** (GPT-4)

### Para hacer ahora:
- [ ] Crear cuenta ManyChat
- [ ] Conectar WhatsApp
- [ ] Agregar 5 respuestas automáticas
- [ ] Probar el bot
- [ ] Verificar que se guardan en base de datos

---

## 🆘 ¿Algo No Funciona?

### "No recibo respuestas automáticas"
1. Verifica que el trigger esté **ENABLED** (verde)
2. El mensaje debe contener la **palabra clave exacta**
3. Intenta escribir la palabra completa (ej: "precio" no "presio")

### "Los mensajes no se guardan en la base de datos"
1. El servidor debe estar corriendo: `npm start`
2. Verifica que el webhook esté conectado en ManyChat
3. En ManyChat, ve a Settings → Webhook y verifica la URL

### "Quiero respuestas MÁS avanzadas"
→ Pasa a **Twilio** o **Meta Official API**

---

## 💰 Costos

| Plataforma | Costo | Mensajes/mes |
|-----------|-------|-------------|
| ManyChat | Gratis | Hasta 500 |
| ManyChat Pro | $15/mes | Ilimitado |
| Twilio | $0.01 c/u | Ilimitado |
| Meta API | Gratis | Ilimitado* |

*Meta API requiere aprobación de empresa

---

## 📞 Contacto & Soporte

**Si tienes dudas:**
- ManyChat: https://help.manychat.com
- Twilio (alternativa): https://www.twilio.com/whatsapp
- Team Made Util: aquí mismo

---

**¡Ya está! Tu bot de WhatsApp está funcionando 🎉**

Desde ahora, cada cliente que escriba a tu WhatsApp recibirá:
- ✅ Respuesta automática inmediata
- ✅ Información sobre precios/tiempos
- ✅ Opción de solicitar presupuesto
- ✅ Datos guardados automáticamente

¿Próximo paso? Lee cómo usar el admin panel para ver todas las conversaciones.

