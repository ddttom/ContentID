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

3. **Content Processing**
   - Markdown-to-HTML conversion
   - Dynamic block generation
   - Template-based rendering
   - Static asset serving

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
/templates/
  - template.txt  # Base template
/static/
  - header.html
  - footer.html
```

## Content Processing System

### Request Flow

1. Server receives request for HTML file (e.g., page.html)
2. System looks for corresponding markdown file (page.md)
3. Markdown is converted to HTML using the following rules:
   - Standard markdown syntax converts normally
   - Tables receive special processing
   - Content is inserted into template.txt

### Table Processing Rules

Tables in markdown are processed into block-based HTML structures:

1. First cell determines block type:

   ```markdown
   | Block Type (modifier) |  |
   | :---- | :---- |
   | content | content |
   ```

   Converts to:

   ```html
   <div class="block-type modifier">
     <div>
       <div>content</div>
       <div>content</div>
     </div>
   </div>
   ```

2. Rules:
   - First cell content becomes main class
   - Content in parentheses becomes additional class
   - Maintains nested div structure
   - Preserves markdown formatting within cells

### Template System

1. template.txt contains base HTML structure
2. Includes designated content insertion point: {{ INSERT_CONTENT_HERE }}
3. Static header.html and footer.html included in template
4. System merges converted content into template

## Implementation Guide

### Block Registry

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

### Content Processor

```javascript
export async function processContent(filepath) {
  // Read markdown file
  const mdContent = await fs.readFile(filepath, 'utf8');
  
  // Convert markdown to HTML
  let html = convertMarkdown(mdContent);
  
  // Process tables into blocks
  html = processTablesIntoBlocks(html);
  
  // Read template
  const template = await fs.readFile('template.txt', 'utf8');
  
  // Insert content
  return template.replace('{{ INSERT_CONTENT_HERE }}', html);
}

function processTablesIntoBlocks(html) {
  // Find table elements
  const tables = html.matchAll(/<table>(.*?)<\/table>/gs);
  
  for (const table of tables) {
    const firstCell = extractFirstCell(table[1]);
    const [blockType, modifier] = parseBlockType(firstCell);
    const content = convertTableToBlockContent(table[1]);
    
    const blockHtml = `
      <div class="${blockType}${modifier ? ' ' + modifier : ''}">
        <div>${content}</div>
      </div>
    `;
    
    html = html.replace(table[0], blockHtml);
  }
  
  return html;
}
```

### Loading Strategy

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

## Testing Strategy

### Content Processing Tests

1. Verify markdown conversion
2. Test table-to-block conversion
3. Validate template merging
4. Check block loading
5. Verify content integrity
6. Test special characters
7. Validate nested structures
8. Check markdown formatting

### Performance Testing

1. Run Lighthouse audits
2. Test load times
3. Monitor FCP/LCP
4. Check CLS scores
5. Verify resource loading
6. Test on slow networks
7. Monitor memory usage
8. Profile JavaScript
