# FT_TRANSCENDENCE (Development Documentation)

A multiplayer Pong game with tournament system built with TypeScript, Fastify, and WebSocket.

**This is the development documentation. For user documentation, see [README.md](./README.md)**

## Services

This project consists of three main services:

- **Frontend** (Port 3000): web interface
- **API Gateway** (Port 8000): API gateway and routing
- **Auth** (Port 5000): Authentication service
- **User** (Port 6000): User Management service
- **Game** (Port 4000): WebSocket-based game server handling real-time gameplay
- **Tournament** (Port 8080): Tournament management system with REST API

## Project Structure

```
FT_TRANSCENDENCE/
├── frontend/          # frontend application
├── gateway/           # Not implemented
├── auth/              # Not implemented
├── game/              # WebSocket game server
├── tournament/        # Tournament management API
├── docker-compose.yml # Docker orchestration
└── Makefile           # Development commands
```

## Setup

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd FT_TRANSCENDENCE
```

2. Start all services:
```bash
make up
```

3. Access the applications:
- Frontend: http://localhost:3000
- Game API: http://localhost:4000/docs
- Tournament API: http://localhost:8080/documentation

### Development Commands

#### Docker Commands
- `make up` - Start all services
- `make down` - Stop all services
- `make logs` - Show logs from all services
- `make restart` - Restart all services
- `make stop` - Stop all services
- `make clean` - Remove all containers and volumes

#### Individual Service Commands
- `make frontend-logs` - Show frontend logs
- `make game-logs` - Show game logs
- `make tournament-logs` - Show tournament logs


## Prisma Studio

To access Prisma Studio for database management:

```bash
make prisma-studio
```

This will open Prisma Studio at http://localhost:5555, allowing you to view and manage the tournament database through a web interface.

### Other Prisma Commands

- `make prisma-generate` - Generate Prisma client
- `make prisma-migrate` - Run database migrations  
- `make prisma-reset` - Reset database and run migrations
- `make prisma-seed` - Run database seed

