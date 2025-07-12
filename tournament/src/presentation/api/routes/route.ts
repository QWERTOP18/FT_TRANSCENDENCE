import { FastifyInstance } from "fastify";
import { TournamentRoutes } from "./tournaments/TournamentRoutes";
import { HistoryRoutes } from "./histories/HistoryRoutes";
import { ParticipantRoutes } from "./participants/ParticipantRoutes";
import fastifySwagger from "@fastify/swagger";
import { openapiConfig } from "../openapiConfig";
import fastifySwaggerUi from "@fastify/swagger-ui";

export function TournamentAPIRoutes(fastify: FastifyInstance) {
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

	fastify.get('/', (request, reply) => {
		reply.redirect('/documentation');
	})

	fastify.register(TournamentRoutes);
	fastify.register(HistoryRoutes);
	fastify.register(ParticipantRoutes);
}
