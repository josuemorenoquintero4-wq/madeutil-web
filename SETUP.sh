#!/bin/bash

# 📦 INSTALADOR DE DEPENDENCIAS — Made Util v6.0
# Instala todo lo necesario para WhatsApp + Server

echo "╔════════════════════════════════════════════╗"
echo "║  📦 MADE UTIL v6.0 — SETUP COMPLETO       ║"
echo "╚════════════════════════════════════════════╝"

# Ir a carpeta servidor
cd "$(dirname "$0")/final/final/final/server"

echo ""
echo "✅ Instalando dependencias base..."
npm install express cors dotenv fs path

echo ""
echo "✅ ¿Deseas instalar Twilio? (opcional)"
echo "   Si usas ManyChat, NO lo necesitas"
echo ""
read -p "¿Instalar Twilio? (s/n): " install_twilio

if [ "$install_twilio" = "s" ] || [ "$install_twilio" = "S" ]; then
    echo "📦 Instalando Twilio..."
    npm install twilio
    echo "✅ Twilio instalado"
fi

echo ""
echo "✅ ¿Deseas usar OpenAI IA avanzada? (opcional)"
read -p "¿Instalar OpenAI? (s/n): " install_openai

if [ "$install_openai" = "s" ] || [ "$install_openai" = "S" ]; then
    echo "📦 Instalando OpenAI..."
    npm install openai
    echo "✅ OpenAI instalado"
fi

echo ""
echo "✅ Crear archivo .env..."

if [ ! -f ".env" ]; then
    echo "WHATSAPP_PLATFORM=manychat" > .env
    echo "PORT=3001" >> .env
    echo "NODE_ENV=development" >> .env
    echo "ADMIN_PASSWORD=123" >> .env
    echo ""
    echo "✅ Archivo .env creado"
    echo "Edita .env con tus variables de Twilio/OpenAI si lo necesitas"
else
    echo "⚠️  .env ya existe, no lo sobrescribi"
fi

echo ""
echo "✅ Setup completado!"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1️⃣  Si usas ManyChat (RECOMENDADO):"
echo "   Leer: WHATSAPP_MANYCHAT_SETUP.md (15 mins)"
echo ""
echo "2️⃣  Si usas Twilio (profesional):"
echo "   Leer: WHATSAPP_TWILIO_SETUP.md (1 hora)"
echo ""
echo "3️⃣  Iniciar servidor:"
echo "   npm start"
echo ""
echo "4️⃣  Tu sitio estará en:"
echo "   http://localhost:3001"
echo ""
echo "════════════════════════════════════════════"
echo "   ¡Sistema listo para WhatsApp! 🚀"
echo "════════════════════════════════════════════"
