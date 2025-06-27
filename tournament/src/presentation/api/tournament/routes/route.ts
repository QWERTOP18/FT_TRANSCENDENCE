import { FastifyInstance } from "fastify";
import { TournamentRoutes } from "./TournamentRoutes";

export function TournamentAPIRoutes(fastify: FastifyInstance) {
	fastify.register(TournamentRoutes);
}
