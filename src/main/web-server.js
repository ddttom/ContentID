import express from 'express';
import path from 'path';
import cors from 'cors';

// Create Express application
const app = express();

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? '*' : 'https://example.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from renderer directory
const rendererPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../renderer');
app.use(express.static(rendererPath, {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

// Root route handler
app.get('/', (req, res) => {
  res.sendFile(path.join(rendererPath, 'index.html'));
});

// Server instance reference
let serverInstance;

// Start web server
export function startWebServer(port) {
  return new Promise((resolve, reject) => {
    serverInstance = app.listen(port, '0.0.0.0', () => {
      console.log(`Web server running on port ${port}`);
      resolve(serverInstance);
    }).on('error', reject);
  });
}

// Stop web server
export function stopWebServer() {
  return new Promise((resolve) => {
    if (serverInstance) {
      serverInstance.close(() => {
        console.log('Web server stopped');
        resolve();
      });
    } else {
      resolve();
    }
  });
}
