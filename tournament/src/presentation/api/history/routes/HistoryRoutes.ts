import { FastifyInstance } from "fastify";
import { CreateHistoryRoute } from "./CreateHistoryRoute";

export function HistoryRoutes(fastify: FastifyInstance) {
	const routes = [
		CreateHistoryRoute,
	] as const;

	routes.forEach((route) => fastify.register(route));
}
