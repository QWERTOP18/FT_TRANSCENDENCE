# FT_TRANSCENDENCE

A multiplayer Pong game with tournament system built with TypeScript, Fastify, and WebSocket.

## Services

This project consists of three main services:

- **Frontend** (Port 3000): web interface
- **Game** (Port 4000): WebSocket-based game server handling real-time gameplay
- **Tournament** (Port 8080): Tournament management system with REST API

## Project Structure

```
FT_TRANSCENDENCE/
├── frontend/          # React frontend application
├── game/             # WebSocket game server
├── tournament/       # Tournament management API
├── docker-compose.yml # Docker orchestration
└── Makefile         # Development commands
```

## API Documentation

- Game API: http://localhost:4000/docs
- Tournament API: http://localhost:8080/documentation
