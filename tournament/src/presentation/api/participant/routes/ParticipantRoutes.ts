import { FastifyInstance } from "fastify";
import { CreateParticipantRoute } from "./CreateParticipantRoute";
import { ReadyParticipantRoute } from "./ReadyParticipantRoute";
import { CancelParticipantRoute } from "./CancelParticipantRoute";

export function ParticipantRoutes(fastify: FastifyInstance) {
	const routes = [
		CreateParticipantRoute,
		ReadyParticipantRoute,
		CancelParticipantRoute,
	] as const;

	routes.forEach((route) => fastify.register(route));
}
