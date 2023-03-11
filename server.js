require('dotenv').config();
const log = console.log;
const logger = require('./logger');
const fs = require('fs');
const path = require('path');
const http = require('http');
const SERVER = http.createServer;
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const EventEmitter = require('events');
const Emitter = new EventEmitter();
Emitter.on('log', (message, file_name) => logger(message, file_name));
SERVER((req, res) => {
    Emitter.emit('log', `${req.url}\t${req.method}`, 'request');
    let file_ext = path.extname(req.url), content_type, file_path;
    switch (file_ext) {
        case '.css':
            content_type = 'text/css'
            break;
        case '.js':
            content_type = 'text/javascript'
            break;
        case '.json':
            content_type = 'application/json'
            break;
        case '.jpg':
            content_type = 'image/jpeg'
            break;
        case '.png':
            content_type = 'image/png'
            break;
        case '.ico':
            content_type = 'image/vnd.microsoft.icon'
            break;
        case '.otf':
            content_type = 'font/otf'
            break;
        case '.ttf':
            content_type = 'font/ttf'
            break;
        case '.txt':
            content_type = 'text/plain'
            break;

        default:
            content_type = 'text/html'
    }

    if (content_type === 'text/html' && req.url === '/') {
        file_path = path.join(__dirname, 'views', 'index.html');
    } else if (content_type === 'text/html' && req.url.slice(-1) === '/') {
        file_path = path.join(__dirname, 'views', req.url, 'index.html');
    } else if (content_type === 'text/html') {
        file_path = path.join(__dirname, 'views', req.url, 'index.html');
    } else {
        file_path = path.join(__dirname, req.url);
    }

    if (!file_ext && req.url !== '/') file_path += '.html';

    if (fs.existsSync(file_path)) {
        if (content_type.includes('image')) {
            fs.readFile(file_path, '', (err, data) => {
                if (err) console.error(`${err.name}\t${err.message}`);
                res.writeHead(200, { 'Content-Type': content_type });
                res.end(data);
                return;
            });
        } else {
            fs.readFile(file_path, 'utf-8', (err, data) => {
                res.writeHead(200, { 'Content-Type': content_type });
                res.end(data);
                return;
            });
        }
    } else {
        fs.readFile(path.join(__dirname, 'views', '404.html'), 'utf-8', (err, data) => {
            if (err) console.error(`${err.name}\t${err.message}`);
            res.writeHead(404, { 'Content-Type': content_type });
            res.end(data);
            return;
        });
    }
}).listen(PORT, () => log(`Server is running on host: ${HOST}:${PORT}`));
