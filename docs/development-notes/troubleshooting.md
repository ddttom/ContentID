# ContentID Troubleshooting Guide

## Common Messages and Warnings

### Node.js Deprecation Warning

```bash
[DEP0111] DeprecationWarning: Access to process.binding('http_parser') is deprecated.
```

**Explanation:** Internal Node.js API deprecation warning from a dependency.
**Impact:** None. Application functions normally.
**Resolution:** Can be silenced by running Electron with `--trace-deprecation` flag to identify the source.

### Web Server Status

```bash
Web server running on port 3000 with HTTP/2
```

**Explanation:** Confirmation of successful server startup.
**Impact:** Positive. Indicates proper HTTP/2 implementation.
**Note:** Expected behavior as per rules-for-webserver.md.

### macOS Input Method Messages

```bash
Electron[PID] IMKClient/IMKInputSession messages
```

**Explanation:** macOS-specific system integration logs.
**Impact:** None. Normal system integration behavior.
**Note:** Only appears on macOS systems.


## Development Environment

### Starting the Application

Standard Start:

```bash
npm start
```
Debug Mode (with deprecation traces):

```bash
electron --trace-deprecation .
```
Production Mode:

```bash
npm run start:prod
```

### Logging Levels

Configure logging in `src/services/logger.js`:

```javascript
const logLevels = {
  production: 'error',
  development: 'debug',
  test: 'warn'
};
```

### Common Issues

1. **Port 3000 Already in Use**
   - Error: `EADDRINUSE: address already in use :::3000`
   - Resolution: Kill existing process or change port in configuration

2. **HTTP/2 Certificate Issues**
   - Error: `HTTP/2 server requires valid certificates`
   - Resolution: Ensure proper SSL certificates in `src/certs/`
## Best Practices

1. **Development Mode**
   - Use `npm start` for development
   - Monitor console for warnings
   - Address deprecation warnings proactively

2. **Production Mode**
   - Use `npm run start:prod`
   - Silence non-critical warnings
   - Enable production logging level

3. **Testing**
   - Run `npm test` before commits
   - Ensure accessibility compliance
   - Verify HTTP/2 functionality

## Support Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Node.js Deprecations](https://nodejs.org/api/deprecations.html)
- [HTTP/2 Implementation Guide](./rules-for-webserver.md)
- [Accessibility Guidelines](./webpage-rules.md)
