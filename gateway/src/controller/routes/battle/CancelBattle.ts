import { FastifyInstance } from "fastify";
import { battleService } from "../../../service/battle/BattleService";
import { Type } from "@sinclair/typebox";
import { OKSchema } from "../../schemas/OtherSchema";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { UserIdHeaderSchema } from "../../schemas/headers/UserIdHeaderSchema";
import { handleServiceError } from "../../util/response";

const description = `
# 概要
ユーザーをcancel状態にします。
frontendとwebsocket通信を終了します。

# 注意点
 * sateがreadyの時のみ可能です。
 * トーナメントがopenの時のみ可能です。
`;

const RouteSchema = {
  Params: Type.Pick(TournamentSchema(), ["id"]),
  Headers: UserIdHeaderSchema,
  Reply: {
    200: OKSchema(),
  },
} as const;

export default function CancelBattle(fastify: FastifyInstance) {
  fastify.put(
    "/tournaments/:id/battle/cancel",
    {
      schema: {
        description,
        tags: ["Battle"],
        summary: "ユーザーをpending状態にする",
        headers: RouteSchema.Headers,
        params: RouteSchema.Params,
      },
    },
    async (request, reply) => {
      try {
        return battleService.cancelBattle(request);
      } catch (error) {
        handleServiceError(error, reply, "Failed to cancel battle");
      }
    }
  );
}
