# ContentID

A distributed digital identity system for content verification that enables AI systems to distinguish between verified and unverified information. Built as a modern Node.js web application with HTTP/2 support and comprehensive security features.

## Core Features

- Digital content identity verification
- Cryptographic content signing
- Verification authority management
- Trust chain validation
- Content lifecycle tracking
- Web interface (<http://localhost:3000>)
- Built-in logging system
- Content Management Interface:
  - Content listing with search and filtering
  - Content creation with draft saving
  - Version history tracking
  - Approval workflow management
  - Content relationship mapping
  - Real-time validation

## Technical Specifications

### Core Technologies

- Node.js (v18+)
- Express.js (with HTTP/2 via SPDY)
- Modern JavaScript (ES2022+)
- HTML5/CSS3 with semantic structure
- Jest (v29.0.0) for testing
- Supertest for integration testing

## Core Architecture

### Web Server (ES Modules)

- HTTP/2-enabled Express server using SPDY
- Class-based implementation with lifecycle management
- Built-in HTTP server running on port 3000
- Static file serving with proper caching
- Comprehensive security headers
- CORS configuration
- Uses import/export syntax exclusively
- Clean separation of middleware and routes
- Comprehensive error handling
- Path resolution using ES Modules patterns

### Frontend Architecture

- Component-based implementation
- ES Modules throughout
- Dynamic component loading
- Semantic HTML structure
- Modular CSS architecture
- Progressive enhancement

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
│   ├── main/           # Server-side code (ES Modules)
│   │   └── web-server.js  # HTTP/2 server implementation
│   ├── public/        # Frontend code (ES Modules)
│   │   ├── styles/     # CSS architecture
│   │   │   ├── base/          # Base styles
│   │   │   │   ├── _variables.css  # Design tokens
│   │   │   │   ├── _reset.css      # Base styles
│   │   │   │   └── _utilities.css  # Helper classes
│   │   │   ├── components/    # Component styles
│   │   │   │   ├── _header.css     # Header styles
│   │   │   │   ├── _footer.css     # Footer styles
│   │   │   │   └── _forms.css      # Form styles
│   │   │   ├── pages/        # Page-specific styles
│   │   │   │   ├── _index.css      # Landing page
│   │   │   │   ├── _list.css       # Content listing
│   │   │   │   ├── _entry.css      # Content entry
│   │   │   │   └── _editor.css     # Content editor
│   │   │   └── styles.css    # Main stylesheet
│   │   ├── components/  # HTML components
│   │   │   ├── header.html   # Header markup
│   │   │   └── footer.html   # Footer markup
│   │   ├── scripts/    # JavaScript modules
│   │   │   ├── components.js # Component loader
│   │   │   └── init.js       # Component initialization
│   │   ├── index.html  # Landing page
│   │   ├── list.html   # Content listing
│   │   ├── entry.html  # Content entry
│   │   └── editor.html # Content editor
│   ├── services/       # Shared business logic (ES Modules)
│   └── tests/          # Test files
├── docs/               # Documentation
│   └── development-notes/ # Development notes
└── log.md             # Development log
```

## Development Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development:

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start

   # Custom port
   PORT=8080 npm start
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

- Content Security Policy (CSP) headers
- HTTP/2 with SPDY
- Rate limiting
- Input validation
- CORS configuration
- Strict path resolution
- Comprehensive security headers

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

The following documentation is available:

- [User Manual](./docs/usermanual.md) - Complete guide for using the content management interface
- [Architecture Guide](./docs/architecture.md) - Detailed technical architecture documentation
- [Web Server Rules](./docs/development-notes/rules-for-webserver.md) - Web server optimization guide
- [Webpage Rules](./docs/development-notes/webpage-rules.md) - Frontend development standards
- [Troubleshooting Guide](./docs/development-notes/troubleshooting.md) - Common issues and resolutions
- Development notes in `docs/development-notes/` following a standardized format

### Common Issues and Solutions

For common development issues, warnings, and their solutions, refer to the [Troubleshooting Guide](./docs/development-notes/troubleshooting.md). This includes:

- Node.js deprecation warnings
- HTTP/2 configuration
- Accessibility implementation
- Development environment setup
- Production deployment considerations

## Accessibility

The application follows WCAG 2.1 guidelines with:

- Semantic HTML structure
- ARIA landmarks and labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus management

## License

Undecided
