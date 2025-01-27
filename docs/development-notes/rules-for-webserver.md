# Modern Web Architecture Guide

## Core Principles

1. **E-L-D Loading Pattern**
   - Eager: Critical content for LCP
   - Lazy: Non-critical content
   - Delayed: Third-party content

2. **Component-Based Architecture**
   - Modular components
   - Progressive enhancement
   - Independent loading
   - Isolated styling

3. **Performance First**
   - Target Lighthouse 100
   - No bundling required
   - HTTP/3 optimized
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

### 4. Loading Strategy

#### E-L-D Implementation

```javascript
const loadPage = async () => {
  // Eager: Critical
  await loadCommonComponents();
  document.body.classList.add('appear');
  
  // Lazy: Non-critical
  requestIdleCallback(() => {
    initializeComponents();
  });
  
  // Delayed: Third-party
  setTimeout(() => {
    loadThirdParty();
  }, 3000);
};
```

### 5. Best Practices

#### Performance Checklist

- [ ] Implement E-L-D pattern
- [ ] Optimize images with WebP
- [ ] Lazy load below-fold content
- [ ] Use intersection observer
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
