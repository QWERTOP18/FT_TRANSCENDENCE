# Development Guide

This guide provides information for developers who want to contribute to the CLI User project.

## Development Environment Setup

### Prerequisites

1. **Node.js**: Version 18 or higher
2. **npm**: Latest version
3. **Git**: For version control
4. **Code Editor**: VS Code recommended with TypeScript extensions

### Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd cli-user
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env` file):
```bash
# Server configuration
SERVER_URL=http://localhost:3000
WEBSOCKET_URL=ws://localhost:3001

# Authentication
DEFAULT_USERNAME=testuser
DEFAULT_PASSWORD=testpass
```

4. Build the project:
```bash
npm run build
```

## Project Architecture

### Directory Structure

```
src/
├── api-wrapper/          # API client wrappers
│   ├── auth/            # Authentication API client
│   ├── battle/          # Battle API client
│   └── tournament/      # Tournament API client
├── commands/            # CLI command implementations
├── config/              # Configuration management
├── errors/              # Custom error classes
├── main/                # Main application logic
├── services/            # Business logic services
├── types/               # TypeScript type definitions
├── websocket-wrapper/   # WebSocket communication
└── index.ts             # Application entry point
```

### Key Components

#### API Wrappers (`src/api-wrapper/`)
- **AuthAPI**: Handles user authentication
- **BattleAPI**: Manages battle operations
- **TournamentAPI**: Tournament-related operations

#### Services (`src/services/`)
- **AuthenticateService**: User authentication logic
- **GameService**: Game state management
- **UserInputService**: CLI input handling

#### Main Logic (`src/main/`)
- **MainMenuService**: Main menu navigation
- **BattleAIService**: AI battle logic
- **JoinTournamentService**: Tournament joining logic

## Development Workflow

### 1. Feature Development

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following the coding standards

3. Test your changes:
```bash
npm run build
npm run dev
```

4. Commit your changes:
```bash
git add .
git commit -m "feat: add your feature description"
```

### 2. Testing

#### Unit Tests
```bash
npm test
```

#### Integration Tests
```bash
npm run test:integration
```

#### Manual Testing
```bash
npm run dev
# Test the CLI functionality manually
```

### 3. Code Quality

#### Linting
```bash
npm run lint
```

#### Type Checking
```bash
npm run type-check
```

#### Formatting
```bash
npm run format
```

## Coding Standards

### TypeScript Guidelines

1. **Type Safety**: Always use proper TypeScript types
2. **Interfaces**: Define interfaces for API responses
3. **Error Handling**: Use custom error classes
4. **Async/Await**: Prefer async/await over Promises

### Code Style

1. **Naming**: Use camelCase for variables and functions
2. **Comments**: Add JSDoc comments for public methods
3. **Imports**: Organize imports (external, internal, relative)
4. **Line Length**: Keep lines under 100 characters

### Example Code Structure

```typescript
/**
 * Service for handling user authentication
 */
export class AuthenticateService {
  private readonly authAPI: AuthAPI;

  constructor() {
    this.authAPI = new AuthAPI();
  }

  /**
   * Authenticates a user with the server
   * @param username - The username
   * @param password - The password
   * @returns Promise<User> - The authenticated user
   */
  async authenticateUser(username: string, password: string): Promise<User> {
    try {
      const response = await this.authAPI.login(username, password);
      return response.user;
    } catch (error) {
      throw new AuthenticationError('Failed to authenticate user', error);
    }
  }
}
```

## Error Handling

### Custom Error Classes

Create specific error classes for different scenarios:

```typescript
export class AuthenticationError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
```

### Error Handling Patterns

1. **API Errors**: Handle network and server errors
2. **Validation Errors**: Validate input before API calls
3. **User Errors**: Provide clear error messages to users

## Configuration Management

### Environment Variables

Use environment variables for configuration:

```typescript
export const config = {
  serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
  websocketUrl: process.env.WEBSOCKET_URL || 'ws://localhost:3001',
  defaultUsername: process.env.DEFAULT_USERNAME || 'user',
  defaultPassword: process.env.DEFAULT_PASSWORD || 'password',
};
```

## Testing Strategy

### Unit Tests

Test individual components in isolation:

```typescript
describe('AuthenticateService', () => {
  it('should authenticate user successfully', async () => {
    const service = new AuthenticateService();
    const user = await service.authenticateUser('test', 'password');
    expect(user).toBeDefined();
  });
});
```

### Integration Tests

Test API interactions:

```typescript
describe('AuthAPI Integration', () => {
  it('should login and return user data', async () => {
    const api = new AuthAPI();
    const response = await api.login('testuser', 'testpass');
    expect(response.user).toBeDefined();
    expect(response.token).toBeDefined();
  });
});
```

## Debugging

### Debug Mode

Run with debug logging:

```bash
DEBUG=cli-user:* npm run dev
```

### Common Debugging Scenarios

1. **API Connection Issues**: Check server URL and network connectivity
2. **Authentication Problems**: Verify credentials and token handling
3. **WebSocket Issues**: Check WebSocket URL and connection status

## Performance Considerations

### Optimization Tips

1. **Connection Pooling**: Reuse HTTP connections
2. **Caching**: Cache frequently accessed data
3. **Error Retry**: Implement retry logic for transient failures
4. **Memory Management**: Clean up resources properly

## Deployment

### Build Process

1. **Development Build**:
```bash
npm run build:dev
```

2. **Production Build**:
```bash
npm run build:prod
```

3. **Docker Build**:
```bash
docker build -t cli-user .
```

### Release Process

1. Update version in `package.json`
2. Create release notes
3. Tag the release
4. Deploy to package registry

## Contributing Guidelines

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Error handling is implemented
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Proper error messages for users

## Troubleshooting

### Common Issues

1. **Build Failures**: Check TypeScript configuration
2. **Runtime Errors**: Verify environment variables
3. **API Errors**: Check server status and endpoints
4. **WebSocket Issues**: Verify WebSocket server is running

### Getting Help

1. Check existing issues on GitHub
2. Review the API documentation
3. Test with the provided examples
4. Contact the development team

---

For more information, see the main [README.md](../README.md) and [API.md](./API.md) documentation. 
