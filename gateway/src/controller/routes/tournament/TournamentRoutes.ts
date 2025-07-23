import { FastifyInstance } from "fastify";
import GetTournaments from "./GetTournamentsRoute";
import GetTournament from "./GetTournamentRoute";
import CreateTournament from "./CreateTournamentRoute";
import OpenTournament from "./OpenTournamentRoute";
import GetTournamentParticipants from "./GetTournamentParticipantsRoute";
import GetTournamentHistory from "./GetTournamentHistoryRoute";

export function TournamentRoutes(fastify: FastifyInstance) {
  const routes = [
    GetTournaments,
    GetTournament,
    CreateTournament,
    OpenTournament,
    GetTournamentParticipants,
    // GetTournamentHistory,
  ] as const;

  routes.forEach((route) => fastify.register(route));
}
