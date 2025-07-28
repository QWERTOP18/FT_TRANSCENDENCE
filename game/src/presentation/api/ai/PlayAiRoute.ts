import { FastifyInstance } from "fastify";
import { GameGateway } from "../../gateway/GameGateway";
import { startAiClient } from "../../../services/ai/ai-client";
import { Type } from "@sinclair/typebox";
import { GameRoomSchema } from "../../schemas/GameRoomSchema";

const description = `
# 概要
AI対戦用のルートです。AI対戦用のルームを作成します。
`

export function PlayAiRoute(fastify: FastifyInstance, gameGateway: GameGateway) {
  fastify.post(
    "/play-ai",
    {
      schema: {
        description,
        tags: ["participant"],
        summary: "AI対戦用のルーム作成",
        body: Type.Object({
          aiLevel: Type.Number({ description: "AIレベル" }),
          user_id: Type.String({ description: "ユーザーID" }),
        }),
        response: {
          200: GameRoomSchema(),
          400: Type.Object({
            error: Type.String({ description: "エラーメッセージ" }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { aiLevel, user_id } = request.body as {
        aiLevel: number
        user_id: string
      };
      console.log(aiLevel);
      const room = gameGateway.createRoom({
        tournament_id: "ai_match",
        player1_id: user_id,
        player2_id: "ai_player",
        winning_score: 10,
      });
      console.log(room);
      // 非同期処理
      startAiClient(room.room_id, aiLevel);
      console.log(`AI match created in room: ${room.room_id}`);
      return room.toSchema();
    }
  );
}
