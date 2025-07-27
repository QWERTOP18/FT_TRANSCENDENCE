import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { HistorySchema } from "../../schemas/HistorySchema";
import { tournamentService } from "../../../service/tournament/TournamentService";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { UserIdHeaderSchema } from "../../schemas/headers/UserIdHeaderSchema";
import { handleServiceError } from "../../util/response";

const description = `
# 概要
トーナメントの対戦結果を取得します。

# 注意点
`;

const RouteSchema = {
  Params: Type.Pick(TournamentSchema(), ["id"]),
  Querystring: undefined,
  Body: undefined,
  Headers: UserIdHeaderSchema,
  Reply: {
    200: Type.Array(HistorySchema(), { description: "トーナメントの対戦結果" }),
  },
} as const;

export default function GetTournamentHistory(fastify: FastifyInstance) {
  fastify.get(
    "/tournaments/:id/history",
    {
      schema: {
        description,
        tags: ["Tournament"],
        summary: "履歴を取得",
        params: RouteSchema.Params,
        headers: RouteSchema.Headers,
        response: {
          200: RouteSchema.Reply[200],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const history = await tournamentService.getTournamentHistory(request);
        return history;
      } catch (error: unknown) {
        handleServiceError(error, reply, "Failed to fetch tournament history");
      }
    }
  );
}
