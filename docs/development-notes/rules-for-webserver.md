# Modern Web Architecture Guide

## Core Principles

1. **E-L-D Loading Pattern**
   - Eager: Critical content for LCP
   - Lazy: Non-critical content
   - Delayed: Third-party content

2. **Block-Based Architecture**
   - Self-contained components
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
/blocks/
  /{blockName}/
    - {blockName}.css
    - {blockName}.js
    - README.md
/scripts/
  - lib.js      # Utilities
  - main.js     # Core app
/styles/
  - styles.css  # Critical
  - lazy.css    # Non-critical
/utils/
  - decorators.js
  - loaders.js
```

## Implementation Guide

### 1. Core Infrastructure

#### Head Setup

```html
<head>
  <link rel="stylesheet" href="styles/styles.css">
  <script type="module" src="scripts/lib.js"></script>
  <script type="module" src="scripts/main.js"></script>
</head>
```

### Critical CSS

```css
:root {
  --body-font: system-ui;
  --heading-font: system-ui;
}

body {
  font-family: var(--body-font);
  margin: 0;
  display: none;
}

body.appear {
  display: block;
}
```

### 2. Special Blocks (Header/Footer)

#### Header Loading

```javascript
async function loadHeader(header) {
  const headerBlock = buildBlock('header', '');
  header.append(headerBlock);
  decorateBlock(headerBlock);
  return loadBlock(headerBlock);
}

// Usage in main.js
const header = document.querySelector('header');
if (header) {
  await loadHeader(header);
}
```

#### Footer Loading

```javascript
async function loadFooter(footer) {
  const footerBlock = buildBlock('footer', '');
  footer.append(footerBlock);
  decorateBlock(footerBlock);
  return loadBlock(footerBlock);
}

// Usage in main.js
const footer = document.querySelector('footer');
if (footer) {
  await loadFooter(footer);
}
```

#### Special Block Structure

```bash
/blocks/
  /header/
    - header.css    # Header-specific styles
    - header.js     # Header decoration and behavior
  /footer/
    - footer.css    # Footer-specific styles
    - footer.js     # Footer decoration and behavior
```

#### Block Building Utility

```javascript
function buildBlock(name, content) {
  const block = document.createElement('div');
  block.classList.add(name);
  block.classList.add('block');
  block.dataset.blockName = name;
  
  if (content) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = content;
    block.append(wrapper);
  }
  
  return block;
}
```

### 3. Block System

#### Block Registry

```javascript
const blocks = {};

export function registerBlock(name, mod) {
  blocks[name] = mod;
}

async function loadBlock(block) {
  const name = block.classList[0];
  if (!blocks[name]) {
    const mod = await import(`../blocks/${name}/${name}.js`);
    registerBlock(name, mod);
  }
  await blocks[name].default(block);
}
```

#### Block Structure

```javascript
// blocks/example/example.js
export default async function decorate(block) {
  // Status tracking
  block.dataset.blockStatus = 'loading';
  
  // DOM manipulation
  const wrapper = document.createElement('div');
  wrapper.className = 'example-wrapper';
  block.parentNode.insertBefore(wrapper, block);
  wrapper.appendChild(block);
  
  // Load resources
  await Promise.all([
    loadCSS(`blocks/example/example.css`),
    loadBlockResources(block)
  ]);
  
  block.dataset.blockStatus = 'loaded';
}
```

### 4. Loading Strategy

#### E-L-D Implementation

```javascript
const loadPage = async () => {
  // Eager: Critical
  await loadCriticalContent();
  document.body.classList.add('appear');
  
  // Lazy: Non-critical
  requestIdleCallback(() => {
    loadLazyStyles();
    initializeBlocks();
  });
  
  // Delayed: Third-party
  setTimeout(() => {
    loadThirdParty();
  }, 3000);
};
```

#### Resource Loading

```javascript
async function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    } else {
      resolve();
    }
  });
}

async function loadScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.src = src;
      Object.entries(attrs).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}
```

### 5. Performance Optimizations

#### Image Optimization

```javascript
function createOptimizedPicture(src, alt, eager = false, breakpoints = [
  { width: 400, media: '(max-width: 400px)' },
  { width: 800, media: '(max-width: 800px)' },
  { width: 1200, media: '(max-width: 1200px)' },
  { width: 2000 }
]) {
  const picture = document.createElement('picture');
  
  breakpoints.forEach(({ width, media }) => {
    const source = document.createElement('source');
    if (media) source.setAttribute('media', media);
    source.setAttribute('srcset', `${src}?width=${width}&format=webp`);
    source.setAttribute('type', 'image/webp');
    picture.appendChild(source);
  });
  
  const img = document.createElement('img');
  img.src = `${src}?width=2000`;
  img.alt = alt;
  img.loading = eager ? 'eager' : 'lazy';
  picture.appendChild(img);
  
  return picture;
}
```

#### Intersection Observer

```javascript
const blockObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadBlock(entry.target);
      blockObserver.unobserve(entry.target);
    }
  });
}, {
  rootMargin: '50px 0px'
});

function initializeBlocks() {
  document.querySelectorAll('.block').forEach(block => {
    blockObserver.observe(block);
  });
}
```

### 6. Best Practices

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

- [ ] Keep blocks isolated
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
