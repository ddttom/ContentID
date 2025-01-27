# ContentID Troubleshooting Guide

## Common Messages and Warnings

### Node.js HTTP Parser Warning

```bash
[DEP0111] DeprecationWarning: Access to process.binding('http_parser') is deprecated.
```

**Explanation:** Internal Node.js API deprecation warning from SPDY dependency.
**Impact:** None. Application functions normally.
**Resolution:** Can be silenced using `--trace-deprecation` flag to identify the source.

### Web Server Status

```bash
Web server running on port 3000 with HTTP/2
```

**Explanation:** Confirmation of successful server startup with HTTP/2.
**Impact:** Positive. Indicates proper HTTP/2 implementation.
**Note:** Expected behavior as per rules-for-webserver.md.

### HTTP/2 SPDY Warnings

```bash
(node:xxxx) ExperimentalWarning: The SPDY protocol is experimental.
```

**Explanation:** Node.js warning about SPDY protocol usage.
**Impact:** None. SPDY is stable for production use.
**Note:** Standard warning for HTTP/2 implementation.

## Development Environment

### Starting the Application

Development Mode:

```bash
npm run dev
```

Production Mode:

```bash
npm start
```

Custom Port:

```bash
PORT=8080 npm start
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
   - Resolution: Kill existing process or use custom port

   ```bash
   PORT=8080 npm start
   ```

2. **HTTP/2 Certificate Issues**
   - Error: `HTTP/2 server requires valid certificates`
   - Resolution: Ensure proper SSL certificates in production
   - Note: Development uses HTTP/2 in plain text mode

3. **CORS Errors**
   - Error: `Access-Control-Allow-Origin header missing`
   - Resolution: Check CORS configuration in web-server.js
   - Development: Origin is set to '*'
   - Production: Configure specific origins

4. **Static File 404 Errors**
   - Error: `GET /path/to/file 404`
   - Resolution: Verify file exists in renderer directory
   - Check static file serving configuration
   - Ensure proper file permissions

5. **Component Loading Failures**
   - Error: `Failed to load component: /components/header.html`
   - Resolution: Verify component path and existence
   - Check network tab for specific errors
   - Verify component loader configuration

## Best Practices

1. **Development Mode**
   - Use `npm run dev` for development
   - Monitor console for warnings
   - Address deprecation warnings proactively
   - Check network tab for HTTP/2 streams

2. **Production Mode**
   - Use `npm start`
   - Configure proper CORS origins
   - Enable production logging level
   - Set up SSL certificates
   - Configure rate limiting

3. **Testing**
   - Run `npm test` before commits
   - Ensure accessibility compliance
   - Verify HTTP/2 functionality
   - Test component loading
   - Check security headers

## Performance Troubleshooting

1. **Slow Component Loading**
   - Use browser dev tools Network tab
   - Check HTTP/2 stream utilization
   - Verify compression is working
   - Monitor server resource usage

2. **Memory Issues**
   - Monitor Node.js memory usage
   - Check for memory leaks
   - Use `--max-old-space-size` if needed
   - Profile application if necessary

3. **HTTP/2 Performance**
   - Verify multiplexing is working
   - Check header compression
   - Monitor connection reuse
   - Validate server push (if used)

## Security Considerations

1. **CSP Violations**
   - Monitor console for CSP errors
   - Verify CSP header configuration
   - Check for inline scripts/styles
   - Update CSP as needed

2. **Rate Limiting**
   - Monitor rate limit hits
   - Adjust limits if needed
   - Check for bypass attempts
   - Configure proper error responses

3. **CORS Issues**
   - Verify allowed origins
   - Check allowed methods
   - Validate header configuration
   - Test preflight requests

## Support Resources

- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [HTTP/2 Implementation Guide](./rules-for-webserver.md)
- [Frontend Development Guide](./webpage-rules.md)
- [SPDY Documentation](https://github.com/spdy-http2/node-spdy)
- [Security Best Practices](https://expressjs.com/advanced/best-practice-security.html)
