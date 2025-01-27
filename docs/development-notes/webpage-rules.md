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

1. **Block Implementation Pattern

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

- Proper role attributes
- Meaningful labels
- Keyboard navigation
- Focus management
- Screen reader support

### Semantic Structure

- Use semantic HTML elements
- Maintain heading hierarchy
- Provide alt text
- Implement ARIA landmarks
- Ensure color contrast

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
