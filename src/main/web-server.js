import spdy from 'spdy';
import express from 'express';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { contentApi } from '../services/api/contentApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100 // Higher limit for development
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? '*' : 'https://example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API routes
app.use('/api', contentApi);

// Serve static files from public directory
const publicPath = path.join(__dirname, '../public');

// MIME type middleware for CSS files
app.use((req, res, next) => {
  const cssPattern = /\/_?[^/]+\.css$/i;
  if (cssPattern.test(req.path)) {
    res.type('text/css');
  }
  next();
});

// Static file serving
app.use(express.static(publicPath, {
  setHeaders: (res, filePath) => {
    // Set proper cache headers
    const cacheControl = filePath.endsWith('.html') ? 'no-store' : 'public, max-age=31536000, immutable';
    res.setHeader('Cache-Control', cacheControl);

    // Ensure CSS files have correct MIME type
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  },
  // Enable directory indexing
  index: ['index.html'],
  // Allow loading of modules with proper extensions
  extensions: ['.js', '.css', '.html']
}));

// Try to serve the actual file first, then fall back to index.html
app.get('*', (req, res) => {
  const filePath = path.join(publicPath, req.path);
  if (path.extname(req.path) === '.html' && req.path !== '/index.html') {
    res.sendFile(filePath, (err) => {
      if (err) {
        res.sendFile(path.join(publicPath, 'index.html'));
      }
    });
  } else {
    res.sendFile(path.join(publicPath, 'index.html'));
  }
});

// Default port
const PORT = process.env.PORT || 3000;

// Start web server
function startWebServer(port = PORT) {
  return new Promise((resolve, reject) => {
    const options = {
      spdy: {
        protocols: ['h2', 'http/1.1'],
        plain: true
      }
    };
    
    const server = spdy.createServer(options, app)
      .listen(port, '0.0.0.0', () => {
        console.log(`Web server running on port ${port} with HTTP/2`);
        console.log(`Mode: ${process.env.NODE_ENV || 'production'}`);
        resolve(server);
      })
      .on('error', reject);
  });
}

// If this file is run directly (not imported as a module)
if (import.meta.url === `file://${process.argv[1]}`) {
  startWebServer().catch(console.error);
}

export { startWebServer, app };
