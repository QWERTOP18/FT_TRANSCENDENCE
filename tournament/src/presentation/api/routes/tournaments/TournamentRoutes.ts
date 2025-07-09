import { FastifyInstance } from "fastify";
import { CreateTournamentRoute } from "./CreateTournamentRoute";
import { GetTournamentHistoryRoute } from "./GetTournamentHistoryRoute";
import { GetTournamentParticipantsRoute } from "./GetTournamentParticipantsRoute";
import { GetTournamentRoute } from "./GetTournamentRoute";
import { GetTournamentsRoute } from "./GetTournamentsRoute";
import { OpenTournamentRoute } from "./OpenTournamentRoute";

export function TournamentRoutes(fastify: FastifyInstance) {
	const routes = [
		GetTournamentsRoute,
		GetTournamentRoute,
		CreateTournamentRoute,
		OpenTournamentRoute,
		GetTournamentParticipantsRoute,
		GetTournamentHistoryRoute,
	] as const;

	routes.forEach((route) => fastify.register(route));
}
