import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { battleService } from "../../../service/battle/BattleService";

interface GetRoomIdParams {
  id: string;
}

export default async function GetRoomIdRoute(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get<{
    Params: GetRoomIdParams;
  }>(
    "/tournaments/:id/room",
    {
      schema: {
        tags: ["Battle"],
        summary: "トーナメントのゲームルームIDを取得",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              room_id: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const tournamentId = request.params.id;
        const userId = request.headers["x-user-id"] as string;

        if (!userId) {
          return reply
            .status(400)
            .send({ error: "x-user-id header is required" });
        }

        const roomId = await battleService.getRoomId(tournamentId, userId);

        if (!roomId) {
          return reply
            .status(404)
            .send({ error: "Room not found or user is not a participant" });
        }

        return reply.send({ room_id: roomId });
      } catch (error) {
        console.error("Error in get room id:", error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
}
