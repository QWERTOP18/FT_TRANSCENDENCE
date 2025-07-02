import { FastifyInstance } from "fastify";
import { CloseTournamentRoute } from "./CloseTournamentRoute";
import { CreateTournamentRoute } from "./CreateTournamentRoute";
import { DeleteTournamentRoute } from "./DeleteTournamentRoute";
import { GetTournamentParticipantsRoute } from "./GetTournamentParticipantsRoute";
import { GetTournamentRoute } from "./GetTournamentRoute";
import { GetTournamentsRoute } from "./GetTournamentsRoute";
import { OpenTournamentRoute } from "./OpenTournamentRoute";
import { UpdateTournamentRoute } from "./UpdateTournamentRoute";

export function TournamentRoutes(fastify: FastifyInstance) {
	const routes = [
		GetTournamentsRoute,
		GetTournamentRoute,
		CreateTournamentRoute,
		UpdateTournamentRoute,
		DeleteTournamentRoute,
		OpenTournamentRoute,
		CloseTournamentRoute,
		GetTournamentParticipantsRoute,
	] as const;

	routes.forEach((route) => fastify.register(route));
}
