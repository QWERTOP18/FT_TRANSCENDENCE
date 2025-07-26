import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { GameRoomSchema } from "../../schemas/GameRoomSchema";
import { GameRoom } from "../../../domain/GameRoom";
import { GameGateway } from "../../gateway/GameGateway";

const description = `
# 概要
WSSゲートウェイのルートです。二人の参加者から部屋を作成します。

# 注意点

`;

export function CreateRoomRoute(fastify: FastifyInstance, gameGateway: GameGateway) {
  fastify.post(
    "/room",
    {
      schema: {
        description,
        tags: ["participant"],
        summary: "room作成",
        body: Type.Pick(GameRoomSchema(), []),
        response: {
          200: GameRoomSchema(),
          400: Type.Object({
            error: Type.String({ description: "エラーメッセージ" }),
          }),
        },
      },
    },
    async (request, reply) => {
      // GameRoomクラスで部屋インスタンスを生成し、スキーマ形式で返す
      const room = gameGateway.createRoom();
      return room.toSchema();
    }
  );
}
