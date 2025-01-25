# Web Development Guide

## Core Principles

1. **E-L-D Loading Pattern**
   - Eager: Critical content for largest contentful paint (LCP)
   - Lazy: Non-critical content loaded after LCP
   - Delayed: Third-party and non-essential content

2. **Modern Web Standards**
   - Use vanilla JavaScript and CSS3
   - Avoid external libraries/frameworks
   - Leverage modern browser APIs
   - HTTP/3 optimized

3. **Performance First**
   - Target Lighthouse scores of 100
   - No bundling required
   - Source code coordination instead of bundling
   - Optimized asset delivery

## Web Server Optimization

### HTTP/2 Implementation

- Use spdy package for HTTP/2 support
- Configure protocols: ['h2', 'http/1.1']
- Enable plain text mode for development
- Set appropriate timeouts and keep-alive settings

### Compression Middleware

- Use compression package with level 6
- Set threshold to 1024 bytes
- Implement custom filter for selective compression
- Configure cache control headers for compressed responses

### Security Headers

- Use helmet package for security headers
- Configure Content Security Policy
- Enable Strict-Transport-Security
- Set Referrer-Policy to same-origin
- Add X-Content-Type-Options and X-Frame-Options

### Rate Limiting

- Implement express-rate-limit
- Set window to 15 minutes
- Limit to 100 requests per IP
- Configure appropriate error responses

### Static File Serving

- Set cache control headers for static files
- HTML files: no-store
- Other assets: public, max-age=31536000, immutable
- Configure proper MIME types

## Project Structure

```bash
renderer/
        ├── blocks/           # Reusable components
        │   ├── header/      # Each block has its own directory
        │   │   ├── header.css
        │   │   ├── header.js
        │   │   └── README.md
        ├── scripts/
        │   ├── main.js      # Core JavaScript
        │   └── lib.js       # Utilities
        ├── styles/
        │   ├── styles.css   # Global styles
        │   └── lazy.css     # Non-critical styles
```

## Block Pattern

Blocks are self-contained components with:

1. HTML Structure:

```html
<div class="blockname-wrapper">
  <div class="blockname block">
    <!-- Block content -->
  </div>
</div>
```

CSS Pattern:

```css
.blockname {
  /* Base styles */
}

.blockname-wrapper {
  /* Wrapper styles */
}

@media (min-width: 900px) {
  /* Desktop styles */
}
```

JavaScript Pattern:

```javascript
export default async function decorate(block) {
  // DOM manipulation
  // Event listeners
  // Dynamic styling
}
```

## Loading Strategy

**Head.html

```html
<head>
  <link rel="stylesheet" href="styles/styles.css">
  <script type="module" src="scripts/lib.js"></script>
  <script type="module" src="scripts/main.js"></script>
</head>
```

**Main.js

```javascript
// E-L-D Pattern
const loadPage = async () => {
  // Eager: Critical content
  await loadCriticalContent();
  
  // Lazy: Non-critical content
  requestIdleCallback(() => {
    loadLazyStyles();
    loadBlocks();
  });
  
  // Delayed: Third-party content
  setTimeout(() => {
    loadThirdParty();
  }, 3000);
};
```

## Block Loading

**Block Registry:

```javascript
const blocks = {};

export function registerBlock(name, mod) {
  blocks[name] = mod;
}
```

**Block Loading:

```javascript
async function loadBlock(block) {
  const name = block.classList[0];
  if (!blocks[name]) {
    const mod = await import(`../blocks/${name}/${name}.js`);
    registerBlock(name, mod);
  }
  await blocks[name].default(block);
}
```

## Style Loading

**Critical Styles** (styles.css):

```css
/* Above-the-fold styles */
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

**Lazy Styles** (lazy.css):

```css
/* Below-the-fold styles */
/* Complex animations */
/* Non-critical components */
```

## DOM Decoration

```javascript
function decorateBlock(block) {
  const wrapper = document.createElement('div');
  wrapper.className = `${block.className}-wrapper`;
  block.parentNode.insertBefore(wrapper, block);
  wrapper.appendChild(block);
}
```

## Performance Optimizations

**Image Loading**:

```javascript
function createOptimizedPicture(src, alt, eager) {
  const picture = document.createElement('picture');
  const img = document.createElement('img');
  img.alt = alt;
  img.loading = eager ? 'eager' : 'lazy';
  picture.appendChild(img);
  return picture;
}
```

**Intersection Observer**:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadBlock(entry.target);
      observer.unobserve(entry.target);
    }
  });
});
```

## Best Practices

**Performance

- Load critical content first
- Lazy load below-the-fold content
- Defer non-essential scripts
- Use modern image formats (WebP)

**Code Organization

- Keep blocks self-contained
- Use semantic HTML
- Follow CSS naming conventions
- Document block usage

**Accessibility

- Use proper ARIA attributes
- Ensure keyboard navigation
- Maintain semantic structure
- Test with screen readers

**Browser Support

- Target modern browsers
- Use feature detection
- Provide fallbacks where needed
- Test across platforms
