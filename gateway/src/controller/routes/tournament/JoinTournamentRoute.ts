import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { tournamentService } from "../../../service/tournament/TournamentService";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { UserIdHeaderSchema } from "../../schemas/headers/UserIdHeaderSchema";
import { handleServiceError } from "../../util/response";
import { NotFoundError } from "../../../service/auth/AuthService";

const description = `
# 概要
:idで指定されたトーナメントに参加します。

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

export default function JoinTournament(fastify: FastifyInstance) {
  fastify.post(
    "/tournaments/:id/join",
    {
      schema: {
        description,
        tags: ["Tournament"],
        summary: "トーナメントに参加",
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
        const tournament = await tournamentService.joinTournament(request);
        return tournament;
      } catch (error) {
        if (error instanceof NotFoundError) {
          reply.status(404).send({
            code: error.code,
            statusCode: 404,
            error: error.name,
            message: error.message,
          });
        }
        handleServiceError(error, reply, "Failed to fetch tournament");
      }
    }
  );
}
