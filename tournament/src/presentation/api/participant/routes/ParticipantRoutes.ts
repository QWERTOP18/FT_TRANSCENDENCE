import { FastifyInstance } from "fastify";
import { CreateParticipantRoute } from "./CreateParticipantRoute";
import { ReadyParticipantRoute } from "./ReadyParticipantRoute";
import { CancelParticipantRoute } from "./CancelParticipantRoute";
import { BattleParticipantRoute } from "./BattleParticipantRoute";

export function ParticipantRoutes(fastify: FastifyInstance) {
	const routes = [
		CreateParticipantRoute,
		ReadyParticipantRoute,
		CancelParticipantRoute,
		BattleParticipantRoute,
	] as const;

	routes.forEach((route) => fastify.register(route));
}
