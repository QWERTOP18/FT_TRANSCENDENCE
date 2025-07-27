import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { tournamentService } from "../../../service/tournament/TournamentService";
import {
  TournamentIdSchema,
  TournamentSchema,
} from "../../schemas/TournamentSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { UserIdHeaderSchema } from "../../schemas/headers/UserIdHeaderSchema";
import { handleServiceError } from "../../util/response";

const description = `
# 概要
:idで指定されたトーナメントを取得します。

# 注意点
`;

const RouteSchema = {
  Params: Type.Pick(TournamentSchema(), ["id"]),
  Querystring: undefined,
  Body: undefined,
  Headers: UserIdHeaderSchema,
  Reply: {
    200: TournamentSchema({ description: "OK" }),
    404: ErrorSchema({ description: "見つからなかった" }),
  },
} as const;

export default function GetTournament(fastify: FastifyInstance) {
  fastify.get(
    "/tournaments/:id",
    {
      schema: {
        description,
        tags: ["Tournament"],
        summary: "特定のトーナメントを取得",
        params: RouteSchema.Params,
        headers: RouteSchema.Headers,
        response: {
          200: RouteSchema.Reply[200],
          404: RouteSchema.Reply[404],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tournament = await tournamentService.getTournament(request);
        return tournament;
      } catch (error) {
        handleServiceError(error, reply, "Failed to fetch tournament");
      }
    }
  );
}
