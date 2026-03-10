@echo off
REM QUICK START - Made Util Admin Panel
REM Ejecuta este archivo .bat para iniciar el servidor rápidamente en Windows

cd final\final\final\server

echo.
echo ============================================
echo    🚀 MADE UTIL - Admin Panel
echo ============================================
echo.
echo 📍 Frontend:    http://localhost:3001
echo 🔐 Admin:       http://localhost:3001/admin-panel.html
echo 🔑 Contraseña:  adminPass123
echo.
echo ⏸️  Presiona Ctrl+C para detener el servidor
echo.

node server.js

pause
