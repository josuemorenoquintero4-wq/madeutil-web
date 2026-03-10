# 📦 INSTALADOR DE DEPENDENCIAS — Made Util v6.0 (Windows)
# Ejecutar en PowerShell como Administrador

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  📦 MADE UTIL v6.0 — SETUP COMPLETO       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green

# Ir a carpeta servidor
$serverPath = Join-Path $PSScriptRoot "final\final\final\server"
Write-Host "📂 Cambiando a: $serverPath" -ForegroundColor Yellow
Set-Location $serverPath

Write-Host ""
Write-Host "✅ Instalando dependencias base..." -ForegroundColor Green
npm install express cors dotenv

Write-Host ""
Write-Host "❓ ¿Deseas instalar Twilio? (opcional)" -ForegroundColor Yellow
Write-Host "   Si usas ManyChat, NO lo necesitas"
Write-Host ""
$installTwilio = Read-Host "¿Instalar Twilio? (s/n)"

if ($installTwilio -eq "s" -or $installTwilio -eq "S") {
    Write-Host "📦 Instalando Twilio..." -ForegroundColor Green
    npm install twilio
    Write-Host "✅ Twilio instalado" -ForegroundColor Green
}

Write-Host ""
Write-Host "❓ ¿Deseas usar OpenAI IA avanzada? (opcional)" -ForegroundColor Yellow
$installOpenAI = Read-Host "¿Instalar OpenAI? (s/n)"

if ($installOpenAI -eq "s" -or $installOpenAI -eq "S") {
    Write-Host "📦 Instalando OpenAI..." -ForegroundColor Green
    npm install openai
    Write-Host "✅ OpenAI instalado" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Crear archivo .env..." -ForegroundColor Green

if (!(Test-Path ".env")) {
    $envContent = @"
WHATSAPP_PLATFORM=manychat
PORT=3001
NODE_ENV=development
ADMIN_PASSWORD=123
"@
    Set-Content -Path ".env" -Value $envContent
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
    Write-Host "Edita .env con tus variables de Twilio/OpenAI si lo necesitas" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  .env ya existe, no lo sobrescribi" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Setup completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Si usas ManyChat (RECOMENDADO):" -ForegroundColor White
Write-Host "   Leer: WHATSAPP_MANYCHAT_SETUP.md (15 mins)" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Si usas Twilio (profesional):" -ForegroundColor White
Write-Host "   Leer: WHATSAPP_TWILIO_SETUP.md (1 hora)" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Iniciar servidor:" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  Tu sitio estará en:" -ForegroundColor White
Write-Host "   http://localhost:3001" -ForegroundColor Gray
Write-Host ""
Write-Host "════════════════════════════════════════════" -ForegroundColor Green
Write-Host "   ¡Sistema listo para WhatsApp! 🚀" -ForegroundColor Green
Write-Host "════════════════════════════════════════════" -ForegroundColor Green

# Mantener la ventana abierta
Write-Host ""
Write-Host "Presiona Enter para cerrar..." -ForegroundColor Yellow
$null = Read-Host
