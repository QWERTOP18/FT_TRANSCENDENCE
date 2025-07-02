import { FastifyInstance } from "fastify";
import { CreateParticipantRoute } from "./CreateParticipantRoute";

export function ParticipantRoutes(fastify: FastifyInstance) {
	const routes = [
		CreateParticipantRoute
	] as const;

	routes.forEach((route) => fastify.register(route));
}
