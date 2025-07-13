[![Docker Compose CI](https://github.com/QWERTOP18/FT_TRANSCENDENCE/actions/workflows/ci.yml/badge.svg)](https://github.com/QWERTOP18/FT_TRANSCENDENCE/actions/workflows/ci.yml)
# FT_TRANSCENDENCE

A multiplayer Pong game with tournament system built with TypeScript, Fastify, and WebSocket.

## Quick Start

### Prerequisites

- Docker and Docker Compose
- GNU Make

### Installation

1. Clone the repository:
```bash
git clone https://github.com/QWERTOP18/FT_TRANSCENDENCE.git
cd FT_TRANSCENDENCE
```

2. Start all services:
```bash
make up
```

3. Access the application:
- http://localhost:3000

## Development

For detailed development documentation, see [README_DEV.md](./README_DEV.md).

### Basic Commands

- `make up` - Start all services
- `make down` - Stop all services
- `make logs` - Show logs from all services
- `make restart` - Restart all services

## Technology Stack

- **Frontend**: TypeScript, Tailwindcss
- **Backend**: TypeScript, Fastify
- **Database**: sqlite, Prisma ORM
- **Real-time**: WebSocket
- **Containerization**: Docker
