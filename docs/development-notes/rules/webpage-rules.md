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

### Page Structure Rules

1. Container Elements:
   - Avoid unnecessary wrapper elements
   - Apply styles directly to semantic elements where possible
   - Use container classes only when needed for width constraints
   - Maintain proper spacing through CSS variables

2. Section Organization:
   ```html
   <section class="hero" aria-labelledby="section-title">
     <h1 id="section-title">Section Title</h1>
     <div class="content">
       <!-- Direct content here, no extra wrappers -->
     </div>
   </section>
   ```

3. Grid Layouts:
   ```html
   <div class="grid" role="list">
     <div class="item" role="listitem">
       <!-- Direct content here -->
     </div>
   </div>
   ```

### Header Component Rules

- Marketing navigation (Features, Pricing, About) only shown on index.html
- Other pages show only Home link and Login button
- Each page has a toolbar underneath header with page-specific actions

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
└── styles.css            # Main stylesheet
```

### CSS Organization

#### Base Styles

```css
/* _variables.css - Design tokens */
:root {
  /* Colors */
  --primary: #007AFF;
  --primary-dark: #0051A8;
  --primary-light: #47A3FF;
  --accent: #FF9500;
  
  /* Text colors */
  --text-dark: #1D1D1F;
  --text-light: #FFFFFF;
  --text-muted: #86868B;
  
  /* Background colors */
  --bg-white: #FFFFFF;
  --bg-light: #F5F5F7;
  
  /* Border colors */
  --border-color: #D2D2D7;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Border radius */
  --border-radius: 8px;
  --border-radius-sm: 4px;
  --border-radius-lg: 12px;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  
  /* Container widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;

  /* Component sizes */
  --header-height: 4rem;
  --toolbar-height: 3rem;
  --side-padding: max(var(--spacing-md), calc((100vw - var(--container-xl)) / 2));
}
```

### CSS Best Practices

1. Organization:
   - Group related styles together
   - Use consistent naming patterns
   - Maintain clear file structure
   - Follow import order
   - Keep all styles in appropriate CSS files (no inline styles)

2. Variables:
   - Use CSS custom properties for all theme values
   - Define tokens in _variables.css
   - Use semantic naming
   - Maintain single source of truth
   - Use consistent variable naming patterns:
     - Colors: --primary, --text-dark, etc.
     - Spacing: --spacing-{size}
     - Components: --{component}-{property}

3. Components:
   - Encapsulate styles
   - Avoid deep nesting
   - Use meaningful class names
   - Keep components independent
   - Follow consistent spacing patterns:
     - Use --spacing-xl for section margins
     - Use --spacing-md for form element padding
     - Use --spacing-sm for tight spacing
   - Use theme variables for all values

4. Layout Patterns:
   - Use white background cards with shadows for content sections
   - Apply consistent border radius and shadows
   - Maintain proper spacing between elements
   - Use grid layouts for responsive design
   - Alternate section backgrounds (light/white) for visual balance
   - Add subtle hover effects for interactive elements

5. Section Styling:
   - Hero sections:
     - White background card with shadow
     - Centered content with proper spacing
     - Clear call-to-action buttons
   - Feature sections:
     - Light background cards with shadow
     - Consistent spacing and typography
     - Subtle hover effects
   - Step sections:
     - White cards with prominent number circles
     - Clear text hierarchy
     - Proper spacing between elements
     - Enhanced visual hierarchy

6. Performance:
   - Minimize specificity
   - Optimize selectors
   - Reduce redundancy
   - Use efficient properties
   - Leverage CSS Grid and Flexbox
   - Implement mobile-first approach

7. Theme Consistency:
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
