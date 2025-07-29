import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthService, DuplicateError, NotFoundError } from '../services/authService';
import {
  CreateUserRequestSchema,
  AuthenticateUserRequestSchema,
  UserResponseSchema,
  ErrorResponseSchema
} from '../schemas/userSchema';
import { CreateUserRequest, AuthenticateUserRequest } from '../types/user';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService();

  // Create user route
  fastify.post<{ Body: CreateUserRequest }>(
    '/signup',
    {
      schema: {
        body: CreateUserRequestSchema,
        response: {
          200: UserResponseSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: CreateUserRequest }>, reply: FastifyReply) => {
      try {
        const { name } = request.body;
        const user = await authService.createUser(name);
        
        return {
          id: user.id,
          name: user.name,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        };
      } catch (error) {
        if (error instanceof DuplicateError) {
          return reply.status(400).send({
            error: error.code,
            message: error.message,
            statusCode: 400
          });
        }
        
        fastify.log.error('Failed to create user:', error);
        return reply.status(500).send({
          error: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
          statusCode: 500
        });
      }
    }
  );

  // Authenticate user route
  fastify.post<{ Body: AuthenticateUserRequest }>(
    '/authenticate',
    {
      schema: {
        body: AuthenticateUserRequestSchema,
        response: {
          200: UserResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: AuthenticateUserRequest }>, reply: FastifyReply) => {
      try {
        const { name } = request.body;
        const user = await authService.authenticateUser(name);
        
        return {
          id: user.id,
          name: user.name,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        };
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            error: error.code,
            message: error.message,
            statusCode: 404
          });
        }
        
        fastify.log.error('Failed to authenticate user:', error);
        return reply.status(500).send({
          error: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to authenticate user',
          statusCode: 500
        });
      }
    }
  );

  // Get user by ID route
  fastify.get<{ Params: { id: string } }>(
    '/users/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ユーザーID' }
          },
          required: ['id']
        },
        response: {
          200: UserResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const user = await authService.getUser(id);
        
        return {
          id: user.id,
          name: user.name,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        };
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            error: error.code,
            message: error.message,
            statusCode: 404
          });
        }
        
        fastify.log.error('Failed to get user:', error);
        return reply.status(500).send({
          error: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get user',
          statusCode: 500
        });
      }
    }
  );
} 
