import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { ParticipantSchema, ErrorSchema } from "../../schemas/TournamentSchema";
import { getTournamentParticipants } from "../../../../domain/tournament/getTournamentParticipants";

export default function GetTournamentParticipants(fastify: FastifyInstance) {
  fastify.get(
    "/tournaments/:id/participants",
    {
      schema: {
        tags: ["Tournament"],
        summary: "参加者一覧を取得",
        params: Type.Object({
          id: Type.String({ description: "トーナメントID" }),
        }),
        response: {
          200: Type.Array(ParticipantSchema()),
          404: ErrorSchema(),
          500: ErrorSchema(),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const participants = await getTournamentParticipants(id);
        return participants;
      } catch (error) {
        reply
          .status(500)
          .send({ error: "Failed to fetch tournament participants" });
      }
    }
  );
}
