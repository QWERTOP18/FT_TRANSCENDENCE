# Quick Start Guide

This guide will help you get the CLI User client up and running quickly.

## Prerequisites

- Node.js (version 18 or higher)
- Access to the FT_TRANSCENDENCE game server

## Installation

### Step 1: Install Dependencies

```bash
cd cli-user
npm install
```

### Step 2: Build the Project

```bash
npm run build
```

### Step 3: Configure the Client

Create a `.env` file in the cli-user directory:

```bash
# Server URLs
SERVER_URL=http://localhost:3000
WEBSOCKET_URL=ws://localhost:3001

# Default credentials (optional)
DEFAULT_USERNAME=your_username
DEFAULT_PASSWORD=your_password
```

## Running the Client

### Start the CLI

```bash
npm start
```

### Development Mode

For development with automatic reloading:

```bash
npm run dev
```

## First Time Setup

### 1. Authentication

When you first run the client, you'll need to authenticate:

```
Welcome to FT_TRANSCENDENCE CLI Client
=====================================

Please enter your credentials:
Username: your_username
Password: ********
```

### 2. Main Menu

After successful authentication, you'll see the main menu:

```
Main Menu
=========
1. View Tournaments
2. Join Tournament
3. Start Battle
4. View Battle Status
5. Exit

Enter your choice: 
```

## Basic Usage

### Viewing Tournaments

1. Select option `1` from the main menu
2. View the list of available tournaments

### Joining a Tournament

1. Select option `2` from the main menu
2. Enter the tournament ID you want to join
3. Confirm your participation

### Starting a Battle

1. Select option `3` from the main menu
2. Choose your opponent type (AI or Player)
3. Wait for the battle to start

### Checking Battle Status

1. Select option `4` from the main menu
2. Enter your battle ID
3. View current battle status and scores

## Common Commands

### Using Make Commands

```bash
# Install dependencies
make install

# Build the project
make build

# Start the client
make start

# Run in development mode
make dev

# Clean build artifacts
make clean
```

### Direct npm Commands

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the client
npm start

# Development mode
npm run dev
```

## Troubleshooting

### Connection Issues

If you can't connect to the server:

1. Check if the server is running
2. Verify the server URL in your `.env` file
3. Check your network connection

### Authentication Problems

If authentication fails:

1. Verify your username and password
2. Check if the auth server is running
3. Ensure the server URL is correct

### Build Errors

If the build fails:

1. Make sure Node.js version is 18 or higher
2. Delete `node_modules` and run `npm install` again
3. Check for TypeScript errors

## Getting Help

### Debug Mode

Run with debug logging to see detailed information:

```bash
DEBUG=cli-user:* npm run dev
```

### Logs

The application provides detailed console output:
- Authentication status
- API request/response logs
- WebSocket connection status
- Error messages

### Common Error Messages

- `Connection refused`: Server is not running
- `Authentication failed`: Invalid credentials
- `Tournament not found`: Tournament ID is incorrect
- `Battle not found`: Battle ID is incorrect

## Next Steps

After getting the basic client running:

1. **Explore Tournaments**: View and join available tournaments
2. **Practice Battles**: Start battles with AI opponents
3. **Join Multiplayer**: Participate in player vs player battles
4. **Check Documentation**: Read the full [API documentation](./API.md)

## Configuration Options

### Environment Variables

You can customize the client behavior with these environment variables:

```bash
# Server configuration
SERVER_URL=http://localhost:3000
WEBSOCKET_URL=ws://localhost:3001

# Authentication
DEFAULT_USERNAME=your_username
DEFAULT_PASSWORD=your_password

# Debug logging
DEBUG=cli-user:*
```

### Advanced Configuration

For advanced users, you can modify the configuration files in `src/config/` to customize:
- API endpoints
- Timeout settings
- Retry logic
- Logging levels

---

For more detailed information, see the main [README.md](../README.md) and [API.md](./API.md) documentation. 
