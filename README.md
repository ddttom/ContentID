# ContentID

A dual-interface Electron application providing both a local desktop interface and a web-accessible interface with shared state and functionality.

## Features

- Local window interface
- Web-accessible interface (<http://0.0.0.0:3000>)
- Shared state management
- Secure IPC communication
- Responsive design
- Comprehensive error handling
- Built-in logging system

## Technical Specifications

### Core Technologies

- Electron (v28.0.0)
- Node.js (v18+)
- Modern JavaScript (ES2022+)
- HTML5/CSS3
- Jest (v29.0.0) for testing
- Supertest for integration testing

### Module System

- **Main Process**: CommonJS with ES Module interop
- **Renderer Process**: Pure ES Modules
- **Preload Scripts**: CommonJS with ES Module interop
- **Web Server**: ES Modules
- **Shared Services**: ES Modules

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

[MIT License](LICENSE)
