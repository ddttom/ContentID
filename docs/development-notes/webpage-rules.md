# ContentID Webpage Development Rules

## Core Architecture

### Block-Based Architecture

**Block Definition

- Self-contained functional components
- Independent CSS and JavaScript
- Progressive enhancement pattern
- Isolated state management
- Clear data-block-name attributes

**Block Structure

```bash
blocks/
├── {blockName}/
│   ├── {blockName}.css
│   ├── {blockName}.js
│   └── README.md
```

**Block Implementation Pattern

```javascript
// blocks/{blockName}/{blockName}.js
import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  await loadCSS(`/blocks/${block.dataset.blockName}/${block.dataset.blockName}.css`);
  block.dataset.blockStatus = 'loading';
  
  // Block implementation
  
  block.dataset.blockStatus = 'loaded';
}
```

### Loading Strategy (E-L-D Pattern)

1. **Eager Loading**
   - Critical UI components
   - Above-the-fold content
   - Core functionality
   - Navigation elements
   - Essential forms

2. **Lazy Loading**
   - Below-fold content
   - Secondary features
   - Non-critical images
   - Additional blocks
   - Supplementary data

3. **Delayed Loading**
   - Analytics
   - Third-party widgets
   - Social media integrations
   - Background processes
   - Enhancement features

## HTML Standards

### Base Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ContentID Manager</title>
  <link rel="stylesheet" href="styles/styles.css">
  <script type="module" src="scripts/lib.js"></script>
  <script type="module" src="scripts/main.js"></script>
</head>
<body>
  <!-- Block-based content structure -->
</body>
</html>
```

### Block HTML Structure

```html
<div class="block" data-block-name="example">
  <div class="example-content">
    <!-- Block-specific content -->
  </div>
</div>
```

## CSS Implementation

### Naming Convention

- Follow BEM (Block Element Modifier) methodology
- Use descriptive, semantic class names
- Maintain consistent naming patterns
- Avoid deep nesting
- Use data attributes for states

### CSS Organization

```css
/* Block container */
.block {
  opacity: 0;
  transition: opacity 0.2s ease-in;
}

.block[data-block-status="loaded"] {
  opacity: 1;
}

/* Block-specific styles */
.example-content {
  /* Component styles */
}

/* Responsive design */
@media (max-width: 768px) {
  /* Tablet styles */
}

@media (max-width: 480px) {
  /* Mobile styles */
}
```

## JavaScript Architecture

### Module System

- Use ES Modules exclusively
- No CommonJS in renderer process
- Dynamic imports for code splitting
- Clear dependency management
- Modular block implementation

### Block Loading

```javascript
const blocks = {};

export function registerBlock(name, mod) {
  blocks[name] = mod;
}

export async function loadBlock(block) {
  const name = block.dataset.blockName;
  if (!blocks[name]) {
    const mod = await import(`../blocks/${name}/${name}.js`);
    registerBlock(name, mod);
  }
  await blocks[name].default(block);
}
```

### State Management

- Block-level state containment
- Event-driven updates
- Clear data flow
- Predictable state changes
- Error boundary implementation

## Performance Guidelines

### Loading Performance

- Implement E-L-D pattern
- Optimize critical rendering path
- Minimize initial payload
- Use appropriate image formats
- Enable text compression

### Runtime Performance

- Efficient DOM operations
- Debounce event handlers
- Use requestAnimationFrame
- Optimize loops and iterations
- Monitor memory usage

### CSS Performance

- Minimize specificity
- Use efficient selectors
- Avoid expensive properties
- Optimize transitions
- Reduce paint operations

## Security Requirements

### Content Security Policy

```text
default-src 'self';
style-src 'self' 'unsafe-inline';
script-src 'self';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
```

### Input Validation

- Sanitize user input
- Validate data types
- Implement CSRF protection
- Secure form handling
- XSS prevention

## Accessibility Standards

### ARIA Implementation

#### Required ARIA Landmarks

```html
<body>
  <header role="banner">
    <!-- Site header content -->
  </header>

  <nav role="navigation" aria-label="Main">
    <!-- Navigation content -->
  </nav>

  <main role="main">
    <!-- Main content -->
  </main>

  <aside role="complementary">
    <!-- Sidebar content -->
  </aside>

  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
```

#### Block-Level ARIA Requirements

```html
<!-- Standard Block Pattern -->
<div 
  class="block" 
  data-block-name="example"
  role="region"
  aria-labelledby="block-title"
>
  <h2 id="block-title">Block Title</h2>
  <!-- Block content -->
</div>

<!-- Interactive Block Pattern -->
<div 
  class="block" 
  data-block-name="form"
  role="form"
  aria-labelledby="form-title"
  aria-describedby="form-desc"
>
  <h2 id="form-title">Form Title</h2>
  <p id="form-desc">Form description</p>
  <!-- Form content -->
</div>
```

#### Interactive Elements

```html
<!-- Buttons -->
<button 
  aria-label="Close dialog" 
  aria-pressed="false"
  aria-controls="dialog-1"
>
  <span aria-hidden="true">&times;</span>
</button>

<!-- Links -->
<a 
  href="list.html" 
  role="button" 
  aria-label="Get Started with ContentID"
>
  Get Started
</a>

<!-- Form Controls -->
<label for="search">Search content</label>
<input 
  type="search" 
  id="search" 
  aria-describedby="search-help"
  aria-required="true"
>
<span id="search-help">Enter keywords to search content</span>
```

#### Dynamic Content

```html
<!-- Status Messages -->
<div 
  role="status" 
  aria-live="polite"
  aria-atomic="true"
>
  Changes saved successfully
</div>

<!-- Error Messages -->
<div 
  role="alert" 
  aria-live="assertive"
  aria-atomic="true"
>
  Please correct the form errors
</div>
```

### Semantic Structure

- Use semantic HTML5 elements (header, nav, main, etc.)
- Maintain proper heading hierarchy (h1-h6)
- Implement landmark regions with ARIA roles
- Provide skip links for keyboard navigation
- Include proper meta information
- Ensure proper color contrast (WCAG 2.1 AA)
- Use appropriate text alternatives
- Implement proper focus indicators

## Testing Requirements

### Unit Testing

- Test block functionality
- Validate state changes
- Check event handlers
- Verify data flow
- Test error scenarios

### Integration Testing

- Test block interactions
- Validate loading patterns
- Check state propagation
- Test form submissions
- Verify API integration

### Performance Testing

- Measure load times
- Monitor memory usage
- Test responsiveness
- Verify optimization
- Check resource loading

## Documentation Standards

### Block Documentation

- Implementation details
- Usage examples
- Props/parameters
- Event handling
- State management

### Code Comments

- Clear function purpose
- Complex logic explanation
- Important warnings
- API documentation
- Usage notes

## Version Control

### Branch Strategy

- Feature branches
- Clean commits
- Meaningful messages
- Regular updates
- Proper tagging

### Code Review

- Performance review
- Security check
- Accessibility audit
- Style compliance
- Documentation check
