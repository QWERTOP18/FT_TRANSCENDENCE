import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { GameRoomSchema } from "../../schemas/GameRoomSchema";
import { GameRoom } from "../../../domain/GameRoom";
import { GameGateway } from "../../gateway/GameGateway";

const description = `
# 概要
開発用のエンドポイントです。二人の参加者が/readyを叩くと、内部的に/roomを叩いて部屋を作成します。

# 注意点
本番環境ではAPI gatewayがこの処理を担当します。
`;

// グローバルな状態管理（実際の本番では適切な状態管理を使用）
let readyUsers: Set<string> = new Set();

export function ReadyRoute(fastify: FastifyInstance, gameGateway: GameGateway) {
  fastify.post(
    "/ready",
    {
      schema: {
        description,
        tags: ["participant"],
        summary: "ready状態の登録",
        body: Type.Object({
          user_id: Type.String({ description: "ユーザーID" }),
        }),
        response: {
          200: Type.Object({
            message: Type.String({ description: "メッセージ" }),
            ready_count: Type.Number({ description: "ready状態のユーザー数" }),
            room: Type.Optional(GameRoomSchema()),
          }),
          400: Type.Object({
            error: Type.String({ description: "エラーメッセージ" }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { user_id } = request.body as { user_id: string };

      // ユーザーをready状態に追加
      readyUsers.add(user_id);
      const readyCount = readyUsers.size;

      // 二人揃った場合、部屋を作成
      if (readyCount === 2) {
        const room = gameGateway.createRoom();
        const roomData = room.toSchema();
        
        // ready状態をリセット
        readyUsers.clear();
        
        return {
          message: "二人揃いました！部屋を作成しました。",
          ready_count: readyCount,
          room: roomData,
        };
      }

      // まだ二人揃っていない場合
      return {
        message: `ready状態に登録しました。現在${readyCount}人がready状態です。`,
        ready_count: readyCount,
      };
    }
  );
} 