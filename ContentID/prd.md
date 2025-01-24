# Project Requirements: Dual-Interface Electron App

Create an Electron application with:

1. Local desktop interface running as executable
2. Web-accessible interface sharing content from Electron app

## Technical Specifications

### Architecture

- Main process (CommonJS)
- Renderer process (ES Modules)
- Web server process for external access
- Preload scripts for secure IPC
- Service layer for shared business logic

### Development Guidelines

- Use modern JavaScript (ES2022+) without TypeScript
- Pure CSS only, no preprocessors
- ES Modules for renderer/services
- CommonJS for main/preload scripts
- Minimal external dependencies
- No build-heavy frameworks
- Context isolation enabled
- Clear documentation inline
- Path resolution:
  - Main process resolves paths relative to src/main/
  - Use '../' to reference files in sibling directories
  - Example: '../renderer/index.html' from src/main/
  - Example: '../preload/index.js' from src/main/
- Application quits completely on all platforms when all windows are closed
- Window close handler uses process.platform (not process.process.platform) for proper platform detection
- Developer tools only open on explicit user request (Cmd+Option+I/Ctrl+Shift+I)

### Security Requirements

- Proper context isolation between processes
- Secure IPC communication
- CSP headers for web interface
- Input validation on both interfaces
- CORS configuration for web API

### Project Structure

```bash
project/
├── src/
│   ├── main/           # Main process (CommonJS)
│   ├── renderer/       # Renderer process (ES Modules)
│   ├── preload/        # Preload scripts (CommonJS)
│   ├── services/       # Shared business logic (ES Modules)
│   ├── public/         # Static assets
│   ├── tests/          # Test files (if requested)
│   └── scripts/        # Build and utility scripts
```

### Required Features

- Local window interface
- Web-accessible interface
- Shared state management
- Bidirectional communication
- Resource management
- Error handling
- Logging system
- Security validations

### Build Process

- Simple npm scripts
- Minimal bundling
- Development hot-reload
- Production optimization

### Delivery Requirements

1. Complete source code
2. Setup instructions
3. API documentation
4. Security guidelines
5. Development notes

### Development Notes Guidelines

Development notes should be maintained as Markdown files in the `docs/development-notes/` directory. Each note should follow this structure:

```markdown
# [Short Description]

## Date
[YYYY-MM-DD]

## Author
[Your Name]

## Context
- Background information
- Related issues or features
- Relevant technical decisions

## Changes Made
- Specific code changes
- Configuration updates
- Dependencies added/removed

## Impact Analysis
- Affected components
- Potential side effects
- Performance considerations

## Testing
- Test cases added
- Manual testing performed
- Automated test coverage

## Future Considerations
- Potential improvements
- Technical debt created
- Follow-up tasks
```

Examples of good development notes:

- Feature implementation details
- Bug fix documentation
- Architectural decisions
- Performance optimizations
- Security-related changes

Do not include:

- TypeScript
- CSS preprocessors
- Heavy frameworks
- Complex build systems
- Test files (unless requested)

Generate a production-ready application following these specifications.
