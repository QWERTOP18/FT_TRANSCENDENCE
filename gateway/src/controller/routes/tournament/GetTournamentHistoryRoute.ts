import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { HistorySchema } from "../../schemas/TournamentSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { tournamentService } from "../../../service/tournament/TournamentService";

export default function GetTournamentHistory(fastify: FastifyInstance) {
  fastify.get(
    "/tournaments/:id/history",
    {
      schema: {
        tags: ["Tournament"],
        summary: "履歴を取得",
        params: Type.Object({
          id: Type.String({ description: "トーナメントID" }),
        }),
        response: {
          200: Type.Array(HistorySchema()),
          400: ErrorSchema(),
          500: ErrorSchema(),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const history = await tournamentService.getTournamentHistory(id);
        return history;
      } catch (error) {
        reply.status(500).send({ error: "Failed to fetch tournament history" });
      }
    }
  );
}
