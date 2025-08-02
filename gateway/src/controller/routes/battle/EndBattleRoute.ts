import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { battleService } from "../../../service/battle/BattleService";

interface EndBattleParams {
  id: string;
}

interface EndBattleBody {
  winner: {
    id: string;
    score: number;
  };
  loser: {
    id: string;
    score: number;
  };
}

export default async function EndBattleRoute(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post<{
    Params: EndBattleParams;
    Body: EndBattleBody;
  }>(
    "/tournaments/:id/battle/end",
    {
      schema: {
        tags: ["Battle"],
        summary: "バトルの結果を通知",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            winner: {
              type: "object",
              properties: {
                id: { type: "string" },
                score: { type: "number" },
              },
              required: ["id", "score"],
            },
            loser: {
              type: "object",
              properties: {
                id: { type: "string" },
                score: { type: "number" },
              },
              required: ["id", "score"],
            },
          },
          required: ["winner", "loser"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              ok: { type: "boolean" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await battleService.endBattle(request);
        return reply.send(result);
      } catch (error) {
        console.error("Error in end battle:", error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
}
