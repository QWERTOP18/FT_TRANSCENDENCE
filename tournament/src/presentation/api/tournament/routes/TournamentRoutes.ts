import { FastifyInstance } from "fastify";
import { CloseTournamentRoute } from "./CloseTournamentRoute";
import { CreateTournamentRoute } from "./CreateTournamentRoute";
import { GetTournamentParticipantsRoute } from "./GetTournamentParticipantsRoute";
import { GetTournamentRoute } from "./GetTournamentRoute";
import { GetTournamentsRoute } from "./GetTournamentsRoute";
import { OpenTournamentRoute } from "./OpenTournamentRoute";
import { GetTournamentHistoryRoute } from "./GetTournamentHistoryRoute";

export function TournamentRoutes(fastify: FastifyInstance) {
	const routes = [
		GetTournamentsRoute,
		GetTournamentRoute,
		CreateTournamentRoute,
		OpenTournamentRoute,
		CloseTournamentRoute,
		GetTournamentParticipantsRoute,
		GetTournamentHistoryRoute,
	] as const;

	routes.forEach((route) => fastify.register(route));
}
