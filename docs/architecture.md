# ContentID Architecture

## Current Architecture (Node.js Web Application)

The application has been refactored from a dual Electron/Web application to a pure Node.js web application for improved simplicity and maintainability. For detailed information about the refactoring process, see [docs/development-notes/refactor-log.md](./development-notes/refactor-log.md).

### Core Components

#### Web Server (src/main/web-server.js)

- HTTP/2 enabled Express server using SPDY
- Comprehensive security with Helmet middleware
- Compression and rate limiting
- Static file serving with proper cache controls
- SPA-style fallback to index.html

#### Component System

- Modular component architecture
- Dynamic component loading
- Independent component styling
- Progressive enhancement support
- Clear separation of concerns

### Project Structure

```bash
contentid/
├── src/
│   ├── main/           # Server-side code
│   │   └── web-server.js
│   ├── renderer/       # Frontend assets
│   │   ├── components/ # Reusable UI components
│   │   │   ├── header.html
│   │   │   └── footer.html
│   │   ├── scripts/    # Client-side JavaScript
│   │   │   ├── components.js
│   │   │   └── init.js
│   │   └── styles/     # CSS stylesheets
│   │       ├── base/
│   │       ├── components/
│   │       └── pages/
│   └── services/       # Shared business logic
├── tests/              # Test files
└── docs/              # Documentation
    └── development-notes/
        └── refactor-log.md  # Refactoring documentation
```

### Key Technologies

- **Runtime**: Node.js (>=18.0.0)
- **Server**: Express with HTTP/2 (SPDY)
- **Frontend**: Pure JavaScript (ES Modules) + CSS
- **Security**: Helmet, CORS, Rate Limiting
- **Performance**: HTTP/2, Compression, Proper Caching

### Architectural Decisions

1. **Pure Node.js**: Removed Electron dependency to simplify architecture and reduce complexity
   - Eliminated need for IPC communication
   - Removed process isolation complexity
   - Simplified deployment and updates

2. **HTTP/2 Support**: Using SPDY for improved performance
   - Multiplexing for parallel requests
   - Header compression
   - Server push capabilities

3. **Security First**:
   - Comprehensive CSP headers
   - HSTS enabled
   - Rate limiting
   - Proper CORS configuration
   - Security headers via Helmet
   - Input validation and sanitization
   - XSS prevention measures
   - CSRF protection

4. **Performance Optimizations**:
   - Compression middleware
   - Static file caching
   - Proper MIME types
   - Client-side caching headers
   - HTTP/2 multiplexing
   - Efficient component loading

### Development Guidelines

1. **Module System**:
   - Use ES modules consistently (type: "module" in package.json)
   - Clear import/export patterns
   - Dynamic imports for code splitting
   - No CommonJS modules in frontend code

2. **Frontend Organization**:
   - Components in dedicated directories
   - Separate concerns (HTML, CSS, JS)
   - Minimal dependencies
   - Progressive enhancement
   - Semantic HTML structure
   - Modular CSS architecture

3. **Testing**:
   - Jest for unit tests
   - Supertest for API testing
   - Component testing strategy
   - Security testing procedures
   - Performance benchmarking

### Deployment Considerations

1. **Environment**:
   - Node.js 18+ required
   - Environment variables for configuration
   - CORS origin configuration for production
   - HTTP/2 server setup

2. **Security**:
   - Review CSP directives for production
   - Configure rate limits appropriately
   - Set up SSL/TLS in production
   - Regular security audits
   - Dependency vulnerability scanning

3. **Monitoring**:
   - Implement logging strategy
   - Monitor server metrics
   - Track rate limit hits
   - Performance monitoring
   - Error tracking and alerting

### Future Considerations

1. **API Development**:
   - Consider adding API routes as needed
   - Implement proper API versioning
   - Add API documentation
   - Rate limiting strategies
   - Authentication/Authorization

2. **Frontend Enhancement**:
   - Consider progressive enhancement
   - Implement service workers
   - Add offline capabilities
   - Accessibility improvements
   - Performance optimizations

3. **Performance**:
   - Implement server-side rendering if needed
   - Add asset optimization pipeline
   - Consider CDN integration
   - Edge caching strategies
   - Resource prioritization

4. **Scalability**:
   - Load balancing configuration
   - Database integration
   - Caching strategies
   - Microservices architecture
   - Container deployment
