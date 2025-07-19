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
          user_id: Type.String({ description: "ユーザーID" }),
        }),
        response: {
          200: Type.Object({
            room: Type.Optional(GameRoomSchema()),
          }),
          400: Type.Object({
            error: Type.String({ description: "エラーメッセージ" }),
          }),
        },
      },
    },
    async (request, reply) => {
      const room = gameGateway.createRoom();
      startAiClient(room.room_id);
      console.log(`AI match created in room: ${room.room_id}`);
      return room.toSchema();
    }
  );
}