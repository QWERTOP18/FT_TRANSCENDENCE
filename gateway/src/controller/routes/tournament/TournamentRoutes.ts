import { FastifyInstance } from "fastify";
import GetTournaments from "./GetTournamentsRoute";
import GetTournament from "./GetTournamentRoute";
import CreateTournament from "./CreateTournamentRoute";
import OpenTournament from "./OpenTournamentRoute";
import GetTournamentParticipants from "./GetTournamentParticipantsRoute";
import GetTournamentHistory from "./GetTournamentHistoryRoute";
import JoinTournament from "./JoinTournamentRoute";

export function TournamentRoutes(fastify: FastifyInstance) {
  const routes = [
    GetTournaments,
    GetTournament,
    CreateTournament,
    OpenTournament,
    GetTournamentParticipants,
    JoinTournament,
    // GetTournamentHistory,
  ] as const;

  routes.forEach((route) => fastify.register(route));
}
