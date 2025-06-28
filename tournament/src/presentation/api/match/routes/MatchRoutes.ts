import { FastifyInstance } from "fastify";
import { CreateMatchRoute } from "./CreateMatcheRoute";
import { DeleteMatchRoute } from "./DeleteMatchRoute";
import { DoneMatchRoute } from "./DoneMatchRoute";
import { GetMatchesRoute } from "./GetMatchesRoute";
import { GetMatchRoute } from "./GetMatchRoute";
import { GetNextMatchRoute } from "./GetNextMatchRoute";
import { StartMatchRoute } from "./StartMatchRoute";
import { UpdateMatchRoute } from "./UpdateMatchRoute";

export function MatchRoutes(fastify: FastifyInstance) {
	const routes = [
		GetMatchesRoute,
		GetMatchRoute,
		CreateMatchRoute,
		StartMatchRoute,
		GetNextMatchRoute,
		DoneMatchRoute,
		UpdateMatchRoute,
		DeleteMatchRoute,
	] as const;

	routes.forEach((route) => fastify.register(route));
}
