import { FastifyInstance } from "fastify";
import { CancelBattleRoute } from "./CancelBattleRoute";
import { EndBattleRoute } from "./EndBattleRoute";
import { StartBattleRoute } from "./StartBattleRoute";

export function BattleRoutes(fastify: FastifyInstance) {
	const routes = [
		StartBattleRoute,
		EndBattleRoute,
		CancelBattleRoute,
	] as const;

	routes.forEach((route) => fastify.register(route));
}
