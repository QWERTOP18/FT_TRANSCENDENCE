# Auth Service

Authentication microservice for FT_TRANSCENDENCE project.

## Features

- User registration and authentication
- SQLite database with Prisma ORM
- Fastify web framework
- Swagger API documentation
- TypeScript support

## API Endpoints

- `POST /auth/signup` - Create a new user
- `POST /auth/authenticate` - Authenticate existing user
- `GET /auth/users/:id` - Get user by ID
- `GET /health` - Health check
- `GET /docs` - Swagger documentation

## Development

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (optional)
npx prisma studio
```

### Running the Service

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
```

## Docker

```bash
# Build image
docker build -t auth-service .

# Run container
docker run -p 3001:3001 auth-service
```

## API Documentation

Once the service is running, visit `http://localhost:3001/docs` for interactive API documentation. 
