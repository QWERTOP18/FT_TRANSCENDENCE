# CLI User - FT_TRANSCENDENCE Game Client

A command-line interface (CLI) client for the FT_TRANSCENDENCE Pong game. This client allows users to interact with the game server, participate in tournaments, and engage in battles through a terminal-based interface.

## Features

- **User Authentication**: Secure login and user management
- **Tournament Management**: Join tournaments, view tournament lists, and manage participation
- **Battle System**: Participate in battles with AI opponents or other players
- **Real-time Communication**: WebSocket-based real-time game communication
- **Interactive CLI**: User-friendly command-line interface with menu navigation

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Access to the FT_TRANSCENDENCE game server

## Installation

1. Clone the repository and navigate to the cli-user directory:
```bash
cd cli-user
```

2. Install dependencies:
```bash
make install
# or
npm install
```

3. Build the project:
```bash
make build
# or
npm run build
```

## Usage

### Starting the Application

Run the CLI client:
```bash
make start
# or
npm start
```

### Development Mode

For development with automatic TypeScript compilation:
```bash
make dev
# or
npm run dev
```

### Available Commands

The CLI provides an interactive menu system with the following main features:

1. **Authentication**: Login with your credentials
2. **Tournament Management**: 
   - View available tournaments
   - Join tournaments
   - Check tournament status
3. **Battle System**:
   - Start battles
   - Wait for battle availability
   - View battle results
4. **Game Interaction**:
   - Connect to game rooms
   - Participate in real-time matches

## Project Structure

```
cli-user/
├── src/
│   ├── api-wrapper/          # API client wrappers
│   │   ├── auth/            # Authentication API
│   │   ├── battle/          # Battle API
│   │   └── tournament/      # Tournament API
│   ├── commands/            # CLI commands
│   ├── config/              # Configuration files
│   ├── errors/              # Error handling
│   ├── main/                # Main application logic
│   ├── services/            # Business logic services
│   ├── types/               # TypeScript type definitions
│   ├── websocket-wrapper/   # WebSocket communication
│   └── index.ts             # Application entry point
├── dist/                    # Compiled JavaScript files
├── package.json             # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── Makefile                # Build and development commands
└── README.md               # This file
```

## Configuration

The application uses configuration files located in `src/config/` to manage:
- Server endpoints
- API authentication
- WebSocket connections
- Game settings

## Error Handling

The CLI includes comprehensive error handling for:
- Network connectivity issues
- Authentication failures
- Tournament join errors
- Battle system errors
- WebSocket connection problems

## Development

### Building from Source

1. Install dependencies:
```bash
make install
```

2. Build the project:
```bash
make build
```

3. Run in development mode:
```bash
make dev
```

### Cleaning

Remove build artifacts and dependencies:
```bash
make clean
```

## Troubleshooting

### Common Issues

1. **Connection Errors**: Ensure the game server is running and accessible
2. **Authentication Failures**: Verify your credentials and server configuration
3. **Build Errors**: Make sure all dependencies are installed with `make install`

### Logs

The application provides detailed console output for debugging:
- Authentication status
- API request/response logs
- WebSocket connection status
- Error messages with stack traces
