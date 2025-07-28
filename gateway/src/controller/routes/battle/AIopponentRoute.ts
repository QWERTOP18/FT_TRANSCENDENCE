import { FastifyInstance } from "fastify";
import { battleService } from "../../../service/battle/BattleService";
import { Type } from "@sinclair/typebox";
import { OKSchema } from "../../schemas/OtherSchema";
import { handleServiceError } from "../../util/response";

const description = `
# 概要
トーナメントとは関係なくAI対戦を開始します。

# 注意点
`;

const RouteSchema = {
  Body: Type.Object({}, { description: "空のオブジェクト" }),
  Reply: {
    200: OKSchema(),
  },
} as const;

export default function AIopponent(fastify: FastifyInstance) {
  fastify.post(
    "/battle/ai",
    {
      schema: {
        description,
        tags: ["Battle"],
        summary: "AI対戦を開始する",
        body: RouteSchema.Body,
        response: {
          200: RouteSchema.Reply[200],
        },
      },
    },
    async (request, reply) => {
      try {
        return battleService.aiOpponent(request);
      } catch (error) {
        handleServiceError(error, reply, "Failed to start AI opponent");
      }
    }
  );
}
