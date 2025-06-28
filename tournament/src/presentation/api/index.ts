import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { openapiConfig } from './openapiConfig';
import { TournamentAPIRoutes } from './route';


async function wakeupServer() {
	const fastify = Fastify();

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
