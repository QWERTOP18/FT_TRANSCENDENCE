import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { ParticipantSchema } from "../../schemas/ParticipantSchema";
import { tournamentService } from "../../../service/tournament/TournamentService";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { UserIdHeaderSchema } from "../../schemas/headers/UserIdHeaderSchema";

const description = `
# 概要
トーナメントの参加者を取得します。

# 注意点
`;

const RouteSchema = {
  Params: Type.Pick(TournamentSchema(), ["id"]),
  Querystring: undefined,
  Body: undefined,
  Headers: UserIdHeaderSchema,
  Reply: {
    200: Type.Array(ParticipantSchema(), { description: "トーナメント参加者" }),
  },
} as const;

export default function GetTournamentParticipants(fastify: FastifyInstance) {
  fastify.get(
    "/tournaments/:id/participants",
    {
      schema: {
        description,
        tags: ["Tournament"],
        summary: "参加者一覧を取得",
        params: RouteSchema.Params,
        headers: RouteSchema.Headers,
        response: {
          200: RouteSchema.Reply[200],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const participants =
          await tournamentService.getTournamentParticipants(request);
        return participants;
      } catch (error) {
        reply
          .status(500)
          .send({ error: "Failed to fetch tournament participants" });
      }
    }
  );
}
