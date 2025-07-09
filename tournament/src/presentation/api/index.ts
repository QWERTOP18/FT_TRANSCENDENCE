import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { openapiConfig } from './openapiConfig';
import { TournamentAPIRoutes } from './routes/route';


async function wakeupServer() {
	const fastify = Fastify();

	fastify.setErrorHandler((err, request, reply) => {
		console.error(err.stack);
		reply
			.status(err.statusCode || 500)
			.send({
				statusCode: err.statusCode || 500,
				code: err.code || 'TRT_UNKNOWN_ERROR',
				error: err.name || 'Unknown Error Name',
				message: err.message || 'Unknown Error Message',
			});
	});

	fastify.setNotFoundHandler((request, reply) => {
		reply
			.status(404).send({
				statusCode: 404,
				code: 'TRT_ERR_NOT_FOUND',
				error: 'Not Found',
				message: `Route ${request.method}:${request.url} not found`,
			});
	});

	fastify.register(fastifySwagger, {
		openapi: openapiConfig
	});
	fastify.register(fastifySwaggerUi);

	fastify.register(TournamentAPIRoutes);

	fastify.get('/', (request, reply) => {
		reply.redirect('/documentation');
	})

	return await fastify.listen({
		port: 8080,
		host: '0.0.0.0',
	});
}

export async function runApiServer() {
	return await wakeupServer()
		.then((address) => {
			console.log(`server listening on ${address}`)
		})
		.catch((err) => {
			console.log('Error starting server:', err)
			process.exit(1)
		})
}
