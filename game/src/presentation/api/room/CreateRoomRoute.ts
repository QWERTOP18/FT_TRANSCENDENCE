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
        body: Type.Object({
            player1_id: Type.String({ description: "プレイヤー1のユーザーID"}),
            player2_id: Type.String({ description: "プレイヤー2のユーザーID"}),
            winningScore: Type.Number({ description: "ゲームに勝利するために必要な点数"})
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
      // GameRoomクラスで部屋インスタンスを生成し、スキーマ形式で返す
      const { player1_id, player2_id, winningScore } = request.body as {
        player1_id: string;
        player2_id: string;
        winningScore: number;
      };
      const room = gameGateway.createRoom(player1_id, player2_id, winningScore);
      return room.toSchema();
    }
  );
}
