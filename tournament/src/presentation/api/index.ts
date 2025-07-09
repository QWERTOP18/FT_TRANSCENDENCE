import Fastify from 'fastify';
import { TournamentAPIRoutes } from './routes/route';


async function wakeupServer() {
	const fastify = Fastify();

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
