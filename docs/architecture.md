# ContentID Architecture

## Overview

A dual-interface Electron application providing both a local desktop interface and a web-accessible interface with shared state and functionality.

## Core Architecture

### Content Management Interface

- Simplified HTML/CSS/JS Architecture
  - Semantic HTML structure
  - Centralized CSS styling
  - Direct component implementation
  - Clean separation of concerns

- Three main interfaces:
  1. Content List (list.html)
     - Paginated content table
     - Search and filtering
     - Sort functionality
     - Quick actions (edit/view)
  2. Content Entry (entry.html)
     - Structured content form
     - Draft saving
     - Section-based organization
     - Real-time validation
  3. Content Editor (editor.html)
     - Version history tracking
     - Approval workflow
     - Content relationships
     - Status management

- Form Sections:
  - Content Details
  - Variations (social, email, print)
  - Content Blocks
  - Approvals (legal, marketing, compliance)
  - Usage Parameters
  - Brand Requirements
  - Temporal Context
  - Content Relationships

- Implementation Features:
  - Semantic HTML structure
  - Pure CSS without preprocessors
  - ES Modules architecture
  - Local JSON storage
  - GUID-based indexing
  - Draft auto-saving
  - Form validation
  - Relationship management

### Main Process (CommonJS with ES Module Interop)

- Application lifecycle management
- Window creation and management
- Web server implementation
- System-level operations
- Uses CommonJS require() for Electron-specific imports
- Implements createRequire(import.meta.url) for CommonJS interop
- Uses dynamic import() for ES modules
- Maintains CommonJS module.exports pattern

### Renderer Process (Pure ES Modules)

- UI rendering and interaction
- Client-side logic
- Communication with main process via preload
- Uses import/export syntax exclusively
- Implements dynamic import() for code splitting
- Follows strict ES module guidelines
- Simplified HTML/CSS/JS architecture
- Direct component implementation
- Centralized styling in styles.css
- Semantic HTML structure

### Preload Scripts (CommonJS with ES Module Interop)

- Secure IPC bridge
- API exposure to renderer
- Context isolation enforcement
- Uses CommonJS require() for Electron APIs
- Implements createRequire(import.meta.url) for CommonJS interop

### Web Server (ES Modules)

- Express.js server using ES Modules architecture
- Class-based implementation with lifecycle management
- Built-in HTTP server running on port 3000
- Static file serving from renderer directory
- Security headers implementation
- CORS configuration
- Uses import/export syntax exclusively
- Clean separation of middleware and routes
- Comprehensive error handling
- Path resolution using ES Modules patterns

### Shared Services (ES Modules)

- Shared business logic
- Uses import/export syntax exclusively
- Maintains clear separation of concerns

## Security Architecture

### Core Security Features

- Context isolation enabled
- Secure IPC communication channels
- Content Security Policy (CSP) headers
- Input validation on both interfaces
- CORS configuration for web API
- Strict path resolution

### Content Security Policy

```text
default-src 'self';
style-src 'self' 'unsafe-inline';
script-src 'self';
img-src 'self' data:;
font-src 'self';
connect-src 'self'
```

## Content Infrastructure

### Content Lake Infrastructure

- Verified data pools
- Dynamic content assembly
- Cross-platform preservation
- Version control system
- Metadata management
- Content relationship mapping

### Content Lifecycle Management

- Content Creation & Ingestion
  - Authoring tools
  - Import procedures
  - Quality checks
  - Initial verification
  - Metadata assignment

- Verification & Approval
  - Legal review process
  - Compliance checks
  - Authority validation
  - Version control
  - Change tracking

- Distribution & Usage
  - Access controls
  - Usage tracking
  - Rights management
  - Translation workflow
  - Distribution channels

- Archival & Deprecation
  - Archive criteria
  - Retention policies
  - Version management
  - Content retirement
  - Historical preservation

- Cross-Platform Sync
  - Synchronization rules
  - Conflict resolution
  - Update propagation
  - Platform compatibility
  - State management

## Development Guidelines

### Code Organization

- Clear separation of concerns
- Modular architecture
- Consistent path resolution
- Comprehensive error handling

### Style Guidelines

- Modern JavaScript (ES2022+)
- No TypeScript
- Pure CSS (no preprocessors)
- Consistent code formatting
- Comprehensive inline documentation

## Project Structure

```bash
project/
├── src/
│   ├── main/           # Main process (CommonJS with ES Module Interop)
│   ├── renderer/       # Renderer process (ES Modules)
│   │   ├── styles/     # Centralized CSS
│   │   ├── index.html  # Landing page
│   │   ├── list.html   # Content listing
│   │   ├── entry.html  # Content entry
│   │   └── editor.html # Content editor
│   ├── preload/        # Preload scripts (CommonJS with ES Module Interop)
│   ├── services/       # Shared business logic (ES Modules)
│   ├── public/         # Static assets (favicon, etc.)
│   ├── tests/          # Test files
│   └── scripts/        # Build and utility scripts
├── docs/               # Documentation
│   └── development-notes/ # Development notes
├── ContentID/          # Project documentation
└── log.md             # Development log
