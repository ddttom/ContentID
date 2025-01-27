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

Block JavaScript files should be empty by default:

```javascript
// blocks/{blockName}/{blockName}.js
export default async function decorate(block) {
  // Empty decorator - only add code if block needs specific functionality
}
```

The lib.js handles all common block functionality:

- Loading block-specific CSS
- Setting block loading status
- Managing block initialization

Block JavaScript files should only contain code when:

1. The block needs specific functionality beyond basic rendering
2. Event handlers need to be attached
3. Dynamic content needs to be managed
4. Custom initialization logic is required

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
  --color-primary: #007bff;
  --spacing-md: 1rem;
  --font-size-base: 1rem;
}

/* _reset.css - Base styles */
body {
  margin: 0;
  font-family: var(--font-family);
  line-height: var(--line-height);
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

#### Page-Specific Styles

```css
/* _index.css */
.hero {
  padding: var(--spacing-xxl) var(--spacing-md);
  text-align: center;
}

/* _list.css */
.content-table {
  width: 100%;
  border-collapse: collapse;
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
   - Use CSS custom properties
   - Define tokens in _variables.css
   - Use semantic naming
   - Maintain single source of truth

3. Components:
   - Encapsulate styles
   - Avoid deep nesting
   - Use meaningful class names
   - Keep components independent

4. Maintainability:
   - Write reusable code
   - Document complex styles
   - Use consistent formatting
   - Follow naming conventions

5. Performance:
   - Minimize specificity
   - Optimize selectors
   - Reduce redundancy
   - Use efficient properties

## JavaScript Architecture

### Module System

- Use ES Modules exclusively
- No CommonJS in renderer process
- Dynamic imports for code splitting
- Clear dependency management
- Modular block implementation

### Block Loading

```javascript
// Block loading in lib.js
export async function loadBlock(block) {
  const name = block.dataset.blockName;
  
  // Set initial loading status
  block.dataset.blockStatus = 'loading';
  
  try {
    // Load block CSS first
    await loadCSS(`blocks/${name}/${name}.css`);
    
    // Load and execute block JS if it exists and has functionality
    if (!blocks[name]) {
      try {
        const mod = await import(`../blocks/${name}/${name}.js`);
        registerBlock(name, mod);
      } catch (error) {
        console.error(`Failed to load block ${name}:`, error);
        block.dataset.blockStatus = 'error';
        return;
      }
    }
    
    // Execute block's decorate function if it exists
    if (blocks[name]) {
      await blocks[name].default(block);
    }
    
    // Set block as loaded
    block.dataset.blockStatus = 'loaded';
  } catch (error) {
    console.error(`Failed to initialize block ${name}:`, error);
    block.dataset.blockStatus = 'error';
  }
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
