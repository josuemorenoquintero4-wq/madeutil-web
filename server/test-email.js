require('dotenv').config();
const nodemailer = require('nodemailer');

const config = {
    service: 'gmail',
    auth: {
        user: 'madeutilantioquia@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
};

console.log('----------------------------------------');
console.log('🧪 PROBANDO CONEXIÓN A GMAIL...');
console.log(`📧 Usuario: ${config.auth.user}`);
console.log(`🔑 Contraseña: ${config.auth.pass ? 'Configurada (OK)' : 'VACÍA (ERROR)'}`);
console.log('----------------------------------------');

const transporter = nodemailer.createTransport(config);

transporter.verify(function (error, success) {
    if (error) {
        console.log('❌ ERROR DE CONEXIÓN:');
        console.log(error);
        console.log('----------------------------------------');
        console.log('👉 CAUSA PROBABLE: La contraseña no es válida o es la normal.');
    } else {
        console.log('✅ ¡ÉXITO! CONEXIÓN ESTABLECIDA.');
        console.log('📨 Intentando enviar correo de prueba...');

        transporter.sendMail({
            from: config.auth.user,
            to: config.auth.user,
            subject: '🔔 PRUEBA DE SISTEMA MADE UTIL',
            text: 'Si lees esto, el sistema de correos funciona perfectamente.'
        }, (err, info) => {
            if (err) {
                console.log('❌ Error enviando:', err);
            } else {
                console.log('✅ CORREO ENVIADO CORRECTAMENTE!');
                console.log('🆔 ID:', info.messageId);
                console.log('👉 Revisa tu bandeja de entrada AHORA.');
            }
        });
    }
});
