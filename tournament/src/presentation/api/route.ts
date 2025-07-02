import { FastifyInstance } from "fastify";
import { TournamentRoutes } from "./tournament/routes/TournamentRoutes";
import { HistoryRoutes } from "./history/routes/HistoryRoutes";
import { ParticipantRoutes } from "./participant/routes/ParticipantRoutes";

export function TournamentAPIRoutes(fastify: FastifyInstance) {
	fastify.register(TournamentRoutes);
	fastify.register(HistoryRoutes);
	fastify.register(ParticipantRoutes);
}
