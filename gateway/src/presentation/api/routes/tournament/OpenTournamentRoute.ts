import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { TournamentSchema, ErrorSchema } from "../../schemas/TournamentSchema";
import { openTournament } from "../../../../domain/tournament/openTournament";

export default function OpenTournament(fastify: FastifyInstance) {
  fastify.put(
    "/tournaments/:id/open",
    {
      schema: {
        tags: ["Tournament"],
        summary: "トーナメントを開始",
        params: Type.Object({
          id: Type.String({ description: "トーナメントID" }),
        }),
        response: {
          200: TournamentSchema(),
          404: ErrorSchema(),
          409: ErrorSchema(),
          500: ErrorSchema(),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const tournament = await openTournament(id);
        return tournament;
      } catch (error) {
        reply.status(500).send({ error: "Failed to open tournament" });
      }
    }
  );
}
