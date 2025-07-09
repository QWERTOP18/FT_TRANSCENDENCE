import { FastifyInstance } from "fastify";
import { TournamentRoutes } from "./tournaments/TournamentRoutes";
import { HistoryRoutes } from "./histories/HistoryRoutes";
import { ParticipantRoutes } from "./participants/ParticipantRoutes";

export function TournamentAPIRoutes(fastify: FastifyInstance) {
	fastify.register(TournamentRoutes);
	fastify.register(HistoryRoutes);
	fastify.register(ParticipantRoutes);
}
