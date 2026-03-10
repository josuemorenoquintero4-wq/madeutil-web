if (process.env.MONGODB_URI) {
    console.log('🌍 Entorno en la Nube detectado (MONGODB_URI). Iniciando Server MongoDB...');
    require('./server-mongo.js');
} else {
    console.log('💻 Entorno Local detectado. Iniciando Server Local (v7)...');
    require('./server-v7.js');
}
