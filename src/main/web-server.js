import spdy from 'spdy';
import express from 'express';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';

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
const rendererPath = path.join(__dirname, '../renderer');
app.use(express.static(rendererPath, {
  setHeaders: (res, path) => {
    // Set proper cache headers
    const cacheControl = path.endsWith('.html') ? 'no-store' : 'public, max-age=31536000, immutable';
    res.setHeader('Cache-Control', cacheControl);

    // Set proper MIME types
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  },
  // Enable directory indexing for block modules
  index: ['index.html'],
  // Allow loading of .js modules
  extensions: ['js', 'css', 'html']
}));

// Try to serve the actual file first, then fall back to index.html
app.get('*', (req, res) => {
  const filePath = path.join(rendererPath, req.path);
  if (path.extname(req.path) === '.html' && req.path !== '/index.html') {
    res.sendFile(filePath, (err) => {
      if (err) {
        res.sendFile(path.join(rendererPath, 'index.html'));
      }
    });
  } else {
    res.sendFile(path.join(rendererPath, 'index.html'));
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
