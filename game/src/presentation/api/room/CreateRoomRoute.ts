import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { GameRoomSchema } from "../../schemas/GameRoomSchema";
import { GameRoom } from "../../../domain/GameRoom";
import { GameGateway } from "../../gateway/GameGateway";
import { CreateGameRoomSchema } from "../../schemas/GameRoomSchema";

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
        body: CreateGameRoomSchema(),
        response: {
          200: GameRoomSchema(),
          400: Type.Object({
            error: Type.String({ description: "エラーメッセージ" }),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        console.log(request.body);
        const room = gameGateway.createRoom(request.body as any);
        return room.toSchema();
      } catch (error) {
        console.error(error);
        return reply.status(400).send({ error: "Failed to create room" });
      }
    }
  );
}
