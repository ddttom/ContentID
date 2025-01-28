# Modern Web Architecture Guide

## Core Principles

1. **Component-Based Architecture**
   - Modular components
   - Progressive enhancement
   - Independent loading
   - Isolated styling

2. **Performance First**
   - Target Lighthouse 100
   - No bundling required
   - HTTP/2 optimized
   - Modern browser APIs

## Project Structure

```bash
/styles/
  /base/
    _variables.css    # Design tokens
    _reset.css        # Base styles
    _utilities.css    # Helper classes
  /components/
    _header.css       # Header styles
    _footer.css       # Footer styles
    _forms.css        # Form styles
  /pages/
    _index.css        # Landing page
    _list.css         # Content listing
    _entry.css        # Content entry
    _editor.css       # Content editor
  styles.css          # Main stylesheet
/scripts/
  - lib.js           # Utilities
  - main.js          # Core app
  - components.js    # Component loader
  - init.js          # Component initialization
/components/
  - header.html      # Header markup
  - footer.html      # Footer markup
/utils/
  - decorators.js
  - loaders.js
```

## Implementation Guide

### 1. Core Infrastructure

#### Server Configuration

```javascript
// web-server.js
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

// Security headers
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

// Compression
app.use(compression({
  level: 6,
  threshold: 1024
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? '*' : 'https://example.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, path) => {
    const cacheControl = path.endsWith('.html') ? 'no-store' : 'public, max-age=31536000, immutable';
    res.setHeader('Cache-Control', cacheControl);
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  },
  index: ['index.html'],
  extensions: ['js', 'css', 'html']
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// HTTP/2 server options
const options = {
  spdy: {
    protocols: ['h2', 'http/1.1'],
    plain: true
  }
};

// Start server
const PORT = process.env.PORT || 3000;
spdy.createServer(options, app)
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT} with HTTP/2`);
  });
```

#### Head Setup

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self';">
  <base href="./">
  <link rel="stylesheet" href="styles/styles.css">
  <script type="module" src="scripts/init.js"></script>
</head>
```

### 2. Component System

#### Component Loading

```javascript
// components.js
export async function loadComponent(path, targetSelector) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${path}`);
    }
    const html = await response.text();
    const target = document.querySelector(targetSelector);
    if (!target) {
      throw new Error(`Target element not found: ${targetSelector}`);
    }
    target.innerHTML = html;
  } catch (error) {
    console.error('Error loading component:', error);
  }
}

export async function loadCommonComponents() {
  await Promise.all([
    loadComponent('./components/header.html', '#header-container'),
    loadComponent('./components/footer.html', '#footer-container')
  ]);
}

// init.js
import { loadCommonComponents } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
  loadCommonComponents();
});
```

### 3. CSS Architecture

#### Base Styles

```css
/* _variables.css */
:root {
  --color-primary: #007bff;
  --color-text: #333;
  --spacing-md: 1rem;
  --font-family: system-ui, -apple-system, sans-serif;
}

/* _reset.css */
body {
  margin: 0;
  font-family: var(--font-family);
  color: var(--color-text);
}

/* _utilities.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

#### Component Styles

```css
/* _header.css */
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: var(--z-index-header);
}

/* _footer.css */
.footer {
  background: var(--color-background-light);
  padding: var(--spacing-xl) 0;
}
```

#### Main Stylesheet

```css
/* styles.css */
@import './base/_variables.css';
@import './base/_reset.css';
@import './base/_utilities.css';

@import './components/_header.css';
@import './components/_footer.css';
@import './components/_forms.css';

@import './pages/_index.css';
@import './pages/_list.css';
@import './pages/_entry.css';
@import './pages/_editor.css';
```

### 4. Best Practices

#### Performance Checklist

- [ ] Optimize images with WebP
- [ ] Use intersection observer for lazy loading
- [ ] Enable HTTP/2 push
- [ ] Set proper cache headers
- [ ] Compress responses
- [ ] Monitor Lighthouse scores

#### Code Quality

- [ ] Keep components isolated
- [ ] Use semantic HTML
- [ ] Follow BEM CSS naming
- [ ] Document components
- [ ] Implement error handling
- [ ] Add status tracking
- [ ] Test cross-browser
- [ ] Validate accessibility

#### Security

- [ ] Set CSP headers
- [ ] Enable HSTS
- [ ] Configure rate limiting
- [ ] Validate user input
- [ ] Sanitize HTML content
- [ ] Use secure dependencies
- [ ] Monitor for vulnerabilities
- [ ] Implement CORS policy

## Testing Strategy

### Performance Testing

1. Run Lighthouse audits
2. Test load times
3. Monitor FCP/LCP
4. Check CLS scores
5. Verify resource loading
6. Test on slow networks
7. Monitor memory usage
8. Profile JavaScript

### Cross-Browser Testing

1. Test modern browsers
2. Verify iOS/Android
3. Check responsive design
4. Test keyboard navigation
5. Validate screen readers
6. Check color contrast
7. Verify focus management
8. Test without JavaScript

## Deployment Checklist

### Pre-Deploy

- [ ] Minify resources
- [ ] Optimize images
- [ ] Set cache headers
- [ ] Configure CSP
- [ ] Enable compression
- [ ] Verify SSL/TLS
- [ ] Test performance
- [ ] Check accessibility

### Post-Deploy

- [ ] Monitor errors
- [ ] Check analytics
- [ ] Verify CDN
- [ ] Test live site
- [ ] Check security
- [ ] Validate forms
- [ ] Test third-party
- [ ] Monitor performance
