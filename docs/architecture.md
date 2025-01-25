# ContentID Architecture

## Overview

A dual-interface Electron application providing both a local desktop interface and a web-accessible interface with shared state and functionality.

## Core Architecture

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

### Preload Scripts (CommonJS with ES Module Interop)

- Secure IPC bridge
- API exposure to renderer
- Context isolation enforcement
- Uses CommonJS require() for Electron APIs
- Implements createRequire(import.meta.url) for CommonJS interop

### Web Server (ES Modules)

- Built-in HTTP server running on port 3000
- Static file serving from renderer directory
- Security headers implementation
- CORS configuration
- Uses import/export syntax exclusively

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
│   ├── preload/        # Preload scripts (CommonJS with ES Module Interop)
│   ├── services/       # Shared business logic (ES Modules)
│   ├── public/         # Static assets (favicon, etc.)
│   ├── tests/          # Test files
│   └── scripts/        # Build and utility scripts
├── docs/               # Documentation
│   └── development-notes/ # Development notes
├── ContentID/          # Project documentation
└── log.md              # Development log
