import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { ParticipantSchema } from "../../schemas/ParticipantSchema";
import { tournamentService } from "../../../service/tournament/TournamentService";
import { TournamentSchema } from "../../schemas/TournamentSchema";

const description = `
# 概要
トーナメントの参加者を取得します。

# 注意点
`;

const RouteSchema = {
  Params: Type.Pick(TournamentSchema(), ["id"]),
  Querystring: undefined,
  Body: undefined,
  Headers: undefined,
  Reply: {
    200: Type.Array(ParticipantSchema(), { description: "トーナメント参加者" }),
  },
} as const;

export default function GetTournamentParticipants(fastify: FastifyInstance) {
  fastify.get(
    "/tournaments/:id/participants",
    {
      schema: {
        tags: ["Tournament"],
        summary: "参加者一覧を取得",
        params: RouteSchema.Params,
        response: {
          200: RouteSchema.Reply[200],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const participants =
          await tournamentService.getTournamentParticipants(id);
        return participants;
      } catch (error) {
        reply
          .status(500)
          .send({ error: "Failed to fetch tournament participants" });
      }
    }
  );
}
