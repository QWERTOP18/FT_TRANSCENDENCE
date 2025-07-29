"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const authService_1 = require("../services/authService");
const userSchema_1 = require("../schemas/userSchema");
async function authRoutes(fastify) {
    const authService = new authService_1.AuthService();
    fastify.post('/signup', {
        schema: {
            body: userSchema_1.CreateUserRequestSchema,
            response: {
                200: userSchema_1.UserResponseSchema,
                400: userSchema_1.ErrorResponseSchema,
                500: userSchema_1.ErrorResponseSchema
            }
        }
    }, async (request, reply) => {
        try {
            const { name } = request.body;
            const user = await authService.createUser(name);
            return {
                id: user.id,
                name: user.name,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString()
            };
        }
        catch (error) {
            if (error instanceof authService_1.DuplicateError) {
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
    });
    fastify.post('/authenticate', {
        schema: {
            body: userSchema_1.AuthenticateUserRequestSchema,
            response: {
                200: userSchema_1.UserResponseSchema,
                404: userSchema_1.ErrorResponseSchema,
                500: userSchema_1.ErrorResponseSchema
            }
        }
    }, async (request, reply) => {
        try {
            const { name } = request.body;
            const user = await authService.authenticateUser(name);
            return {
                id: user.id,
                name: user.name,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString()
            };
        }
        catch (error) {
            if (error instanceof authService_1.NotFoundError) {
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
    });
    fastify.get('/users/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ユーザーID' }
                },
                required: ['id']
            },
            response: {
                200: userSchema_1.UserResponseSchema,
                404: userSchema_1.ErrorResponseSchema,
                500: userSchema_1.ErrorResponseSchema
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const user = await authService.getUser(id);
            return {
                id: user.id,
                name: user.name,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString()
            };
        }
        catch (error) {
            if (error instanceof authService_1.NotFoundError) {
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
    });
}
//# sourceMappingURL=authRoutes.js.map