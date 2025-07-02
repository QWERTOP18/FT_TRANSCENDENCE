import { FastifyInstance } from "fastify";
import { TournamentRoutes } from "./tournament/routes/TournamentRoutes";

export function TournamentAPIRoutes(fastify: FastifyInstance) {
	fastify.register(TournamentRoutes);
}
