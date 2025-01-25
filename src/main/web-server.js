import spdy from 'spdy';
import express from 'express';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Create Express application
const app = express();

// Security headers middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'same-origin' }
}));

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

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
    const cacheControl = path.endsWith('.html') ? 'no-store' : 'public, max-age=31536000, immutable';
    res.setHeader('Cache-Control', cacheControl);
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
    const options = {
      spdy: {
        protocols: ['h2', 'http/1.1'],
        plain: true
      }
    };
    
    serverInstance = spdy.createServer(options, app)
      .listen(port, '0.0.0.0', () => {
        console.log(`Web server running on port ${port} with HTTP/2`);
        resolve(serverInstance);
      })
      .on('error', reject);
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
