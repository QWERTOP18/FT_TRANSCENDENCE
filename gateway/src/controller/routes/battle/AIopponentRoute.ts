import { FastifyInstance } from "fastify";
import { battleService } from "../../../service/battle/BattleService";
import { Type } from "@sinclair/typebox";
import { OKSchema } from "../../schemas/OtherSchema";
import { handleServiceError } from "../../util/response";
import { GameRoomId } from "../../schemas/GameRoomSchema";

const description = `
# 概要
トーナメントとは関係なくAI対戦を開始します。

# 注意点
`;

const RouteSchema = {
  Body: Type.Object({}, { description: "空のオブジェクト" }),
  Reply: {
    200: GameRoomId(),
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
        return (await battleService.aiOpponent(request)).room_id;
      } catch (error) {
        handleServiceError(error, reply, "Failed to start AI opponent");
      }
    }
  );
}
