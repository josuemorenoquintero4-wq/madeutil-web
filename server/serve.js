// Servidor mínimo sin dependencias externas
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const ROOT = path.join(__dirname, '..');

const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.mp4': 'video/mp4'
};

http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    if (url === '/') url = '/index.html';
    if (!path.extname(url)) url += '.html';

    const filePath = path.join(ROOT, url);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Try index.html as fallback
            fs.readFile(path.join(ROOT, 'index.html'), (err2, data2) => {
                if (err2) {
                    res.writeHead(404);
                    res.end('Not Found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data2);
                }
            });
            return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
}).listen(PORT, () => {
    console.log('MADE UTIL corriendo en http://localhost:' + PORT);
});
