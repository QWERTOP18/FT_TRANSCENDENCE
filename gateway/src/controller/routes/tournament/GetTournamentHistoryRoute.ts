import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { HistorySchema } from "../../schemas/HistorySchema";
import { tournamentService } from "../../../service/tournament/TournamentService";
import { TournamentSchema } from "../../schemas/TournamentSchema";

const description = `
# 概要
トーナメントの対戦結果を取得します。

# 注意点
`;

const RouteSchema = {
  Params: Type.Pick(TournamentSchema(), ["id"]),
  Querystring: undefined,
  Body: undefined,
  Headers: undefined,
  Reply: {
    200: Type.Array(HistorySchema(), { description: "トーナメントの対戦結果" }),
  },
} as const;

export default function GetTournamentHistory(fastify: FastifyInstance) {
  fastify.get(
    "/tournaments/:id/history",
    {
      schema: {
        tags: ["Tournament"],
        summary: "履歴を取得",
        params: RouteSchema.Params,
        response: {
          200: RouteSchema.Reply[200],
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
