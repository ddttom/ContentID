# ContentID HTML Pages Implementation

## Overview

Create HTML pages for ContentID database management following the Block-Based Architecture defined in `webpage-rules.md` and maintaining compatibility with Electron's architecture from `architecture.md`.

## Page Requirements

### Base HTML Template (following webpage-rules.md)

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
  <!-- Structure defined in webpage-rules.md -->
</body>
</html>
```

## Required Pages

### 1. Content List Page (`list.html`)

Purpose: Display paginated table of all content items

Structure:

- Header block with search and filters
- Main content block with paginated table
- Table columns:
  - ID (GUID)
  - Title
  - Type
  - Approval Status
  - Created Date
  - Valid Until
- Action buttons for edit/view
- Footer block with pagination controls
- Follow Block-Based Architecture from webpage-rules.md

### 2. Content Entry Form (`entry.html`)

Purpose: Create new content entries

Structure:

- Form sections matching screenshot layout:
  - Content Details
  - Variations
  - Content Blocks
  - Approvals
  - Usage Parameters
  - Brand Requirements
  - Temporal Context
  - Content Relationships
- Save/Cancel actions
- Draft saving functionality
- Follow Block-Based Architecture

### 3. Content Editor (`editor.html`)

Purpose: Edit existing content entries

Structure:

- Load existing content data
- Same sections as entry form
- Show version history
- Display approval status
- Update/Delete actions
- Follow Block-Based Architecture

## Implementation Requirements

### HTML Structure

- Use semantic HTML5 elements
- Follow Block-Based Architecture
- Implement data-block-name attributes
- Use proper ARIA attributes
- Follow content hierarchy

### JavaScript Modules

- Create separate modules for:
  - Database operations
  - Form handling
  - Table pagination
  - Content validation
- Use ES Modules as specified in architecture.md
- Follow E-L-D Loading Pattern

### CSS Implementation

- Link styles as specified in webpage-rules.md
- Use BEM naming convention
- Implement responsive design
- Follow project's style guidelines
- Avoid CSS preprocessors as per Rules document

### Data Storage

- Use local JSON file storage
- Implement GUID-based indexing
- Handle data validation
- Manage file read/write operations
- Follow project's security guidelines

## Block Implementation Examples

### Table Block

```javascript
// blocks/contentTable/contentTable.js
export default async function decorate(block) {
  await loadCSS(`/blocks/contentTable/contentTable.css`);
  block.dataset.blockStatus = 'loading';
  
  // Table implementation
  // Pagination controls
  // Sort/Filter functionality
  
  block.dataset.blockStatus = 'loaded';
}
```

### Form Block

```javascript
// blocks/contentForm/contentForm.js
export default async function decorate(block) {
  await loadCSS(`/blocks/contentForm/contentForm.css`);
  block.dataset.blockStatus = 'loading';
  
  // Form fields implementation
  // Validation logic
  // Save functionality
  
  block.dataset.blockStatus = 'loaded';
}
```

## Loading Strategy

Follow E-L-D Pattern from webpage-rules.md:

1. Eager: Critical UI elements
2. Lazy: Non-critical content
3. Delayed: Additional features

## Security Requirements

- Follow CSP headers from architecture.md
- Implement input validation
- Secure local file access
- Follow project's security guidelines

## IPC Communication

### Main Process Handlers

- Define handlers for:
  - File operations (read/write JSON)
  - Content validation
  - System operations
  - Error handling

### Preload Script Bridge

```javascript
// Following architecture.md guidelines
contextBridge.exposeInMainWorld('contentAPI', {
  saveContent: (data) => ipcRenderer.invoke('content:save', data),
  loadContent: () => ipcRenderer.invoke('content:load'),
  deleteContent: (id) => ipcRenderer.invoke('content:delete', id),
  validateContent: (data) => ipcRenderer.invoke('content:validate', data)
});
```

### Renderer Process Usage

```javascript
// Proper error handling pattern
try {
  const content = await window.contentAPI.loadContent();
} catch (error) {
  // Handle error according to architecture.md guidelines
}
```

## State Management

### Local Storage Structure

```javascript
{
  currentPage: number,
  sortColumn: string,
  sortDirection: string,
  filters: Object,
  draftContent: Object,
  lastUpdate: string
}
```

### Page State Handling

- Implement state persistence between page loads
- Handle navigation state
- Manage form drafts
- Track user preferences
- Handle sorting/filtering state

## Error Handling Patterns

### User Interface Errors

- Form validation feedback
- Data loading errors
- Save operation failures
- Network connectivity issues

### System Errors

- File system errors
- IPC communication failures
- JSON parsing errors
- State management errors

### Error Recovery

- Auto-save functionality
- Draft recovery
- State restoration
- Error retry logic

## Performance Optimization

### Content Loading

- Implement virtual scrolling for large datasets
- Lazy load content details
- Cache frequently accessed data
- Optimize JSON parsing

### UI Responsiveness

- Debounce search inputs
- Throttle scroll handlers
- Optimize DOM updates
- Use requestAnimationFrame

### Memory Management

- Clear unused cached data
- Implement proper cleanup
- Monitor memory usage
- Handle large datasets efficiently

## Page Testing

- Verify HTML validity
- Test responsive design
- Check accessibility
- Validate data handling
- Test navigation flow

## File System Operations

### JSON Database Operations

```javascript
// Following architecture.md patterns
const dbPath = path.join(app.getPath('userData'), 'content.json');

async function readDatabase() {
  try {
    const data = await fs.promises.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    handleFileError(error);
  }
}

async function writeDatabase(data) {
  try {
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    handleFileError(error);
  }
}
```

### File Watching

- Implement file system watchers
- Handle external changes
- Manage file locks
- Implement auto-backup

## Content Validation Rules

### Required Fields

- Title (string, required)
- Type (string, required)
- Description (string, required)
- Created Date (ISO string, required)
- Valid Until (ISO string, required)

### Data Type Validation

- GUID format validation
- Date format validation
- String length limits
- Relationship validation

### Business Rules

- Approval workflow validation
- Content relationship rules
- Version control rules
- Usage rights validation

## Documentation

- Comment HTML structure
- Document block implementation
- Explain data flow
- Include usage examples
- Provide troubleshooting guide
