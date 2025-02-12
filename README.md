# ContentID

A distributed digital identity system for content verification that enables AI systems to distinguish between verified and unverified information. Built as a dual-interface Electron application providing both local desktop and web-accessible interfaces with shared state functionality.

## Core Features

- Digital content identity verification
- Cryptographic content signing
- Verification authority management
- Trust chain validation
- Content lifecycle tracking
- Local window interface
- Web-accessible interface (<http://0.0.0.0:3000>)
- Shared state management
- Secure IPC communication
- Built-in logging system

## Technical Specifications

### Core Technologies

- Electron (v28.0.0)
- Node.js (v18+)
- Express.js (with ES Modules)
- Modern JavaScript (ES2022+)
- HTML5/CSS3
- Jest (v29.0.0) for testing
- Supertest for integration testing

## Core Architecture

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

### Shared Services (ES Modules)

- Shared business logic
- Uses import/export syntax exclusively
- Maintains clear separation of concerns

## API Endpoints

### Content Verification

- `POST /api/verify` - Verify content authenticity
- `GET /api/health` - Service health check

Additional endpoints coming soon.

## Project Structure

```bash
project/
├── src/
│   ├── main/           # Main process (CommonJS with ES Module Interop)
│   ├── renderer/       # Renderer process (ES Modules)
│   ├── preload/        # Preload scripts (CommonJS with ES Module Interop)
│   ├── services/       # Shared business logic (ES Modules)
│   ├── tests/          # Test files
│   └── scripts/        # Build and utility scripts
├── docs/               # Documentation
│   └── development-notes/ # Development notes
├── ContentID/          # Project documentation
└── log.md             # Development log
```

## Development Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development:
   - Start both interfaces:

     ```bash
     npm start
     ```

   - Web interface only:

     ```bash
     npm run web
     ```

   - Desktop interface only:

     ```bash
     npm run desktop
     ```

## Testing

Run tests using:

```bash
npm test
```

Additional test commands:

- Watch mode: `npm run test:watch`
- Coverage report: `npm run test:coverage`

## Security

- Context isolation enabled
- Secure IPC communication channels
- Content Security Policy (CSP) headers
- Input validation on both interfaces
- CORS configuration for web API
- Strict path resolution

### Content Security Policy

```bash
default-src 'self';
style-src 'self' 'unsafe-inline';
script-src 'self';
img-src 'self' data:;
font-src 'self';
connect-src 'self'
```

## Documentation

Development notes are maintained in `docs/development-notes/` following a standardized format.

## License

Undecided
