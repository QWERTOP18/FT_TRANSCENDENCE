import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { tournamentService } from "../../../service/tournament/TournamentService";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { UserIdHeaderSchema } from "../../schemas/headers/UserIdHeaderSchema";

const description = `
# 概要
トーナメント一覧を取得します。
`;

const RouteSchema = {
  Querystring: undefined,
  Body: undefined,
  Params: Type.Object({}),
  Headers: UserIdHeaderSchema,
  Reply: {
    200: Type.Array(TournamentSchema({ description: "トーナメントの一覧" })),
    404: ErrorSchema({ description: "見つからなかった" }),
  },
} as const;

export default function GetTournaments(fastify: FastifyInstance) {
  fastify.get(
    "/tournaments",
    {
      schema: {
        description,
        tags: ["Tournament"],
        summary: "トーナメント一覧を取得",
        params: RouteSchema.Params,
        headers: RouteSchema.Headers,
        response: {
          200: RouteSchema.Reply[200],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tournaments = await tournamentService.getTournaments();
        return tournaments;
      } catch (error) {
        console.log(error);
        reply.status(500).send({ error: "Failed to fetch tournaments" });
      }
    }
  );
}
