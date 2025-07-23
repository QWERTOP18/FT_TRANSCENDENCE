import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { tournamentService } from "../../../service/tournament/TournamentService";

export default function GetTournament(fastify: FastifyInstance) {
  fastify.get(
    "/tournaments/:id",
    {
      schema: {
        tags: ["Tournament"],
        summary: "特定のトーナメントを取得",
        params: Type.Object({
          id: Type.String({ description: "トーナメントID" }),
        }),
        response: {
          200: TournamentSchema(),
          400: ErrorSchema(),
          500: ErrorSchema(),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const tournament = await tournamentService.getTournament(id);
        return tournament;
      } catch (error) {
        reply.status(500).send({ error: "Failed to fetch tournament" });
      }
    }
  );
}
