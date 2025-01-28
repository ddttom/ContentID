# ContentID Webpage Development Rules

## Core Architecture

### Component-Based Architecture

- Modular components
- Progressive enhancement
- Independent loading
- Isolated styling
- Clear separation of concerns

## HTML Standards

### Base Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self';">
  <base href="./">
  <title>ContentID Manager</title>
  <link rel="stylesheet" href="styles/styles.css">
  <script type="module" src="scripts/init.js"></script>
</head>
<body>
  <div id="header-container"></div>
  <main role="main">
    <!-- Page content -->
  </main>
  <div id="footer-container"></div>
</body>
</html>
```

### Component HTML Structure

```html
<!-- Header Component Container -->
<div id="header-container"></div>

<!-- Footer Component Container -->
<div id="footer-container"></div>
```

### Component Loading

```javascript
// init.js
import { loadCommonComponents } from './components.js';

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadCommonComponents();
});

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
```

## CSS Implementation

### Directory Structure

```bash
styles/
├── base/
│   ├── _variables.css    # Design tokens and CSS custom properties
│   ├── _reset.css        # Base styles and resets
│   └── _utilities.css    # Utility classes
├── components/
│   ├── _header.css       # Header component styles
│   ├── _footer.css       # Footer component styles
│   └── _forms.css        # Shared form styles
├── pages/
│   ├── _index.css        # Landing page styles
│   ├── _list.css         # Content listing styles
│   ├── _entry.css        # Content entry styles
│   └── _editor.css       # Content editor styles
└── styles.css            # Main stylesheet with imports
```

### CSS Organization

#### Base Styles

```css
/* _variables.css - Design tokens */
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-primary-light: #3395ff;
  --color-background: #ffffff;
  --color-background-light: #f8f9fa;
  --color-text: #1d1d1f;
  --color-text-light: #6c757d;
  --color-border: #dee2e6;
  --color-success: #28a745;
  --color-warning: #ffc107;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 4rem;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-xxl: 1.5rem;
  --font-size-xxxl: 2rem;

  /* Font weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Line heights */
  --line-height: 1.5;
  --line-height-tight: 1.25;

  /* Container widths */
  --container-max-width: 1200px;

  /* Border radius */
  --border-radius: 4px;
  --border-radius-lg: 8px;

  /* Box shadows */
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --box-shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* _reset.css - Base styles */
body {
  margin: 0;
  font-family: var(--font-family);
  line-height: var(--line-height);
  color: var(--color-text);
  background: var(--color-background);
}

/* _utilities.css - Helper classes */
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
  background: var(--color-background);
  box-shadow: var(--box-shadow);
}

/* _footer.css */
.footer {
  background: var(--color-background-light);
  padding: var(--spacing-xl) 0;
}

/* _forms.css */
.form-group {
  margin-bottom: var(--spacing-lg);
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

### CSS Best Practices

1. Organization:
   - Group related styles together
   - Use consistent naming patterns
   - Maintain clear file structure
   - Follow import order

2. Variables:
   - Use CSS custom properties for all theme values
   - Define tokens in _variables.css
   - Use semantic naming (e.g., --color-primary vs --blue)
   - Maintain single source of truth
   - Use consistent variable naming patterns:
     * Colors: --color-{purpose}
     * Spacing: --spacing-{size}
     * Typography: --font-size-{size}
     * Components: --{component}-{property}

3. Components:
   - Encapsulate styles
   - Avoid deep nesting
   - Use meaningful class names
   - Keep components independent
   - Follow consistent spacing patterns
   - Use theme variables for all values

4. Maintainability:
   - Write reusable code
   - Document complex styles
   - Use consistent formatting
   - Follow naming conventions
   - Maintain responsive design patterns
   - Use grid system consistently

5. Performance:
   - Minimize specificity
   - Optimize selectors
   - Reduce redundancy
   - Use efficient properties
   - Leverage CSS Grid and Flexbox
   - Implement mobile-first approach

6. Theme Consistency:
   - Use variables for all theme-related values
   - Maintain consistent spacing scale
   - Follow typography hierarchy
   - Use standard color palette
   - Apply consistent shadows and borders
   - Implement standard grid layouts
   - Use defined breakpoints for responsiveness

## JavaScript Architecture

### Module System

- Use ES Modules exclusively
- Dynamic imports for code splitting
- Clear dependency management
- Modular component implementation

### Performance Guidelines

- Optimize critical rendering path
- Minimize initial payload
- Use appropriate image formats
- Enable text compression
- Efficient DOM operations
- Debounce event handlers
- Use requestAnimationFrame
- Monitor memory usage

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

  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
```

### Semantic Structure

- Use semantic HTML5 elements
- Maintain proper heading hierarchy
- Implement landmark regions
- Provide skip links
- Include proper meta information
- Ensure proper color contrast
- Use appropriate text alternatives
- Implement proper focus indicators

## Testing Requirements

### Unit Testing

- Test component functionality
- Validate state changes
- Check event handlers
- Verify data flow
- Test error scenarios

### Integration Testing

- Test component interactions
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

### Component Documentation

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
