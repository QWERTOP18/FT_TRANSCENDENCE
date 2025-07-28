import Fastify from 'fastify';
import { TournamentAPIRoutes } from './routes/route';
import cors from '@fastify/cors'


async function wakeupServer() {
	const fastify = Fastify();

	await fastify.register(cors, {
		origin: "*",
		credentials: true,
	});
	fastify.addHook('onRequest', (request, reply, done) => {
		console.log(`Request: ${request.method} ${request.url}`);
		done();
	});
	fastify.register(TournamentAPIRoutes);

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
