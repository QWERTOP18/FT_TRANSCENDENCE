"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const authRoutes_1 = require("./routes/authRoutes");
const start = async () => {
    const fastify = (0, fastify_1.default)({
        logger: {
            level: 'info'
        }
    });
    await fastify.register(cors_1.default, {
        origin: true,
        credentials: true
    });
    await fastify.register(swagger_1.default, {
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
    await fastify.register(swagger_ui_1.default, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        }
    });
    await fastify.register(authRoutes_1.authRoutes, { prefix: '/auth' });
    fastify.get('/health', async () => {
        return { status: 'ok', service: 'auth-service' };
    });
    fastify.get('/', async (_, reply) => {
        reply.redirect('/docs');
    });
    try {
        const port = process.env['PORT'] ? parseInt(process.env['PORT']) : 5000;
        const host = process.env['HOST'] || '0.0.0.0';
        await fastify.listen({ port, host });
        console.log(`Auth service is running on http://${host}:${port}`);
        console.log(`Swagger documentation available at http://${host}:${port}/docs`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map