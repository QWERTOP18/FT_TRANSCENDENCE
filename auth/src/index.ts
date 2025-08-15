import Fastify, { FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { authRoutes } from './routes/authRoutes';

const start = async () => {
  const fastify = Fastify({
    logger: {
      level: 'info'
    }
  });

  // Register plugins
  await fastify.register(cors, {
    origin: true,
    credentials: true
  });

  // Register Swagger
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Auth Service API',
        description: 'Authentication microservice for FT_TRANSCENDENCE',
        version: '1.0.0'
      },
      host: 'localhost:3001',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  });
  
  // Health check route
  fastify.get('/ping', async () => {
    return { status: 'pong', service: 'auth-service' };
  });
  // Register routes
  await fastify.register(authRoutes, { prefix: '/auth' });

  fastify.get('/', async (_, reply: FastifyReply) => {
    reply.redirect('/docs');
  });

  try {
    const port = process.env['PORT'] ? parseInt(process.env['PORT']) : 3001;
    const host = process.env['HOST'] || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`Auth service is running on http://${host}:${port}`);
    console.log(`Swagger documentation available at http://${host}:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 
