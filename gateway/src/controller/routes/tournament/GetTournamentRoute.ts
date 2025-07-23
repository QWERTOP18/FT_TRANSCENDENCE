import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { tournamentService } from "../../../service/tournament/TournamentService";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";

const description = `
# 概要
:idで指定されたトーナメントを取得します。

# 注意点
`;

const RouteSchema = {
  Params: Type.Pick(TournamentSchema(), ["id"]),
  Querystring: undefined,
  Body: undefined,
  Headers: undefined,
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
        response: {
          200: RouteSchema.Reply[200],
          404: RouteSchema.Reply[404],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const tournament = await tournamentService.getTournament(id);
        return tournament;
      } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "Failed to fetch tournament" });
      }
    }
  );
}
