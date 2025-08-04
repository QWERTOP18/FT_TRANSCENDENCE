# API Documentation

This document describes the APIs used by the CLI User client for interacting with the FT_TRANSCENDENCE game server.

## Authentication API

### Endpoints

#### POST /auth/login
Authenticates a user and returns a session token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string"
  }
}
```

#### POST /auth/register
Registers a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

## Tournament API

### Endpoints

#### GET /tournaments
Retrieves a list of available tournaments.

**Response:**
```json
{
  "tournaments": [
    {
      "id": "string",
      "name": "string",
      "status": "string",
      "participants": "number",
      "maxParticipants": "number"
    }
  ]
}
```

#### POST /tournaments/{id}/join
Joins a specific tournament.

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

#### GET /tournaments/{id}/participants
Gets the list of participants for a tournament.

**Response:**
```json
{
  "participants": [
    {
      "id": "string",
      "username": "string",
      "score": "number"
    }
  ]
}
```

## Battle API

### Endpoints

#### POST /battles/start
Initiates a new battle.

**Request Body:**
```json
{
  "tournamentId": "string",
  "opponentType": "AI" | "PLAYER"
}
```

**Response:**
```json
{
  "battleId": "string",
  "status": "string",
  "opponent": {
    "id": "string",
    "username": "string"
  }
}
```

#### GET /battles/{id}/status
Gets the current status of a battle.

**Response:**
```json
{
  "battleId": "string",
  "status": "string",
  "score": {
    "player": "number",
    "opponent": "number"
  }
}
```

#### POST /battles/{id}/cancel
Cancels an ongoing battle.

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

## Game WebSocket API

### Connection

Connect to the game WebSocket server:
```
ws://server:port/game
```

### Message Types

#### Join Room
```json
{
  "type": "join_room",
  "roomId": "string"
}
```

#### Game State Update
```json
{
  "type": "game_state",
  "data": {
    "ball": {
      "x": "number",
      "y": "number"
    },
    "paddles": {
      "left": {
        "y": "number"
      },
      "right": {
        "y": "number"
      }
    },
    "score": {
      "left": "number",
      "right": "number"
    }
  }
}
```

#### Player Input
```json
{
  "type": "player_input",
  "action": "UP" | "DOWN" | "STOP"
}
```

## Error Responses

All APIs may return error responses in the following format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

### Common Error Codes

- `AUTHENTICATION_FAILED`: Invalid credentials
- `TOURNAMENT_NOT_FOUND`: Tournament does not exist
- `TOURNAMENT_FULL`: Tournament has reached maximum participants
- `BATTLE_NOT_FOUND`: Battle does not exist
- `INVALID_INPUT`: Request data is invalid
- `SERVER_ERROR`: Internal server error

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Authentication endpoints: 5 requests per minute
- Tournament endpoints: 10 requests per minute
- Battle endpoints: 20 requests per minute

## Authentication

Most API endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## WebSocket Authentication

WebSocket connections require authentication via query parameter:

```
ws://server:port/game?token=<token>
``` 
