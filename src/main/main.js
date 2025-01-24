// Main process - CommonJS
const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const url = require('url');

// Web server configuration
const WEB_PORT = process.env.WEB_PORT || 3000;
const WEB_HOST = process.env.WEB_HOST || '0.0.0.0';

let mainWindow;
let webServer;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the renderer
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Open dev tools only on explicit request
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.code === 'KeyI' && input.control && input.shift) {
      mainWindow.webContents.openDevTools();
    }
  });

  return mainWindow;
}

function createWebServer() {
  const server = http.createServer((req, res) => {
    // Parse URL and validate path
    const parsedUrl = url.parse(req.url);
    const sanitizedPath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, '../renderer', sanitizedPath === '/' ? 'index.html' : sanitizedPath);

    // Security headers
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "script-src 'self'; " +
      "img-src 'self' data:; " +
      "font-src 'self'; " +
      "connect-src 'self'"
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // CORS configuration
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      // Set appropriate content type
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.ico': 'image/x-icon'
      }[ext] || 'text/plain';

      res.writeHead(200, { 
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(data)
      });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(WEB_PORT, WEB_HOST, () => {
      console.log(`Web server running at http://${WEB_HOST}:${WEB_PORT}`);
      webServer = server;
      resolve(server);
    });
  });
}

function getWindows() {
  return BrowserWindow.getAllWindows();
}

function stopWebServer() {
  if (webServer) {
    return new Promise((resolve) => {
      webServer.close(() => resolve());
    });
  }
  return Promise.resolve();
}

module.exports = {
  createWindow,
  createWebServer,
  getWindows,
  stopWebServer
};

// App lifecycle
if (require.main === module) {
  app.whenReady().then(() => {
    createWindow();
    createWebServer();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    stopWebServer().then(() => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  });
}
