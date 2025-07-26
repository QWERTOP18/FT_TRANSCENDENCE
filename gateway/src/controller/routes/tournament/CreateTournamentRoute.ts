import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { tournamentService } from "../../../service/tournament/TournamentService";
import { Type } from "@sinclair/typebox";
import { UserIdHeaderSchema } from "../../schemas/headers/UserIdHeaderSchema";
import { handleServiceError } from "../../util/response";
import { NotFoundError } from "../../../service/auth/AuthService";

const description = `
  # 概要
  トーナメントを新規で作成します。

  # 注意点
  * 参加者の追加は別途、**参加者の作成**を行う必要があります。
  * マッチの追加はできません。参加者の数に応じて自動的にマッチが作成されます。＜＝この仕様は要相談。例えばオートマッチ機能を作成する？
  `;

const RouteSchema = {
  Params: undefined,
  Querystring: undefined,
  Body: Type.Intersect([
    Type.Pick(TournamentSchema(), ["name", "description", "max_num", "rule"]),
  ]),
  Headers: UserIdHeaderSchema,
  Reply: {
    200: TournamentSchema({ description: "OK" }),
  },
} as const;

export default function CreateTournament(fastify: FastifyInstance) {
  fastify.post(
    "/tournaments",
    {
      schema: {
        tags: ["Tournament"],
        summary: "トーナメントを作成",
        body: RouteSchema.Body,
        headers: RouteSchema.Headers,
        response: {
          200: RouteSchema.Reply[200],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tournament = await tournamentService.createTournament(request);
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
        handleServiceError(error, reply, "Failed to create tournament");
      }
    }
  );
}
