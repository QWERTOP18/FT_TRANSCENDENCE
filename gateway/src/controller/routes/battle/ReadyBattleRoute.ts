import { FastifyInstance } from "fastify";
import { battleService } from "../../../service/battle/BattleService";
import { Type } from "@sinclair/typebox";
import { OKSchema } from "../../schemas/OtherSchema";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { UserIdHeaderSchema } from "../../schemas/headers/UserIdHeaderSchema";
import { handleServiceError } from "../../util/response";
import { ErrorSchema } from "../../schemas/ErrorSchema";

const description = `
# 概要
ユーザーをready状態にします。
frontendとwebsocket通信を開始します。

# 注意点
 * sateがpendingの時のみ可能です。
 * トーナメントがopenの時のみ可能です。
`;

const RouteSchema = {
  Params: Type.Pick(TournamentSchema(), ["id"]),
  Headers: UserIdHeaderSchema,
  Reply: {
    200: OKSchema(),
    404: ErrorSchema(),
  },
} as const;

export default function ReadyBattle(fastify: FastifyInstance) {
  fastify.put(
    "/tournaments/:id/battle/ready",
    {
      schema: {
        description,
        tags: ["Battle"],
        summary: "ユーザーをready状態にする",
        headers: RouteSchema.Headers,
        params: RouteSchema.Params,
      },
    },
    async (request, reply) => {
      try {
        return battleService.readyBattle(request);
      } catch (error) {
        console.error("Error in ReadyBattle route:", error);
        if (error instanceof Error) {
          reply.status(500).send({
            statusCode: 500,
            error: "Internal Server Error",
            message: error.message,
          });
        } else {
          reply.status(500).send({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Unknown error occurred",
          });
        }
      }
    }
  );
}
