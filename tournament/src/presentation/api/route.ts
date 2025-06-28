import { FastifyInstance } from "fastify";
import { TournamentRoutes } from "./tournament/routes/TournamentRoutes";
import { MatchRoutes } from "./match/routes/MatchRoutes";

export function TournamentAPIRoutes(fastify: FastifyInstance) {
	fastify.register(TournamentRoutes);
	fastify.register(MatchRoutes);
}
