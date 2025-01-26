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

/* FOUC Prevention */
body {
  opacity: 0;
  transition: opacity 0.2s ease-in;
}

body.appear {
  opacity: 1;
}

/* Block Loading States */
.block {
  opacity: 0;
  transition: opacity 0.2s ease-in;
}

.block[data-block-status="loaded"] {
  opacity: 1;
}
```

### 2. Block System

#### Block Registry

```javascript
const blocks = {};

export function registerBlock(name, mod) {
  blocks[name] = mod;
}

export async function loadBlock(block) {
  const name = block.dataset.blockName || block.classList[0];
  if (!blocks[name]) {
    try {
      const mod = await import(`../blocks/${name}/${name}.js`);
      registerBlock(name, mod);
    } catch (error) {
      console.error(`Failed to load block ${name}:`, error);
      return;
    }
  }
  await blocks[name].default(block);
}
```

#### Block Structure

```javascript
// blocks/example/example.js
import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  // Load block CSS
  await loadCSS(`/blocks/${block.dataset.blockName}/${block.dataset.blockName}.css`);
  
  // Status tracking
  block.dataset.blockStatus = 'loading';
  
  // DOM manipulation
  const wrapper = document.createElement('div');
  wrapper.className = 'example-wrapper';
  block.parentNode.insertBefore(wrapper, block);
  wrapper.appendChild(block);
  
  block.dataset.blockStatus = 'loaded';
}
```

### 3. Common Blocks

#### Header Block

```javascript
// blocks/header/header.js
import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  await loadCSS('/blocks/header/header.css');
  
  // Header implementation...
}
```

#### Footer Block

```javascript
// blocks/footer/footer.js
import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  await loadCSS('/blocks/footer/footer.css');
  
  // Footer implementation...
}
```

#### Hero Block

```javascript
// blocks/hero/hero.js
import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  await loadCSS('/blocks/hero/hero.css');
  
  // Hero implementation...
}
```

#### Content Block

```javascript
// blocks/content/content.js
import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  await loadCSS('/blocks/content/content.css');
  
  // Content implementation...
}
```

#### Steps Block

```javascript
// blocks/steps/steps.js
import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  await loadCSS('/blocks/steps/steps.css');
  
  // Steps implementation...
}
```

### 4. Loading Strategy

#### E-L-D Implementation

```javascript
const loadPage = async () => {
  // Eager: Critical
  await loadHeader();
  document.body.classList.add('appear');
  
  // Lazy: Non-critical
  requestIdleCallback(() => {
    loadFooter();
    initializeBlocks();
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
