# Database Usage Guidelines

## Overview

ContentID uses a JSON-based database for storing content entries and their associated metadata. The database is implemented as a file-based system for the POC phase, with a focus on simplicity and ease of development.

## Database Structure

### Location

The database files are located in `src/services/db/`:

- `content.json`: Main database file containing content entries and metadata
- `contentDb.js`: Service implementation for database operations

### Schema

```json
{
  "content": [],        // Array of content entries
  "metadata": {
    "lastId": 0,        // Auto-incrementing ID counter
    "version": "1.0.0"  // Database schema version
  }
}
```

### Content Entry Structure

```json
{
  "id": "number",
  "title": "string",
  "type": "string",
  "description": "string",
  "variations": {
    "social": "string",
    "email": "string",
    "print": "string"
  },
  "blocks": {
    "paragraph": "string",
    "features": ["string"]  // Array of feature items
  },
  "approvals": {
    "legal": {
      "status": "string",
      "timestamp": "string",
      "approver": "string"
    },
    "marketing": {
      "status": "string",
      "timestamp": "string",
      "approver": "string"
    },
    "compliance": {
      "status": "string",
      "timestamp": "string",
      "approver": "string"
    }
  },
  "usage": {
    "regions": ["string"],
    "translatable": "boolean",
    "verbatim_required": "boolean",
    "restrictions": {
      "embargo": "string",
      "confidentiality": "string",
      "usage_rights": "string"
    }
  },
  "brand": {
    "trademark_required": "boolean",
    "slogan_required": "boolean",
    "style": {
      "font": "string",
      "color": "string",
      "spacing": "string"
    }
  },
  "temporal": {
    "created_date": "string",
    "valid_until": "string",
    "version": "number"
  },
  "relationships": [{
    "type": "string",
    "id": "string"
  }],
  "verification": {
    "digital_signature": "string",
    "content_hash": "string",
    "trust_chain": [{
      "authority": "string",
      "signature": "string",
      "timestamp": "string"
    }],
    "status": "string"
  },
  "audit": {
    "created_at": "string",
    "updated_at": "string",
    "created_by": "string",
    "version_history": [{
      "version": "number",
      "timestamp": "string",
      "changes": "string",
      "editor": "string"
    }]
  }
}
```

## Using the Database Service

### Import

```javascript
import { contentDb } from '../services/db/contentDb.js';
```

### Initialize

The service auto-initializes on first operation, but you can explicitly initialize:

```javascript
await contentDb.init();
```

### Operations

#### Create Content

```javascript
const content = await contentDb.create({
  title: "Example Content",
  type: "product_name",
  description: "Product description here",
  // ... other fields as per schema
});
```

#### Get Content

```javascript
const content = await contentDb.get(id);
```

#### Update Content

```javascript
const updated = await contentDb.update(id, {
  title: "Updated Title",
  // ... fields to update
});
```

#### Delete Content

```javascript
await contentDb.delete(id);
```

#### List All Content

```javascript
const allContent = await contentDb.list();
```

#### Verify Content

```javascript
const isValid = await contentDb.verify(id);
```

## API Endpoints

The database is accessible through the following REST endpoints:

### POST /api/content

Create new content entry

```javascript
fetch('/api/content', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: "Example Content",
    type: "product_name",
    // ... other fields
  })
});
```

### GET /api/content/:id

Retrieve content by ID

```javascript
fetch('/api/content/123');
```

### PUT /api/content/:id

Update existing content

```javascript
fetch('/api/content/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: "Updated Title",
    // ... fields to update
  })
});
```

### GET /api/content

List all content

```javascript
fetch('/api/content');
```

### DELETE /api/content/:id

Delete content

```javascript
fetch('/api/content/123', {
  method: 'DELETE'
});
```

### GET /api/content/:id/verify

Verify content authenticity

```javascript
fetch('/api/content/123/verify');
```

## Best Practices

1. **Error Handling**
   - Always use try/catch blocks with async operations
   - Handle database initialization failures
   - Validate input data before saving

2. **Data Validation**
   - Ensure required fields are present
   - Validate data types match schema
   - Check relationship IDs exist

3. **Performance**
   - Use list operation sparingly with large datasets
   - Consider pagination for large result sets
   - Cache frequently accessed content

4. **Security**
   - Validate input data to prevent injection
   - Use proper error messages (don't expose internal details)
   - Implement proper access controls

5. **Maintenance**
   - Regular backups of content.json
   - Monitor file size and performance
   - Plan for future scaling beyond file-based storage

## Future Considerations

1. **Scaling**
   - Migration to proper database system
   - Sharding for large datasets
   - Caching layer implementation

2. **Features**
   - Full-text search
   - Advanced querying
   - Real-time updates
   - Automated backups

3. **Integration**
   - External system synchronization
   - Backup/restore functionality
   - Migration tools
